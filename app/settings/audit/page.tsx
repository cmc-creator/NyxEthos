import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AuditLogClient from "./AuditLogClient";
import { prisma } from "@/lib/db";

export default async function AuditLogPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/sign-in");
  const user = session.user as { id: string; orgId: string; email?: string | null; role?: string };
  if (user.role === "employee") redirect("/settings");

  const logs = await prisma.auditLog.findMany({
    where: { orgId: user.orgId },
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  return <AuditLogClient logs={JSON.parse(JSON.stringify(logs))} />;
}
