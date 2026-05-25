import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { DollarSign, Users, TrendingUp, Building2, ArrowRight } from "lucide-react";

function getOrgId(session: { user?: { orgId?: string } } | null): string | null {
  return session?.user?.orgId ?? null;
}

function fmtUSD(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function PayrollPage() {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) redirect("/sign-in");

  const employees = await prisma.employee.findMany({
    where: { orgId, status: "active" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      jobTitle: true,
      department: true,
      employmentType: true,
      salary: true,
    },
    orderBy: { firstName: "asc" },
  });

  const withSalary = employees.filter((e) => e.salary !== null && e.salary !== undefined);
  const totalAnnual = withSalary.reduce((sum, e) => sum + (e.salary ?? 0), 0);
  const totalMonthly = totalAnnual / 12;
  const avgSalary = withSalary.length > 0 ? totalAnnual / withSalary.length : 0;

  // Department totals
  const deptMap: Record<string, { count: number; total: number }> = {};
  for (const e of withSalary) {
    const dept = e.department || "Unassigned";
    if (!deptMap[dept]) deptMap[dept] = { count: 0, total: 0 };
    deptMap[dept].count += 1;
    deptMap[dept].total += e.salary ?? 0;
  }
  const depts = Object.entries(deptMap).sort((a, b) => b[1].total - a[1].total);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: "#eef5ff" }}>
            Payroll
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#7a9fc0" }}>
            Compensation overview for active employees.
          </p>
        </div>
        <Link
          href="/employees/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
        >
          <Users size={14} />
          Add Employee
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          {
            icon: DollarSign,
            label: "Monthly Payroll",
            value: totalMonthly > 0 ? fmtUSD(totalMonthly) : "—",
            sub: totalAnnual > 0 ? `${fmtUSD(totalAnnual)}/yr` : "No salaries on record",
            color: "blue" as const,
          },
          {
            icon: TrendingUp,
            label: "Avg Salary",
            value: avgSalary > 0 ? fmtUSD(avgSalary) : "—",
            sub: "Annual per employee",
            color: "green" as const,
          },
          {
            icon: Users,
            label: "On Payroll",
            value: String(withSalary.length),
            sub: `${employees.length - withSalary.length} missing salary data`,
            color: "purple" as const,
          },
          {
            icon: Building2,
            label: "Departments",
            value: String(depts.length),
            sub: depts[0] ? `Largest: ${depts[0][0]}` : "No data yet",
            color: "amber" as const,
          },
        ].map(({ icon: Icon, label, value, sub, color }) => {
          const palettes = {
            blue: { bg: "rgba(37,112,245,0.15)", text: "#4d8fff", border: "rgba(37,112,245,0.25)" },
            green: { bg: "rgba(52,211,153,0.12)", text: "#34d399", border: "rgba(52,211,153,0.25)" },
            purple: { bg: "rgba(99,102,241,0.18)", text: "#818cf8", border: "rgba(99,102,241,0.25)" },
            amber: { bg: "rgba(251,191,36,0.12)", text: "#fbbf24", border: "rgba(251,191,36,0.25)" },
          };
          const c = palettes[color];
          return (
            <div key={label} className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7a9fc0" }}>
                  {label}
                </span>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: c.bg, border: `1px solid ${c.border}` }}
                >
                  <Icon size={15} style={{ color: c.text }} />
                </div>
              </div>
              <p className="text-2xl font-bold font-heading" style={{ color: "#eef5ff" }}>{value}</p>
              {sub && <p className="text-xs mt-1" style={{ color: "#7a9fc0" }}>{sub}</p>}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee salary table */}
        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b" style={{ borderColor: "rgba(37,112,245,0.12)" }}>
            <h2 className="text-base font-semibold font-heading" style={{ color: "#eef5ff" }}>
              Employee Compensation
            </h2>
          </div>
          {employees.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ background: "rgba(37,112,245,0.12)", border: "1px solid rgba(37,112,245,0.2)" }}
              >
                <DollarSign size={20} style={{ color: "#4d8fff" }} />
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: "#eef5ff" }}>No active employees</p>
              <p className="text-xs mb-4" style={{ color: "#7a9fc0" }}>
                Add employees and set their salaries to see payroll data.
              </p>
              <Link
                href="/employees/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
              >
                Add Employee
              </Link>
            </div>
          ) : (
            <div>
              <div
                className="grid grid-cols-12 px-6 py-3 text-xs font-semibold uppercase tracking-widest border-b"
                style={{ color: "#7a9fc0", borderColor: "rgba(37,112,245,0.08)" }}
              >
                <span className="col-span-5">Employee</span>
                <span className="col-span-3">Department</span>
                <span className="col-span-2">Type</span>
                <span className="col-span-2 text-right">Annual</span>
              </div>
              <div>
                {employees.map((e, i) => (
                  <Link
                    key={e.id}
                    href={`/employees/${e.id}`}
                    className="grid grid-cols-12 px-6 py-3.5 transition-colors hover:bg-blue-500/5 group border-b last:border-0"
                    style={{ borderColor: "rgba(37,112,245,0.06)" }}
                  >
                    <div className="col-span-5 flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: `hsl(${(i * 47) % 360}, 65%, 45%)` }}
                      >
                        {e.firstName[0]}{e.lastName[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "#eef5ff" }}>
                          {e.firstName} {e.lastName}
                        </p>
                        <p className="text-xs truncate" style={{ color: "#7a9fc0" }}>
                          {e.jobTitle || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-3 flex items-center">
                      <span className="text-sm truncate" style={{ color: "#b8cce8" }}>
                        {e.department || "—"}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                        style={{
                          background: "rgba(37,112,245,0.12)",
                          color: "#4d8fff",
                        }}
                      >
                        {e.employmentType}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <span className="text-sm font-semibold" style={{ color: e.salary ? "#eef5ff" : "#7a9fc0" }}>
                        {e.salary ? fmtUSD(e.salary) : "Not set"}
                      </span>
                      <ArrowRight
                        size={11}
                        className="opacity-0 group-hover:opacity-40 transition-opacity flex-shrink-0"
                        style={{ color: "#4d8fff" }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Department breakdown */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-base font-semibold font-heading mb-5" style={{ color: "#eef5ff" }}>
            By Department
          </h2>
          {depts.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: "#7a9fc0" }}>
              No salary data to break down.
            </p>
          ) : (
            <div className="space-y-4">
              {depts.map(([dept, { count, total }]) => (
                <div key={dept}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium truncate" style={{ color: "#b8cce8" }}>
                      {dept}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: "#eef5ff" }}>
                      {fmtUSD(total / 12)}<span style={{ color: "#7a9fc0" }}>/mo</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="flex-1 h-1.5 rounded-full overflow-hidden"
                      style={{ background: "rgba(37,112,245,0.1)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${totalAnnual > 0 ? Math.round((total / totalAnnual) * 100) : 0}%`,
                          background: "linear-gradient(90deg, #2570f5, #6366f1)",
                        }}
                      />
                    </div>
                    <span className="text-xs" style={{ color: "#7a9fc0" }}>
                      {count} emp
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
