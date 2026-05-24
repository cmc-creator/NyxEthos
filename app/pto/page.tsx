import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { CalendarDays, Clock, CheckCircle, XCircle, Plus } from "lucide-react";

function getOrgId(session: Awaited<ReturnType<typeof getServerSession>>): string | null {
  return (session?.user as { orgId?: string })?.orgId ?? null;
}

export default async function PTOPage() {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) redirect("/sign-in");

  const requests = await prisma.leaveRequest.findMany({
    where: { orgId },
    include: { employee: { select: { firstName: true, lastName: true, jobTitle: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const pending = requests.filter((r) => r.status === "pending").length;
  const approved = requests.filter((r) => r.status === "approved").length;
  const totalDays = requests
    .filter((r) => r.status === "approved")
    .reduce((sum, r) => sum + r.days, 0);

  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: "rgba(251,191,36,0.12)", text: "#fbbf24", label: "Pending" },
    approved: { bg: "rgba(52,211,153,0.12)", text: "#34d399", label: "Approved" },
    rejected: { bg: "rgba(239,68,68,0.12)", text: "#f87171", label: "Rejected" },
  };

  const typeLabels: Record<string, string> = {
    vacation: "Vacation",
    sick: "Sick Leave",
    personal: "Personal",
    maternity: "Maternity",
    paternity: "Paternity",
    other: "Other",
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: "#eef5ff" }}>
            PTO &amp; Leave
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#7a9fc0" }}>
            Manage time-off requests and leave balances.
          </p>
        </div>
        <Link
          href="/pto/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
        >
          <Plus size={14} />
          New Request
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { icon: CalendarDays, label: "Total Requests", value: String(requests.length), sub: "All time", color: "blue" as const },
          { icon: Clock, label: "Pending Review", value: String(pending), sub: "Awaiting approval", color: "amber" as const },
          { icon: CheckCircle, label: "Approved", value: String(approved), sub: "This year", color: "green" as const },
          { icon: XCircle, label: "Days Taken", value: `${totalDays}`, sub: "Approved leaves", color: "purple" as const },
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

      {/* Leave requests table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "rgba(37,112,245,0.12)" }}>
          <h2 className="text-base font-semibold font-heading" style={{ color: "#eef5ff" }}>Leave Requests</h2>
          {pending > 0 && (
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24" }}>
              {pending} pending
            </span>
          )}
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(37,112,245,0.1)", border: "1px solid rgba(37,112,245,0.18)" }}
            >
              <CalendarDays size={24} style={{ color: "#4d8fff" }} />
            </div>
            <p className="text-base font-semibold mb-2" style={{ color: "#eef5ff" }}>No leave requests yet</p>
            <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: "#7a9fc0" }}>
              Submit and track time-off requests for your team here.
            </p>
            <Link
              href="/pto/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
            >
              <Plus size={14} /> Submit First Request
            </Link>
          </div>
        ) : (
          <div>
            <div
              className="grid grid-cols-12 px-6 py-3 text-xs font-semibold uppercase tracking-widest border-b"
              style={{ color: "#7a9fc0", borderColor: "rgba(37,112,245,0.08)" }}
            >
              <span className="col-span-4">Employee</span>
              <span className="col-span-2">Type</span>
              <span className="col-span-3">Dates</span>
              <span className="col-span-1">Days</span>
              <span className="col-span-2">Status</span>
            </div>
            {requests.map((req) => {
              const sc = statusConfig[req.status] ?? statusConfig.pending;
              return (
                <div
                  key={req.id}
                  className="grid grid-cols-12 px-6 py-3.5 border-b last:border-0"
                  style={{ borderColor: "rgba(37,112,245,0.06)" }}
                >
                  <div className="col-span-4 flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
                    >
                      {req.employee.firstName[0]}{req.employee.lastName[0]}
                    </div>
                    <span className="text-sm truncate" style={{ color: "#eef5ff" }}>
                      {req.employee.firstName} {req.employee.lastName}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm" style={{ color: "#b8cce8" }}>
                      {typeLabels[req.type] ?? req.type}
                    </span>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <span className="text-xs" style={{ color: "#7a9fc0" }}>
                      {new Date(req.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      {" — "}
                      {new Date(req.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <span className="text-sm font-semibold" style={{ color: "#eef5ff" }}>{req.days}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span
                      className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                      style={{ background: sc.bg, color: sc.text }}
                    >
                      {sc.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
