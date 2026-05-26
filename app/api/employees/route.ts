import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getOrgId(session: any): string | null {
  return session?.user?.orgId ?? null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const employees = await prisma.employee.findMany({
    where: { orgId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(employees);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, department, jobTitle, startDate, status, employmentType, salary, managerId } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "First name, last name, and email are required." }, { status: 400 });
    }

    const employee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        department: department || null,
        jobTitle: jobTitle || null,
        startDate: startDate ? new Date(startDate) : null,
        status: status || "active",
        employmentType: employmentType || "full-time",
        salary: salary ? parseFloat(String(salary)) : null,
        managerId: managerId || null,
        orgId,
      },
    });
    logAudit({
      orgId,
      userId: session?.user?.id,
      userEmail: session?.user?.email ?? undefined,
      action: "CREATE_EMPLOYEE",
      entityType: "Employee",
      entityId: employee.id,
      details: `${firstName} ${lastName} — ${jobTitle ?? department ?? ""}`,
    });

    return NextResponse.json(employee, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create employee." }, { status: 500 });
  }
}
