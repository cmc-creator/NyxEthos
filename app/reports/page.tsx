import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import ReportsClient from "./ReportsClient";

function getOrgId(session: { user?: { orgId?: string } } | null) {
  return session?.user?.orgId ?? null;
}

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) redirect("/login");

  const [employees, payrollRuns, timeEntries, leaveRequests] = await Promise.all([
    prisma.employee.findMany({
      where: { orgId },
      select: { status: true, department: true },
    }),
    prisma.payrollRun.findMany({
      where: { orgId },
      select: { totalGross: true, totalNet: true },
    }),
    prisma.timeEntry.findMany({
      where: { orgId },
      select: { hours: true, status: true, employeeId: true },
    }),
    prisma.leaveRequest.findMany({
      where: { orgId },
      select: { status: true, days: true },
    }),
  ]);

  const departments = new Set(employees.map((e) => e.department ?? "Unassigned"));

  const headcount = {
    total: employees.length,
    active: employees.filter((e) => e.status === "active").length,
    inactive: employees.filter((e) => e.status === "inactive").length,
    departments: departments.size,
  };

  const payroll = {
    totalGross: payrollRuns.reduce((s, r) => s + r.totalGross, 0),
    totalNet: payrollRuns.reduce((s, r) => s + r.totalNet, 0),
    runs: payrollRuns.length,
  };

  const uniqueEmployees = new Set(timeEntries.map((t) => t.employeeId));
  const timeData = {
    totalHours: timeEntries.reduce((s, t) => s + t.hours, 0),
    approvedHours: timeEntries
      .filter((t) => t.status === "approved")
      .reduce((s, t) => s + t.hours, 0),
    employees: uniqueEmployees.size,
  };

  const ptoData = {
    totalRequests: leaveRequests.length,
    approved: leaveRequests.filter((r) => r.status === "approved").length,
    pending: leaveRequests.filter((r) => r.status === "pending").length,
    totalDays: leaveRequests
      .filter((r) => r.status === "approved")
      .reduce((s, r) => s + r.days, 0),
  };

  return (
    <ReportsClient
      headcount={headcount}
      payroll={payroll}
      timeData={timeData}
      ptoData={ptoData}
    />
  );
}
