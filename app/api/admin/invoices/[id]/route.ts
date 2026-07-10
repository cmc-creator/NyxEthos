import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/app/api/admin/_lib/auth';
import { logAdminAuditAction } from '@/app/api/admin/_lib/audit';

const schema = z.object({
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']),
});

type InvoiceDeps = {
  requireAdminFn: typeof requireAdmin;
  logAdminAuditActionFn: typeof logAdminAuditAction;
};

export function createPatchHandler(deps: InvoiceDeps = {
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
      return NextResponse.json({ error: 'Invalid invoice status update' }, { status: 400 });
    }

    const patch: { status: string; paid_at?: string | null } = { status: parsed.data.status };
    if (parsed.data.status === 'paid') {
      patch.paid_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from('invoices')
      .update(patch)
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
    }

    if (user?.id) {
      await deps.logAdminAuditActionFn(supabase as unknown as Parameters<typeof logAdminAuditAction>[0], user.id, {
        action: 'invoice.status.updated',
        entityType: 'invoice',
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
