import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendInviteEmail } from "@/lib/email";
import { logAudit } from "@/lib/audit";

function getOrgId(s: { user?: { orgId?: string; id?: string; email?: string | null } } | null) {
  return { orgId: s?.user?.orgId ?? null, userId: s?.user?.id ?? null, userEmail: s?.user?.email ?? null };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const { orgId } = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tokens = await prisma.inviteToken.findMany({ where: { orgId }, orderBy: { createdAt: "desc" }, take: 50 });
  const users = await prisma.user.findMany({ where: { orgId }, select: { id: true, name: true, email: true, role: true, createdAt: true } });
  return NextResponse.json({ tokens, users });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const { orgId, userId, userEmail } = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email, role } = await req.json();
  if (!email || !email.includes("@")) return NextResponse.json({ error: "Valid email required" }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.orgId === orgId) return NextResponse.json({ error: "Already a member" }, { status: 409 });

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const invite = await prisma.inviteToken.create({
    data: { orgId, email, role: role || "admin", expiresAt },
  });

  // Send invite email
  const org = await prisma.organization.findUnique({ where: { id: orgId }, select: { name: true } });
  const baseUrl = process.env.NEXTAUTH_URL ?? "https://nyxethos.vercel.app";
  await sendInviteEmail({
    to: email,
    orgName: org?.name ?? "your organization",
    role: role || "admin",
    inviteUrl: `${baseUrl}/invite/${invite.token}`,
  });

  await logAudit({ orgId, userId, userEmail, action: "invite.create", entityType: "InviteToken", entityId: invite.id, details: { email, role } });

  return NextResponse.json(invite, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  const { orgId, userId, userEmail } = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  await prisma.inviteToken.deleteMany({ where: { id, orgId } });
  await logAudit({ orgId, userId, userEmail, action: "invite.revoke", entityType: "InviteToken", entityId: id });
  return NextResponse.json({ success: true });
}