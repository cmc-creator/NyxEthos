import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

function getOrgId(session: Awaited<ReturnType<typeof getServerSession>>): string | null {
  return (session?.user as { orgId?: string })?.orgId ?? null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const requests = await prisma.leaveRequest.findMany({
    where: { orgId },
    include: { employee: { select: { firstName: true, lastName: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json(requests);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { employeeId, type, startDate, endDate, days, notes } = await req.json();
    if (!employeeId || !startDate || !endDate) {
      return NextResponse.json({ error: "Employee, start date, and end date are required." }, { status: 400 });
    }

    const employee = await prisma.employee.findFirst({ where: { id: employeeId, orgId } });
    if (!employee) return NextResponse.json({ error: "Employee not found." }, { status: 404 });

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end.getTime() - start.getTime();
    const diffDays = days ?? Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1);

    const request = await prisma.leaveRequest.create({
      data: {
        employeeId,
        orgId,
        type: type || "vacation",
        startDate: start,
        endDate: end,
        days: parseFloat(String(diffDays)),
        status: "pending",
        notes: notes || null,
      },
    });
    return NextResponse.json(request, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create leave request." }, { status: 500 });
  }
}
