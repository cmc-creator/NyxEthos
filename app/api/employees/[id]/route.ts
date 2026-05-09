import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

function getOrgId(session: Session | null): string | null {
  return (session?.user as { orgId?: string } | undefined)?.orgId ?? null;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const employee = await prisma.employee.findFirst({ where: { id, orgId } });
  if (!employee) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(employee);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const existing = await prisma.employee.findFirst({ where: { id, orgId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await req.json();
    const employee = await prisma.employee.update({
      where: { id },
      data: {
        firstName: body.firstName ?? existing.firstName,
        lastName: body.lastName ?? existing.lastName,
        email: body.email ?? existing.email,
        phone: body.phone !== undefined ? body.phone || null : existing.phone,
        department: body.department !== undefined ? body.department || null : existing.department,
        jobTitle: body.jobTitle !== undefined ? body.jobTitle || null : existing.jobTitle,
        startDate: body.startDate !== undefined ? (body.startDate ? new Date(body.startDate) : null) : existing.startDate,
        status: body.status ?? existing.status,
        employmentType: body.employmentType ?? existing.employmentType,
        salary: body.salary !== undefined ? (body.salary ? parseFloat(String(body.salary)) : null) : existing.salary,
      },
    });
    return NextResponse.json(employee);
  } catch {
    return NextResponse.json({ error: "Failed to update employee." }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const existing = await prisma.employee.findFirst({ where: { id, orgId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.employee.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
