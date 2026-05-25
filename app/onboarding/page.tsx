import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { UserPlus, Plus, CheckCircle, Circle } from "lucide-react";
import Link from "next/link";
import OnboardingToggle from "@/components/OnboardingToggle";

function getOrgId(session: { user?: { orgId?: string } } | null) {
  return session?.user?.orgId ?? null;
}

const c1 = "#eef5ff";
const c2 = "#a0b8d8";
const c3 = "#7a9fc0";

const catColors: Record<string, string> = {
  hr: "#8b5cf6",
  it: "#2570f5",
  training: "#f59e0b",
  social: "#10b981",
  milestone: "#ec4899",
  general: "#4b5563",
};

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) redirect("/login");

  const plans = await prisma.onboardingPlan.findMany({
    where: { orgId },
    orderBy: { createdAt: "desc" },
    include: {
      employee: {
        select: { firstName: true, lastName: true, department: true, jobTitle: true },
      },
      tasks: { orderBy: { order: "asc" } },
    },
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(37,112,245,0.15)" }}
          >
            <UserPlus size={18} style={{ color: "#4d8fff" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-heading" style={{ color: c1 }}>
              Onboarding
            </h1>
            <p className="text-sm" style={{ color: c3 }}>
              {plans.length} active plan{plans.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Link
          href="/onboarding/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
        >
          <Plus size={14} />
          New Plan
        </Link>
      </div>

      {plans.length === 0 ? (
        <div
          className="glass-card rounded-2xl p-16 flex flex-col items-center gap-3"
          style={{ color: c3 }}
        >
          <UserPlus size={40} style={{ opacity: 0.4 }} />
          <p className="text-sm">No onboarding plans yet.</p>
          <Link
            href="/onboarding/new"
            className="text-xs px-4 py-2 rounded-lg font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
          >
            Create First Plan
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {plans.map((plan) => {
            const total = plan.tasks.length;
            const done = plan.tasks.filter((t) => t.completedAt !== null).length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <div key={plan.id} className="glass-card rounded-2xl p-6">
                {/* Plan header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-base font-semibold font-heading" style={{ color: c1 }}>
                        {plan.employee.firstName} {plan.employee.lastName}
                      </h2>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background:
                            plan.status === "completed"
                              ? "rgba(52,211,153,0.12)"
                              : "rgba(37,112,245,0.12)",
                          color:
                            plan.status === "completed" ? "#34d399" : "#4d8fff",
                        }}
                      >
                        {plan.status === "completed" ? "Completed" : "In Progress"}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: c2 }}>
                      {plan.employee.jobTitle ?? ""}
                      {plan.employee.jobTitle && plan.employee.department ? " · " : ""}
                      {plan.employee.department ?? ""}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: c3 }}>
                      {plan.templateName}
                    </p>
                  </div>
                  {/* Progress ring */}
                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                    <span className="text-2xl font-bold font-heading" style={{ color: c1 }}>
                      {pct}%
                    </span>
                    <span className="text-xs" style={{ color: c3 }}>
                      {done}/{total} tasks
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div
                  className="w-full h-1.5 rounded-full mb-5"
                  style={{ background: "rgba(37,112,245,0.12)" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: "linear-gradient(90deg, #2570f5, #6366f1)",
                    }}
                  />
                </div>

                {/* Task list */}
                <div className="space-y-2">
                  {plan.tasks.map((task) => {
                    const catColor = catColors[task.category] ?? "#4b5563";
                    return (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 py-2 px-3 rounded-xl transition-colors"
                        style={{
                          background: task.completedAt
                            ? "rgba(52,211,153,0.05)"
                            : "rgba(37,112,245,0.04)",
                          opacity: task.completedAt ? 0.7 : 1,
                        }}
                      >
                        <OnboardingToggle
                          taskId={task.id}
                          completed={task.completedAt !== null}
                        />
                        <span
                          className="text-sm flex-1"
                          style={{
                            color: task.completedAt ? c3 : c1,
                            textDecoration: task.completedAt ? "line-through" : "none",
                          }}
                        >
                          {task.title}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full uppercase font-semibold tracking-wide"
                          style={{
                            background: `${catColor}18`,
                            color: catColor,
                          }}
                        >
                          {task.category}
                        </span>
                        {task.dueDate && (
                          <span className="text-xs" style={{ color: c3 }}>
                            {new Date(task.dueDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
