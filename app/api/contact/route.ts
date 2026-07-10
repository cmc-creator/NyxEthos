import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const RATE_LIMIT_PER_HOUR = 8;

const schema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(7),
  service_type: z.string().min(1),
  vehicle: z.string().min(2),
  message: z.string().min(10).max(3000),
});

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function getIpAddress(req: NextRequest): string {
  const xForwardedFor = req.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  const xRealIp = req.headers.get('x-real-ip');
  if (xRealIp) {
    return xRealIp.trim();
  }

  return 'unknown';
}

function hashIp(ip: string): string {
  const salt = process.env.CONTACT_RATE_LIMIT_SALT || 'nyxethos-contact-default-salt';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

type ContactSupabase = {
  from: (table: string) => {
    select: (
      columns: string,
      options?: { count?: 'exact'; head?: boolean }
    ) => {
      eq: (field: string, value: string) => {
        gte: (
          field: string,
          value: string
        ) => Promise<{ count: number | null; error: unknown }>;
      };
    };
    insert: (payload: Record<string, unknown>) => Promise<{ error: unknown }>;
  };
};

type ContactRouteDeps = {
  getSupabaseAdminFn: () => ContactSupabase;
  getIpAddressFn: (req: NextRequest) => string;
  hashIpFn: (ip: string) => string;
};

export function createPostHandler(
  deps: ContactRouteDeps = {
    getSupabaseAdminFn: getSupabaseAdmin as unknown as () => ContactSupabase,
    getIpAddressFn: getIpAddress,
    hashIpFn: hashIp,
  }
) {
  return async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const parsed = schema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid contact request' }, { status: 400 });
      }

      const ipHash = deps.hashIpFn(deps.getIpAddressFn(req));
      const userAgent = req.headers.get('user-agent') || null;
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

      const supabase = deps.getSupabaseAdminFn();

      const { count, error: countError } = await supabase
        .from('contact_rate_limits')
        .select('id', { count: 'exact', head: true })
        .eq('ip_hash', ipHash)
        .gte('created_at', oneHourAgo);

      if (countError) {
        console.error('Contact rate-limit count error:', countError);
        return NextResponse.json({ error: 'Unable to process request' }, { status: 500 });
      }

      if ((count || 0) >= RATE_LIMIT_PER_HOUR) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }

      const { error: rateInsertError } = await supabase.from('contact_rate_limits').insert({
        ip_hash: ipHash,
      });

      if (rateInsertError) {
        console.error('Contact rate-limit insert error:', rateInsertError);
        return NextResponse.json({ error: 'Unable to process request' }, { status: 500 });
      }

      const { error: submissionError } = await supabase.from('contact_submissions').insert({
        ...parsed.data,
        ip_hash: ipHash,
        user_agent: userAgent,
      });

      if (submissionError) {
        console.error('Contact submission insert error:', submissionError);
        return NextResponse.json({ error: 'Unable to submit contact form' }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Contact API error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}

export const POST = createPostHandler();
