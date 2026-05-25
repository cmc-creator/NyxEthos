import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Users, TrendingUp, DollarSign, Calendar, Activity, Zap } from "lucide-react";
import AnalyticsCharts from "./AnalyticsCharts";

function getOrgId(session: { user?: { orgId?: string } } | null): string | null {
  return session?.user?.orgId ?? null;
}

function fmtUSD(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) redirect("/sign-in");

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [allEmployees, ptoThisYear, timeThisMonth, reviewCount, payrollRuns] = await Promise.all([
    prisma.employee.findMany({
      where: { orgId },
      select: { id: true, firstName: true, lastName: true, department: true, employmentType: true, salary: true, status: true, startDate: true },
    }),
    prisma.leaveRequest.findMany({
      where: { orgId, status: "approved", startDate: { gte: startOfYear } },
      select: { days: true, type: true, employeeId: true },
    }),
    prisma.timeEntry.aggregate({ where: { orgId, date: { gte: startOfMonth } }, _sum: { hours: true } }),
    prisma.performanceReview.count({ where: { orgId } }),
    prisma.payrollRun.findMany({ where: { orgId }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const active = allEmployees.filter((e) => e.status === "active");
  const inactive = allEmployees.filter((e) => e.status !== "active");
  const newThisMonth = allEmployees.filter((e) => e.startDate && new Date(e.startDate) >= startOfMonth);
  const newThisYear = allEmployees.filter((e) => e.startDate && new Date(e.startDate) >= startOfYear);

  const withSalary = active.filter((e) => e.salary);
  const totalAnnualPayroll = withSalary.reduce((sum, e) => sum + (e.salary ?? 0), 0);
  const avgSalary = withSalary.length > 0 ? totalAnnualPayroll / withSalary.length : 0;

  // Department breakdown
  const deptMap: Record<string, number> = {};
  for (const e of active) {
    const d = e.department || "Unassigned";
    deptMap[d] = (deptMap[d] ?? 0) + 1;
  }
  const depts = Object.entries(deptMap).sort((a, b) => b[1] - a[1]);

  // Employment type breakdown
  const typeMap: Record<string, number> = {};
  for (const e of active) {
    const t = e.employmentType || "full-time";
    typeMap[t] = (typeMap[t] ?? 0) + 1;
  }

  // Monthly new hires — last 6 months
  const months: { label: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const count = allEmployees.filter((e) => {
      if (!e.startDate) return false;
      const sd = new Date(e.startDate);
      return sd >= start && sd <= end;
    }).length;
    months.push({ label: start.toLocaleDateString("en-US", { month: "short" }), count });
  }

  // PTO by type
  const ptoByType: Record<string, number> = {};
  for (const r of ptoThisYear) {
    ptoByType[r.type] = (ptoByType[r.type] ?? 0) + r.days;
  }
  const totalPtoDays = ptoThisYear.reduce((sum, r) => sum + r.days, 0);
  const ptoEntries = Object.entries(ptoByType).sort((a, b) => b[1] - a[1]);

  const hoursThisMonth = timeThisMonth._sum.hours ?? 0;
  const retentionRate = allEmployees.length > 0 ? ((active.length / allEmployees.length) * 100).toFixed(1) : "100.0";

  const typeColors: Record<string, string> = {
    "full-time": "#4d8fff",
    "part-time": "#818cf8",
    contractor: "#34d399",
    intern: "#fbbf24",
  };
  const ptoColors: Record<string, string> = {
    vacation: "#4d8fff", sick: "#f87171", personal: "#818cf8",
    maternity: "#34d399", paternity: "#fbbf24", other: "#7a9fc0",
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading" style={{ color: "#eef5ff" }}>Analytics</h1>
        <p className="mt-1 text-sm" style={{ color: "#7a9fc0" }}>
          Workforce insights and HR metrics at a glance.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          {
            icon: Users, label: "Total Headcount", color: "blue" as const,
            value: String(active.length),
            sub: newThisMonth.length > 0 ? `+${newThisMonth.length} added this month` : "No new hires this month",
          },
          {
            icon: DollarSign, label: "Annual Payroll", color: "green" as const,
            value: totalAnnualPayroll > 0 ? fmtUSD(totalAnnualPayroll) : "—",
            sub: avgSalary > 0 ? `Avg ${fmtUSD(avgSalary)}/yr` : "No salary data",
          },
          {
            icon: TrendingUp, label: "Retention Rate", color: "purple" as const,
            value: `${retentionRate}%`,
            sub: `${inactive.length} inactive · ${active.length} active`,
          },
          {
            icon: Calendar, label: "PTO Days Taken", color: "amber" as const,
            value: String(totalPtoDays),
            sub: `${ptoThisYear.length} approved requests this year`,
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
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7a9fc0" }}>{label}</span>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                  <Icon size={15} style={{ color: c.text }} />
                </div>
              </div>
              <p className="text-2xl font-bold font-heading" style={{ color: "#eef5ff" }}>{value}</p>
              {sub && <p className="text-xs mt-1" style={{ color: "#7a9fc0" }}>{sub}</p>}
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 — recharts */}
      <AnalyticsCharts
        months={months}
        depts={depts}
        activeCount={active.length}
        payrollRuns={payrollRuns.map((r) => ({ period: r.period, gross: r.totalGross, net: r.totalNet }))}
      />

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Employment Types */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity size={14} style={{ color: "#34d399" }} />
            <h3 className="text-sm font-semibold" style={{ color: "#eef5ff" }}>Employment Types</h3>
          </div>
          {Object.keys(typeMap).length === 0 ? (
            <p className="text-sm py-8 text-center" style={{ color: "#7a9fc0" }}>No data yet.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(typeMap)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => {
                  const pct = active.length > 0 ? ((count / active.length) * 100).toFixed(0) : "0";
                  const color = typeColors[type] ?? "#4d8fff";
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                        <span className="text-xs capitalize" style={{ color: "#b8cce8" }}>{type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: "#7a9fc0" }}>{pct}%</span>
                        <span className="text-xs font-bold w-4 text-right" style={{ color: "#eef5ff" }}>{count}</span>
                      </div>
                    </div>
                  );
                })}
              {/* Stacked bar */}
              <div className="mt-3 h-2.5 rounded-full overflow-hidden flex">
                {Object.entries(typeMap)
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, count]) => (
                    <div
                      key={type}
                      style={{ flex: count, background: typeColors[type] ?? "#4d8fff" }}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* PTO by Type */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar size={14} style={{ color: "#fbbf24" }} />
            <h3 className="text-sm font-semibold" style={{ color: "#eef5ff" }}>PTO Usage This Year</h3>
          </div>
          {ptoEntries.length === 0 ? (
            <p className="text-sm py-8 text-center" style={{ color: "#7a9fc0" }}>No approved PTO this year.</p>
          ) : (
            <div className="space-y-3.5">
              {ptoEntries.map(([type, days]) => {
                const pct = totalPtoDays > 0 ? (days / totalPtoDays) * 100 : 0;
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs capitalize" style={{ color: "#b8cce8" }}>{type}</span>
                      <span className="text-xs font-bold" style={{ color: "#eef5ff" }}>{days}d</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: ptoColors[type] ?? "#4d8fff" }}
                      />
                    </div>
                  </div>
                );
              })}
              <div
                className="pt-3 mt-1 border-t text-xs flex items-center justify-between"
                style={{ borderColor: "rgba(37,112,245,0.1)", color: "#7a9fc0" }}
              >
                <span>{totalPtoDays} total days</span>
                <span>{ptoThisYear.length} requests</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Zap size={14} style={{ color: "#f87171" }} />
            <h3 className="text-sm font-semibold" style={{ color: "#eef5ff" }}>Quick Stats</h3>
          </div>
          <div className="space-y-3.5">
            {[
              { label: "Active employees", value: `${active.length} / ${allEmployees.length}` },
              { label: "Hours logged (month)", value: `${hoursThisMonth.toFixed(0)}h` },
              { label: "Performance reviews", value: String(reviewCount) },
              { label: "Avg annual salary", value: avgSalary > 0 ? fmtUSD(avgSalary) : "—" },
              { label: "Monthly payroll cost", value: totalAnnualPayroll > 0 ? fmtUSD(totalAnnualPayroll / 12) : "—" },
              { label: "Payroll runs to date", value: String(payrollRuns.length) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-0.5">
                <span className="text-xs" style={{ color: "#7a9fc0" }}>{label}</span>
                <span className="text-xs font-bold" style={{ color: "#eef5ff" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payroll runs history */}
      {payrollRuns.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(37,112,245,0.12)" }}>
            <h3 className="text-sm font-semibold" style={{ color: "#eef5ff" }}>Recent Payroll Runs</h3>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(37,112,245,0.06)" }}>
            {payrollRuns.map((run) => (
              <div key={run.id} className="px-6 py-3.5 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold" style={{ color: "#eef5ff" }}>{run.period}</span>
                  <span className="ml-3 text-xs" style={{ color: "#7a9fc0" }}>{run.employeeCount} employees</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs" style={{ color: "#7a9fc0" }}>Gross</p>
                    <p className="text-sm font-bold" style={{ color: "#eef5ff" }}>{fmtUSD(run.totalGross)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: "#7a9fc0" }}>Net</p>
                    <p className="text-sm font-bold" style={{ color: "#34d399" }}>{fmtUSD(run.totalNet)}</p>
                  </div>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: "rgba(52,211,153,0.12)", color: "#34d399" }}
                  >
                    {run.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
