type AuditPayload = {
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
};

type AuditInsertResult = {
  error: unknown;
};

type AuditSupabase = {
  from: (table: 'admin_audit_logs') => {
    insert: (payload: Record<string, unknown>) => PromiseLike<AuditInsertResult> | AuditInsertResult;
  };
};

export async function logAdminAuditAction(
  supabase: AuditSupabase,
  adminUserId: string,
  payload: AuditPayload
) {
  const { error } = await supabase.from('admin_audit_logs').insert({
    admin_user_id: adminUserId,
    action: payload.action,
    entity_type: payload.entityType,
    entity_id: payload.entityId,
    metadata: payload.metadata || {},
  });

  if (error) {
    console.error('Failed to write admin audit log:', error);
  }
}
