import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Clock, Users, Calendar, TrendingUp, Plus } from "lucide-react";
import TimeActionButtons from "@/components/TimeActionButtons";

function getOrgId(session: { user?: { orgId?: string } } | null): string | null {
  return session?.user?.orgId ?? null;
}

export default async function TimePage() {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) redirect("/sign-in");

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [recentEntries, weekHours, monthHours, employeeCount, pendingCount] = await Promise.all([
    prisma.timeEntry.findMany({
      where: { orgId },
      include: { employee: { select: { firstName: true, lastName: true, jobTitle: true } } },
      orderBy: { date: "desc" },
      take: 20,
    }),
    prisma.timeEntry.aggregate({
      where: { orgId, date: { gte: sevenDaysAgo } },
      _sum: { hours: true },
    }),
    prisma.timeEntry.aggregate({
      where: { orgId, date: { gte: thirtyDaysAgo } },
      _sum: { hours: true },
    }),
    prisma.employee.count({ where: { orgId, status: "active" } }),
    prisma.timeEntry.count({ where: { orgId, status: "pending" } }),
  ]);

  const weekTotal = weekHours._sum.hours ?? 0;
  const monthTotal = monthHours._sum.hours ?? 0;

  const typeColors: Record<string, React.CSSProperties> = {
    regular: { backgroundColor: "rgba(37,112,245,0.12)", color: "#4d8fff" },
    overtime: { backgroundColor: "rgba(251,191,36,0.12)", color: "#fbbf24" },
    pto: { backgroundColor: "rgba(52,211,153,0.12)", color: "#34d399" },
    sick: { backgroundColor: "rgba(239,68,68,0.12)", color: "#f87171" },
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: "#eef5ff" }}>
            Time &amp; Attendance
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#7a9fc0" }}>
            Track hours worked and employee attendance.
          </p>
        </div>
        <Link
          href="/time/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
        >
          <Plus size={14} />
          Log Time
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { icon: Clock, label: "This Week", value: `${weekTotal.toFixed(1)}h`, sub: "Total hours logged", color: "blue" as const },
          { icon: Calendar, label: "This Month", value: `${monthTotal.toFixed(1)}h`, sub: "Last 30 days", color: "green" as const },
          { icon: Users, label: "Active Employees", value: String(employeeCount), sub: "On the team", color: "purple" as const },
          { icon: TrendingUp, label: "Pending Approval", value: String(pendingCount), sub: "Time entries to review", color: "amber" as const },
        ].map(({ icon: Icon, label, value, sub, color }) => {
          const palettes = {
            blue: { backgroundColor: "rgba(37,112,245,0.15)", color: "#4d8fff", border: "rgba(37,112,245,0.25)" },
            green: { backgroundColor: "rgba(52,211,153,0.12)", color: "#34d399", border: "rgba(52,211,153,0.25)" },
            purple: { backgroundColor: "rgba(99,102,241,0.18)", color: "#818cf8", border: "rgba(99,102,241,0.25)" },
            amber: { backgroundColor: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "rgba(251,191,36,0.25)" },
          };
          const c = palettes[color];
          return (
            <div key={label} className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7a9fc0" }}>{label}</span>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: c.backgroundColor, border: `1px solid ${c.border}` }}>
                  <Icon size={15} style={{ color: c.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold font-heading" style={{ color: "#eef5ff" }}>{value}</p>
              {sub && <p className="text-xs mt-1" style={{ color: "#7a9fc0" }}>{sub}</p>}
            </div>
          );
        })}
      </div>

      {/* Time entries table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "rgba(37,112,245,0.12)" }}>
          <h2 className="text-base font-semibold font-heading" style={{ color: "#eef5ff" }}>Recent Time Entries</h2>
          <Link
            href="/time/new"
            className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-100 opacity-70"
            style={{ color: "#4d8fff" }}
          >
            <Plus size={12} /> Log Time
          </Link>
        </div>

        {recentEntries.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(37,112,245,0.1)", border: "1px solid rgba(37,112,245,0.18)" }}
            >
              <Clock size={24} style={{ color: "#4d8fff" }} />
            </div>
            <p className="text-base font-semibold mb-2" style={{ color: "#eef5ff" }}>No time entries yet</p>
            <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: "#7a9fc0" }}>
              Start logging hours for your team to track attendance and overtime.
            </p>
            <Link
              href="/time/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
            >
              <Plus size={14} /> Log First Entry
            </Link>
          </div>
        ) : (
          <div>
            <div
              className="grid grid-cols-12 px-6 py-3 text-xs font-semibold uppercase tracking-widest border-b"
              style={{ color: "#7a9fc0", borderColor: "rgba(37,112,245,0.08)" }}
            >
              <span className="col-span-3">Employee</span>
              <span className="col-span-2">Date</span>
              <span className="col-span-1">Hours</span>
              <span className="col-span-2">Type</span>
              <span className="col-span-2">Status</span>
              <span className="col-span-2">Actions</span>
            </div>
            {recentEntries.map((entry) => (
              <div
                key={entry.id}
                className="grid grid-cols-12 px-6 py-3.5 border-b last:border-0"
                style={{ borderColor: "rgba(37,112,245,0.06)" }}
              >
                <div className="col-span-3 flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
                  >
                    {entry.employee.firstName[0]}{entry.employee.lastName[0]}
                  </div>
                  <span className="text-sm truncate" style={{ color: "#eef5ff" }}>
                    {entry.employee.firstName} {entry.employee.lastName}
                  </span>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className="text-sm" style={{ color: "#b8cce8" }}>
                    {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <div className="col-span-1 flex items-center">
                  <span className="text-sm font-semibold" style={{ color: "#eef5ff" }}>{entry.hours}h</span>
                </div>
                <div className="col-span-2 flex items-center">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                    style={typeColors[entry.type] ?? { backgroundColor: "rgba(37,112,245,0.1)", color: "#4d8fff" }}
                  >
                    {entry.type}
                  </span>
                </div>
                <div className="col-span-2 flex items-center">
                  {(() => {
                    const sc = entry.status === "approved"
                      ? { bg: "rgba(52,211,153,0.12)", text: "#34d399", label: "Approved" }
                      : entry.status === "rejected"
                      ? { bg: "rgba(239,68,68,0.12)", text: "#f87171", label: "Rejected" }
                      : { bg: "rgba(251,191,36,0.12)", text: "#fbbf24", label: "Pending" };
                    return (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: sc.bg, color: sc.text }}>
                        {sc.label}
                      </span>
                    );
                  })()}
                </div>
                <div className="col-span-2 flex items-center">
                  {entry.status === "pending" && <TimeActionButtons entryId={entry.id} />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
