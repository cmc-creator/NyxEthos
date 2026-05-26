import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

function toCSV(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
}

function fmt(d: Date | string | null | undefined) {
  if (!d) return "";
  return new Date(d).toISOString().split("T")[0];
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const orgId = (session?.user as { orgId?: string })?.orgId;
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const type = req.nextUrl.searchParams.get("type") ?? "employees";
  let csv = "";
  let filename = `${type}-export.csv`;

  if (type === "employees") {
    const employees = await prisma.employee.findMany({
      where: { orgId },
      include: { manager: { select: { firstName: true, lastName: true } } },
      orderBy: { lastName: "asc" },
    });
    csv = toCSV(employees.map((e) => ({
      id: e.id,
      first_name: e.firstName,
      last_name: e.lastName,
      email: e.email,
      phone: e.phone ?? "",
      department: e.department ?? "",
      job_title: e.jobTitle ?? "",
      status: e.status,
      employment_type: e.employmentType,
      salary: e.salary ?? "",
      start_date: fmt(e.startDate),
      manager: e.manager ? `${e.manager.firstName} ${e.manager.lastName}` : "",
    })));
    filename = "employees.csv";
  } else if (type === "payroll") {
    const stubs = await prisma.payStub.findMany({
      where: { orgId },
      include: {
        employee: { select: { firstName: true, lastName: true, department: true } },
        payrollRun: { select: { period: true, startDate: true, endDate: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 500,
    });
    csv = toCSV(stubs.map((s) => ({
      period: s.payrollRun.period,
      start_date: fmt(s.payrollRun.startDate),
      end_date: fmt(s.payrollRun.endDate),
      employee: `${s.employee.firstName} ${s.employee.lastName}`,
      department: s.employee.department ?? "",
      gross_pay: s.grossPay,
      federal_tax: s.federalTax,
      state_tax: s.stateTax,
      social_security: s.socialSecurity,
      medicare: s.medicare,
      net_pay: s.netPay,
    })));
    filename = "payroll.csv";
  } else if (type === "time") {
    const entries = await prisma.timeEntry.findMany({
      where: { orgId },
      include: { employee: { select: { firstName: true, lastName: true, department: true } } },
      orderBy: { date: "desc" },
      take: 1000,
    });
    csv = toCSV(entries.map((e) => ({
      date: fmt(e.date),
      employee: `${e.employee.firstName} ${e.employee.lastName}`,
      department: e.employee.department ?? "",
      hours: e.hours,
      type: e.type,
      status: e.status,
      note: e.note ?? "",
    })));
    filename = "time-entries.csv";
  } else if (type === "pto") {
    const requests = await prisma.leaveRequest.findMany({
      where: { orgId },
      include: { employee: { select: { firstName: true, lastName: true, department: true } } },
      orderBy: { startDate: "desc" },
      take: 500,
    });
    csv = toCSV(requests.map((r) => ({
      employee: `${r.employee.firstName} ${r.employee.lastName}`,
      department: r.employee.department ?? "",
      type: r.type,
      start_date: fmt(r.startDate),
      end_date: fmt(r.endDate),
      days: r.days,
      status: r.status,
      notes: r.notes ?? "",
    })));
    filename = "pto-requests.csv";
  } else {
    return NextResponse.json({ error: "Unknown export type" }, { status: 400 });
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
