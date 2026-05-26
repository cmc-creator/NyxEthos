import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";

function getOrgId(session: { user?: { orgId?: string } } | null): string | null {
  return session?.user?.orgId ?? null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const runs = await prisma.payrollRun.findMany({
    where: { orgId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json(runs);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { period, startDate, endDate, notes } = await req.json();
    if (!period || !startDate || !endDate) {
      return NextResponse.json({ error: "period, startDate, endDate are required." }, { status: 400 });
    }

    // Get all active employees with salaries
    const employees = await prisma.employee.findMany({
      where: { orgId, status: "active", salary: { not: null } },
      select: { id: true, firstName: true, lastName: true, salary: true },
    });

    if (employees.length === 0) {
      return NextResponse.json({ error: "No active employees with salary data found." }, { status: 400 });
    }

    // Calculate pay for each employee (monthly = annual / 12)
    const stubs = employees.map((emp) => {
      const gross = (emp.salary ?? 0) / 12;
      const federal = gross * 0.22;
      const state = gross * 0.05;
      const ss = gross * 0.062;
      const medicare = gross * 0.0145;
      const net = gross - federal - state - ss - medicare;
      return {
        employeeId: emp.id,
        orgId,
        grossPay: Math.round(gross * 100) / 100,
        federalTax: Math.round(federal * 100) / 100,
        stateTax: Math.round(state * 100) / 100,
        socialSecurity: Math.round(ss * 100) / 100,
        medicare: Math.round(medicare * 100) / 100,
        netPay: Math.round(net * 100) / 100,
      };
    });

    const totalGross = stubs.reduce((s, st) => s + st.grossPay, 0);
    const totalNet = stubs.reduce((s, st) => s + st.netPay, 0);

    const run = await prisma.payrollRun.create({
      data: {
        orgId,
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: "processed",
        totalGross: Math.round(totalGross * 100) / 100,
        totalNet: Math.round(totalNet * 100) / 100,
        employeeCount: employees.length,
        notes: notes || null,
        payStubs: { create: stubs },
      },
      include: { payStubs: true },
    });

    logAudit({
      orgId,
      userId: session?.user?.id,
      userEmail: session?.user?.email ?? undefined,
      action: "CREATE_PAYROLL_RUN",
      entityType: "PayrollRun",
      entityId: run.id,
      details: `${period} — ${employees.length} employees — $${Math.round(totalNet).toLocaleString()} net`,
    });

    return NextResponse.json(run, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to process payroll." }, { status: 500 });
  }
}
