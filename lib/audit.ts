import { prisma } from "@/lib/db";

export async function logAudit({
  orgId,
  userId,
  userEmail,
  action,
  entityType,
  entityId,
  details,
}: {
  orgId: string;
  userId?: string | null;
  userEmail?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: Record<string, unknown> | string | null;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        orgId,
        userId: userId ?? null,
        userEmail: userEmail ?? null,
        action,
        entityType,
        entityId: entityId ?? null,
        details: details ? (typeof details === "string" ? details : JSON.stringify(details)) : null,
      },
    });
  } catch (e) {
    // Non-blocking — never let audit failure crash a request
    console.error("[audit] Failed to write log:", e);
  }
}
