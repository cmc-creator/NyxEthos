import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Users, UserCheck, Building2, Calendar, TrendingUp,
  DollarSign, Clock, CalendarDays, FileText, ArrowRight,
} from "lucide-react";

function getOrgId(session: { user?: { orgId?: string } } | null): string | null {
  return session?.user?.orgId ?? null;
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
}

function fmtUSD(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  color?: "blue" | "green" | "purple" | "amber";
};

function StatCard({ icon: Icon, label, value, sub, color = "blue" }: StatCardProps) {
  const palettes = {
    blue: { bg: "rgba(37,112,245,0.15)", text: "#4d8fff", border: "rgba(37,112,245,0.25)" },
    green: { bg: "rgba(52,211,153,0.12)", text: "#34d399", border: "rgba(52,211,153,0.25)" },
    purple: { bg: "rgba(99,102,241,0.18)", text: "#818cf8", border: "rgba(99,102,241,0.25)" },
    amber: { bg: "rgba(251,191,36,0.12)", text: "#fbbf24", border: "rgba(251,191,36,0.25)" },
  };
  const c = palettes[color];
  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7a9fc0" }}>
          {label}
        </span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: c.bg, border: `1px solid ${c.border}` }}
        >
          <Icon size={16} style={{ color: c.text }} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold font-heading" style={{ color: "#eef5ff" }}>
          {value}
        </p>
        {sub && <p className="text-xs mt-1" style={{ color: "#7a9fc0" }}>{sub}</p>}
      </div>
    </div>
  );
}

