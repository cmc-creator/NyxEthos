import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

function getOrgId(session: { user?: { orgId?: string } } | null): string | null {
  return session?.user?.orgId ?? null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entries = await prisma.timeEntry.findMany({
    where: { orgId },
    include: { employee: { select: { firstName: true, lastName: true } } },
    orderBy: { date: "desc" },
    take: 100,
  });
  return NextResponse.json(entries);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { employeeId, date, hours, type, note } = await req.json();
    if (!employeeId || !date || !hours) {
      return NextResponse.json({ error: "Employee, date, and hours are required." }, { status: 400 });
    }

    // Verify the employee belongs to this org
    const employee = await prisma.employee.findFirst({ where: { id: employeeId, orgId } });
    if (!employee) return NextResponse.json({ error: "Employee not found." }, { status: 404 });

    const entry = await prisma.timeEntry.create({
      data: {
        employeeId,
        orgId,
        date: new Date(date),
        hours: parseFloat(String(hours)),
        type: type || "regular",
        note: note || null,
      },
    });
    return NextResponse.json(entry, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create time entry." }, { status: 500 });
  }
}
