import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

function getOrgId(session: { user?: { orgId?: string } } | null) {
  return session?.user?.orgId ?? null;
}

function csvRow(values: (string | number | null | undefined)[]) {
  return values
    .map((v) => {
      const s = String(v ?? "");
      return s.includes(",") || s.includes('"') || s.includes("\n")
        ? `"${s.replace(/"/g, '""')}"`
        : s;
    })
    .join(",");
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  let csv = "";

  if (type === "headcount") {
    const employees = await prisma.employee.findMany({
      where: { orgId },
      orderBy: [{ lastName: "asc" }],
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        department: true,
        jobTitle: true,
        startDate: true,
        status: true,
        employmentType: true,
        salary: true,
      },
    });
    const header = csvRow([
      "First Name","Last Name","Email","Phone","Department","Job Title",
      "Start Date","Status","Employment Type","Salary",
    ]);
    const rows = employees.map((e) =>
      csvRow([
        e.firstName, e.lastName, e.email, e.phone ?? "",
        e.department ?? "", e.jobTitle ?? "",
        e.startDate ? e.startDate.toISOString().slice(0, 10) : "",
        e.status, e.employmentType, e.salary ?? "",
      ]),
    );
    csv = [header, ...rows].join("\n");
  } else if (type === "payroll") {
    const stubs = await prisma.payStub.findMany({
      where: { orgId },
      orderBy: { createdAt: "desc" },
      include: {
        employee: { select: { firstName: true, lastName: true } },
        payrollRun: { select: { period: true } },
      },
    });
    const header = csvRow([
      "Period","Employee","Gross Pay","Federal Tax","State Tax",
      "Social Security","Medicare","Net Pay",
    ]);
    const rows = stubs.map((s) =>
      csvRow([
        s.payrollRun.period,
        `${s.employee.firstName} ${s.employee.lastName}`,
        s.grossPay, s.federalTax, s.stateTax,
        s.socialSecurity, s.medicare, s.netPay,
      ]),
    );
    csv = [header, ...rows].join("\n");
  } else if (type === "time") {
    const entries = await prisma.timeEntry.findMany({
      where: { orgId },
      orderBy: { date: "desc" },
      include: { employee: { select: { firstName: true, lastName: true } } },
    });
    const header = csvRow(["Date","Employee","Hours","Type","Status","Note"]);
    const rows = entries.map((t) =>
      csvRow([
        t.date.toISOString().slice(0, 10),
        `${t.employee.firstName} ${t.employee.lastName}`,
        t.hours, t.type, t.status, t.note ?? "",
      ]),
    );
    csv = [header, ...rows].join("\n");
  } else if (type === "pto") {
    const requests = await prisma.leaveRequest.findMany({
      where: { orgId },
      orderBy: { startDate: "desc" },
      include: { employee: { select: { firstName: true, lastName: true } } },
    });
    const header = csvRow([
      "Employee","Type","Start Date","End Date","Days","Status","Notes",
    ]);
    const rows = requests.map((r) =>
      csvRow([
        `${r.employee.firstName} ${r.employee.lastName}`,
        r.type,
        r.startDate.toISOString().slice(0, 10),
        r.endDate.toISOString().slice(0, 10),
        r.days, r.status, r.notes ?? "",
      ]),
    );
    csv = [header, ...rows].join("\n");
  } else {
    return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${type}-report.csv"`,
    },
  });
}