type QuickLinkProps = { href: string; icon: LucideIcon; label: string; desc: string };
function QuickLink({ href, icon: Icon, label, desc }: QuickLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group"
      style={{
        background: "rgba(37,112,245,0.06)",
        border: "1px solid rgba(37,112,245,0.14)",
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(37,112,245,0.15)", border: "1px solid rgba(37,112,245,0.2)" }}
      >
        <Icon size={18} style={{ color: "#4d8fff" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: "#eef5ff" }}>{label}</p>
        <p className="text-xs truncate" style={{ color: "#7a9fc0" }}>{desc}</p>
      </div>
      <ArrowRight
        size={14}
        className="opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0"
        style={{ color: "#4d8fff" }}
      />
    </Link>
  );
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) redirect("/sign-in");

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totalCount, activeCount, newThisMonth, recentHires, allEmployees] = await Promise.all([
    prisma.employee.count({ where: { orgId } }),
    prisma.employee.count({ where: { orgId, status: "active" } }),
    prisma.employee.count({ where: { orgId, createdAt: { gte: thirtyDaysAgo } } }),
    prisma.employee.findMany({
      where: { orgId },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.employee.findMany({
      where: { orgId },
      select: { department: true, salary: true },
    }),
  ]);

  // Department breakdown
  const deptMap: Record<string, number> = {};
  let totalPayroll = 0;
  let salaryCount = 0;
  for (const e of allEmployees) {
    const dept = e.department || "Unassigned";
    deptMap[dept] = (deptMap[dept] || 0) + 1;
    if (e.salary) { totalPayroll += e.salary; salaryCount++; }
  }
  const departments = Object.entries(deptMap).sort((a, b) => b[1] - a[1]);
  const avgSalary = salaryCount > 0 ? totalPayroll / salaryCount : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading" style={{ color: "#eef5ff" }}>
          Dashboard
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#7a9fc0" }}>
          Welcome back, {session?.user?.name || "Admin"}. Here&apos;s your organization at a glance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={Users}
          label="Total Employees"
          value={fmt(totalCount)}
          sub={totalCount === 0 ? "Add your first employee" : `${activeCount} active`}
        />
        <StatCard
          icon={UserCheck}
          label="Active"
          value={fmt(activeCount)}
          sub={totalCount > 0 ? `${Math.round((activeCount / totalCount) * 100)}% of workforce` : undefined}
          color="green"
        />
        <StatCard
          icon={Building2}
          label="Departments"
          value={fmt(departments.length)}
          sub={departments.length > 0 ? departments[0][0] + " is largest" : "No departments yet"}
          color="purple"
        />
        <StatCard
          icon={Calendar}
          label="New This Month"
          value={fmt(newThisMonth)}
          sub="Last 30 days"
          color="amber"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Hires */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold font-heading" style={{ color: "#eef5ff" }}>
              Recent Employees
            </h2>
            <Link
              href="/employees"
              className="text-xs font-medium flex items-center gap-1 transition-colors hover:opacity-100 opacity-70"
              style={{ color: "#4d8fff" }}
            >
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {recentHires.length === 0 ? (
            <div className="text-center py-10">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ background: "rgba(37,112,245,0.12)", border: "1px solid rgba(37,112,245,0.2)" }}
              >
                <Users size={20} style={{ color: "#4d8fff" }} />
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: "#eef5ff" }}>No employees yet</p>
              <p className="text-xs mb-4" style={{ color: "#7a9fc0" }}>
                Add your team to start using NyxEthos HR.
              </p>
              <Link
                href="/employees/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
              >
                Add First Employee
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {recentHires.map((e) => (
                <Link
                  key={e.id}
                  href={`/employees/${e.id}`}
                  className="flex items-center justify-between px-3 py-3 rounded-xl transition-colors hover:bg-blue-500/5 group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
                    >
                      {e.firstName[0]}{e.lastName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#eef5ff" }}>
                        {e.firstName} {e.lastName}
                      </p>
                      <p className="text-xs" style={{ color: "#7a9fc0" }}>
                        {e.jobTitle || e.department || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={
                        e.status === "active"
                          ? { background: "rgba(52,211,153,0.12)", color: "#34d399" }
                          : { background: "rgba(107,114,128,0.15)", color: "#9ca3af" }
                      }
                    >
                      {e.status}
                    </span>
                    <ArrowRight
                      size={12}
                      className="opacity-0 group-hover:opacity-40 transition-opacity"
                      style={{ color: "#4d8fff" }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Department breakdown */}
          <div className="glass-card rounded-2xl p-6 flex-1">
            <h2 className="text-base font-semibold font-heading mb-5" style={{ color: "#eef5ff" }}>
              Departments
            </h2>
            {departments.length === 0 ? (
              <p className="text-xs text-center py-6" style={{ color: "#7a9fc0" }}>
                No department data yet.
              </p>
            ) : (
              <div className="space-y-3">
                {departments.slice(0, 7).map(([dept, count]) => (
                  <div key={dept} className="flex items-center gap-3">
                    <span className="text-xs flex-1 truncate" style={{ color: "#b8cce8" }}>
                      {dept}
                    </span>
                    <div
                      className="w-20 h-1.5 rounded-full overflow-hidden"
                      style={{ background: "rgba(37,112,245,0.12)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${totalCount > 0 ? Math.round((count / totalCount) * 100) : 0}%`,
                          background: "linear-gradient(90deg, #2570f5, #6366f1)",
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold w-4 text-right" style={{ color: "#eef5ff" }}>
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payroll snapshot */}
          {totalPayroll > 0 && (
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign size={14} style={{ color: "#4d8fff" }} />
                <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7a9fc0" }}>
                  Payroll Snapshot
                </h3>
              </div>
              <p className="text-xl font-bold font-heading mb-1" style={{ color: "#eef5ff" }}>
                {fmtUSD(totalPayroll / 12)}
                <span className="text-xs font-normal ml-1" style={{ color: "#7a9fc0" }}>/mo</span>
              </p>
              <p className="text-xs" style={{ color: "#7a9fc0" }}>
                Avg: {fmtUSD(avgSalary)}/yr · {salaryCount} salaries on record
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#7a9fc0" }}>
          HR Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickLink href="/employees" icon={Users} label="Employees" desc="Manage your team" />
          <QuickLink href="/payroll" icon={DollarSign} label="Payroll" desc="Salaries & compensation" />
          <QuickLink href="/time" icon={Clock} label="Time & Attendance" desc="Hours & schedules" />
          <QuickLink href="/pto" icon={CalendarDays} label="PTO & Leave" desc="Time-off requests" />
          <QuickLink href="/performance" icon={TrendingUp} label="Performance" desc="Reviews & goals" />
          <QuickLink href="/compliance" icon={FileText} label="Compliance" desc="Policies & audits" />
        </div>
      </div>
    </div>
  );
}
