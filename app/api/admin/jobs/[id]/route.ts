import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/app/api/admin/_lib/auth';
import { logAdminAuditAction } from '@/app/api/admin/_lib/audit';

const schema = z.object({
  status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']),
});

type JobDeps = {
  requireAdminFn: typeof requireAdmin;
  logAdminAuditActionFn: typeof logAdminAuditAction;
};

export function createPatchHandler(deps: JobDeps = {
  requireAdminFn: requireAdmin,
  logAdminAuditActionFn: logAdminAuditAction,
}) {
  return async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { error, supabase, user } = await deps.requireAdminFn();
    if (error) {
      return error;
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid status update' }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: parsed.data.status })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
    }

    if (user?.id) {
      await deps.logAdminAuditActionFn(supabase as unknown as Parameters<typeof logAdminAuditAction>[0], user.id, {
        action: 'booking.status.updated',
        entityType: 'booking',
        entityId: id,
        metadata: {
          status: parsed.data.status,
        },
      });
    }

    return NextResponse.json({ success: true });
  };
}

export const PATCH = createPatchHandler();
