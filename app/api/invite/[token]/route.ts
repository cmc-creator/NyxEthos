import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = await prisma.inviteToken.findUnique({ where: { token } });
  if (!invite) return NextResponse.json({ error: "Invalid invite link" }, { status: 404 });
  if (invite.usedAt) return NextResponse.json({ error: "Invite already used" }, { status: 410 });
  if (invite.expiresAt < new Date()) return NextResponse.json({ error: "Invite expired" }, { status: 410 });
  return NextResponse.json({ email: invite.email, role: invite.role, orgId: invite.orgId });
}

export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = await prisma.inviteToken.findUnique({ where: { token } });
  if (!invite) return NextResponse.json({ error: "Invalid invite link" }, { status: 404 });
  if (invite.usedAt) return NextResponse.json({ error: "Invite already used" }, { status: 410 });
  if (invite.expiresAt < new Date()) return NextResponse.json({ error: "Invite expired" }, { status: 410 });

  const { name, password } = await req.json();
  if (!name || !password || password.length < 8) {
    return NextResponse.json({ error: "Name and password (min 8 chars) required" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: invite.email } });
  if (existing) {
    // Already has an account — just join the org
    await prisma.user.update({ where: { email: invite.email }, data: { orgId: invite.orgId, role: invite.role } });
  } else {
    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { name, email: invite.email, password: hashed, role: invite.role, orgId: invite.orgId },
    });
  }

  await prisma.inviteToken.update({ where: { token }, data: { usedAt: new Date() } });
  return NextResponse.json({ success: true });
}