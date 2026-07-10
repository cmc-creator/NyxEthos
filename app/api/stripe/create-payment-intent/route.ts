import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-04-22.dahlia',
  });
}

const schema = z.object({
  amount: z.number().int().min(50), // cents, minimum $0.50
  invoice_id: z.string().min(1),
  customer_email: z.string().email(),
  description: z.string().min(1),
});

async function createSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}

type StripePaymentIntent = {
  id: string;
  client_secret: string | null;
};

type CreatePaymentIntentDeps = {
  createSupabaseServerFn: typeof createSupabaseServer;
  createPaymentIntentFn: (input: {
    amount: number;
    customer_email: string;
    description: string;
    invoice_id: string;
  }) => Promise<StripePaymentIntent>;
};

export function createPostHandler(
  deps: CreatePaymentIntentDeps = {
    createSupabaseServerFn: createSupabaseServer,
    createPaymentIntentFn: async ({ amount, customer_email, description, invoice_id }) => {
      const stripe = getStripe();
      return stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        description,
        receipt_email: customer_email,
        metadata: { invoice_id },
        automatic_payment_methods: { enabled: true },
      });
    },
  }
) {
  return async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const parsed = schema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Invalid request', details: parsed.error.flatten() },
          { status: 400 }
        );
      }

      const { amount, invoice_id, customer_email, description } = parsed.data;

      const supabase = await deps.createSupabaseServerFn();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { data: adminRow } = await supabase
        .from('admins')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      let invoiceQuery = supabase
        .from('invoices')
        .select('id, total, customer_id, status')
        .eq('id', invoice_id)
        .single();

      if (!adminRow) {
        const { data: customer } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (!customer) {
          return NextResponse.json({ error: 'Customer profile not found' }, { status: 403 });
        }

        invoiceQuery = supabase
          .from('invoices')
          .select('id, total, customer_id, status')
          .eq('id', invoice_id)
          .eq('customer_id', customer.id)
          .single();
      }

      const { data: invoice, error: invoiceError } = await invoiceQuery;
      if (invoiceError || !invoice) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }

      if (invoice.status === 'paid') {
        return NextResponse.json({ error: 'Invoice already paid' }, { status: 400 });
      }

      const expectedAmount = Math.round(Number(invoice.total || 0) * 100);
      if (expectedAmount > 0 && amount !== expectedAmount) {
        return NextResponse.json({ error: 'Payment amount does not match invoice total' }, { status: 400 });
      }

      const paymentIntent = await deps.createPaymentIntentFn({
        amount,
        customer_email,
        description,
        invoice_id,
      });

      await supabase
        .from('invoices')
        .update({ stripe_payment_id: paymentIntent.id })
        .eq('id', invoice_id);

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (err) {
      console.error('create-payment-intent error:', err);
      return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
    }
  };
}

export const POST = createPostHandler();
