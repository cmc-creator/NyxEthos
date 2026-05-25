import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Star, Users, TrendingUp, Calendar, Plus } from "lucide-react";

function getOrgId(session: { user?: { orgId?: string } } | null): string | null {
  return session?.user?.orgId ?? null;
}

export default async function PerformancePage() {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) redirect("/sign-in");

  const [reviews, employeeCount] = await Promise.all([
    prisma.performanceReview.findMany({
      where: { orgId },
      include: { employee: { select: { firstName: true, lastName: true, jobTitle: true, department: true } } },
      orderBy: { reviewDate: "desc" },
      take: 20,
    }),
    prisma.employee.count({ where: { orgId, status: "active" } }),
  ]);

  const avgScore = reviews.filter((r) => r.score !== null).length > 0
    ? reviews.filter((r) => r.score !== null).reduce((s, r) => s + (r.score ?? 0), 0) /
      reviews.filter((r) => r.score !== null).length
    : null;

  const scheduled = reviews.filter((r) => r.status === "scheduled").length;
  const completed = reviews.filter((r) => r.status === "completed").length;

  const statusConfig: Record<string, { bg: string; text: string }> = {
    scheduled: { bg: "rgba(37,112,245,0.12)", text: "#4d8fff" },
    "in-progress": { bg: "rgba(251,191,36,0.12)", text: "#fbbf24" },
    completed: { bg: "rgba(52,211,153,0.12)", text: "#34d399" },
  };

  function renderStars(score: number | null) {
    if (score === null) return <span style={{ color: "#7a9fc0" }}>—</span>;
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={12}
            style={{ color: s <= Math.round(score) ? "#fbbf24" : "rgba(251,191,36,0.2)" }}
            fill={s <= Math.round(score) ? "#fbbf24" : "transparent"}
          />
        ))}
        <span className="text-xs ml-1" style={{ color: "#7a9fc0" }}>{score.toFixed(1)}</span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: "#eef5ff" }}>
            Performance
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#7a9fc0" }}>
            Reviews, goals, and employee performance tracking.
          </p>
        </div>
        <Link
          href="/performance/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
        >
          <Plus size={14} />
          Schedule Review
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { icon: Star, label: "Total Reviews", value: String(reviews.length), sub: "All time", color: "blue" as const },
          { icon: Calendar, label: "Scheduled", value: String(scheduled), sub: "Upcoming", color: "amber" as const },
          { icon: TrendingUp, label: "Completed", value: String(completed), sub: "This cycle", color: "green" as const },
          { icon: Users, label: "Avg Score", value: avgScore !== null ? `${avgScore.toFixed(1)}/5` : "—", sub: "Team average", color: "purple" as const },
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

      {/* Reviews table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "rgba(37,112,245,0.12)" }}>
          <h2 className="text-base font-semibold font-heading" style={{ color: "#eef5ff" }}>Performance Reviews</h2>
          {employeeCount > 0 && reviews.length === 0 && (
            <Link
              href="/performance/new"
              className="flex items-center gap-1.5 text-xs font-medium opacity-70 hover:opacity-100 transition-opacity"
              style={{ color: "#4d8fff" }}
            >
              <Plus size={12} /> Schedule Review
            </Link>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(37,112,245,0.1)", border: "1px solid rgba(37,112,245,0.18)" }}
            >
              <Star size={24} style={{ color: "#4d8fff" }} />
            </div>
            <p className="text-base font-semibold mb-2" style={{ color: "#eef5ff" }}>No reviews yet</p>
            <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: "#7a9fc0" }}>
              {employeeCount === 0
                ? "Add employees first, then schedule performance reviews."
                : "Schedule your first performance review to start tracking team growth."}
            </p>
            <Link
              href={employeeCount === 0 ? "/employees/new" : "/performance/new"}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
            >
              <Plus size={14} />
              {employeeCount === 0 ? "Add Employee" : "Schedule First Review"}
            </Link>
          </div>
        ) : (
          <div>
            <div
              className="grid grid-cols-12 px-6 py-3 text-xs font-semibold uppercase tracking-widest border-b"
              style={{ color: "#7a9fc0", borderColor: "rgba(37,112,245,0.08)" }}
            >
              <span className="col-span-4">Employee</span>
              <span className="col-span-2">Period</span>
              <span className="col-span-2">Review Date</span>
              <span className="col-span-2">Score</span>
              <span className="col-span-2">Status</span>
            </div>
            {reviews.map((review) => {
              const sc = statusConfig[review.status] ?? statusConfig.scheduled;
              return (
                <div
                  key={review.id}
                  className="grid grid-cols-12 px-6 py-3.5 border-b last:border-0"
                  style={{ borderColor: "rgba(37,112,245,0.06)" }}
                >
                  <div className="col-span-4 flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
                    >
                      {review.employee.firstName[0]}{review.employee.lastName[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm truncate" style={{ color: "#eef5ff" }}>
                        {review.employee.firstName} {review.employee.lastName}
                      </p>
                      <p className="text-xs truncate" style={{ color: "#7a9fc0" }}>
                        {review.employee.jobTitle || review.employee.department || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm" style={{ color: "#b8cce8" }}>{review.period}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm" style={{ color: "#b8cce8" }}>
                      {new Date(review.reviewDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    {renderStars(review.score)}
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span
                      className="text-xs px-2.5 py-0.5 rounded-full font-medium capitalize"
                      style={{ background: sc.bg, color: sc.text }}
                    >
                      {review.status}
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
