import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Users, UserCheck, Building2, CalendarDays, Plus, ChevronRight } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.orgId) redirect("/sign-in");

  const orgId = session.user.orgId;

  const [total, active, departments, recent] = await Promise.all([
    prisma.employee.count({ where: { orgId } }),
    prisma.employee.count({ where: { orgId, status: "ACTIVE" } }),
    prisma.employee.groupBy({ by: ["department"], where: { orgId, department: { not: null } } }),
    prisma.employee.findMany({
      where: { orgId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, firstName: true, lastName: true, jobTitle: true, department: true, status: true, createdAt: true },
    }),
  ]);

  const stats = [
    { label: "Total Employees", value: total, icon: Users, color: "#2570f5" },
    { label: "Active", value: active, icon: UserCheck, color: "#22c55e" },
    { label: "Departments", value: departments.length, icon: Building2, color: "#a855f7" },
    { label: "Added This Month", value: recent.filter(e => {
        const d = new Date(e.createdAt);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length, icon: CalendarDays, color: "#f59e0b" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-nyx-white text-2xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-nyx-muted text-sm mt-1">Welcome back, {session.user.name}</p>
        </div>
        <Link
          href="/employees/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ background: "linear-gradient(135deg,#2570f5,#4d8fff)", boxShadow: "0 0 20px rgba(37,112,245,0.35)" }}
        >
          <Plus size={15} />
          Add Employee
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl p-5 border"
            style={{ background: "rgba(10,24,50,0.7)", borderColor: "rgba(37,112,245,0.18)" }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-nyx-muted text-xs font-medium">{label}</span>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: color + "22", border: "1px solid " + color + "44" }}>
                <Icon size={15} style={{ color }} />
              </div>
            </div>
            <p className="text-nyx-white text-3xl font-extrabold">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent employees */}
      <div className="rounded-2xl border overflow-hidden"
        style={{ background: "rgba(10,24,50,0.7)", borderColor: "rgba(37,112,245,0.18)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "rgba(37,112,245,0.14)" }}>
          <h2 className="text-nyx-white font-semibold text-sm">Recent Employees</h2>
          <Link href="/employees" className="flex items-center gap-1 text-nyx-muted hover:text-nyx-white text-xs transition-colors">
            View all <ChevronRight size={13} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Users size={32} className="mx-auto mb-3 opacity-30 text-nyx-muted" />
            <p className="text-nyx-muted text-sm">No employees yet.</p>
            <Link href="/employees/new" className="inline-block mt-4 text-sm text-nyx-blue-bright hover:underline">
              Add your first employee →
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(37,112,245,0.1)" }}>
                {["Name", "Job Title", "Department", "Status"].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-nyx-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((emp) => (
                <tr key={emp.id} className="group transition-colors hover:bg-white/[0.02]">
                  <td className="px-6 py-3.5">
                    <Link href={`/employees/${emp.id}`} className="text-nyx-white text-sm font-medium hover:text-nyx-blue-bright transition-colors">
                      {emp.firstName} {emp.lastName}
                    </Link>
                  </td>
                  <td className="px-6 py-3.5 text-nyx-muted text-sm">{emp.jobTitle || "—"}</td>
                  <td className="px-6 py-3.5 text-nyx-muted text-sm">{emp.department || "—"}</td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={emp.status === "ACTIVE"
                        ? { background: "rgba(34,197,94,0.15)", color: "#86efac" }
                        : { background: "rgba(148,163,184,0.12)", color: "#94a3b8" }}>
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
