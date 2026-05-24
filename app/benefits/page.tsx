import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Heart, Users, DollarSign, Shield, Activity } from "lucide-react";

function getOrgId(session: Awaited<ReturnType<typeof getServerSession>>): string | null {
  return (session?.user as { orgId?: string })?.orgId ?? null;
}

const benefitPlans = [
  {
    name: "Medical Insurance",
    provider: "Blue Cross Blue Shield",
    type: "Health",
    description: "Comprehensive medical coverage with low deductibles.",
    icon: Heart,
    color: "#f87171",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.2)",
  },
  {
    name: "Dental & Vision",
    provider: "Delta Dental / EyeMed",
    type: "Health",
    description: "Dental cleanings, orthodontics, and vision plan.",
    icon: Shield,
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.2)",
  },
  {
    name: "401(k) Retirement",
    provider: "Fidelity",
    type: "Retirement",
    description: "Company matches up to 4% of contributions.",
    icon: DollarSign,
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.2)",
  },
  {
    name: "Life Insurance",
    provider: "MetLife",
    type: "Insurance",
    description: "Basic life insurance coverage at 2x annual salary.",
    icon: Shield,
    color: "#818cf8",
    bg: "rgba(99,102,241,0.12)",
    border: "rgba(99,102,241,0.2)",
  },
  {
    name: "Mental Health",
    provider: "Lyra Health",
    type: "Wellness",
    description: "12 free therapy sessions per year.",
    icon: Activity,
    color: "#4d8fff",
    bg: "rgba(37,112,245,0.12)",
    border: "rgba(37,112,245,0.22)",
  },
];

export default async function BenefitsPage() {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) redirect("/sign-in");

  const employeeCount = await prisma.employee.count({ where: { orgId } });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: "#eef5ff" }}>
            Benefits
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#7a9fc0" }}>
            Employee benefits plans and enrollment.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { icon: Heart, label: "Plans Available", value: String(benefitPlans.length), sub: "Active benefit plans", color: "blue" as const },
          { icon: Users, label: "Eligible Employees", value: String(employeeCount), sub: "Full-time employees", color: "green" as const },
          { icon: DollarSign, label: "Plan Types", value: "4", sub: "Health, Retirement, Insurance, Wellness", color: "purple" as const },
          { icon: Shield, label: "Open Enrollment", value: "Nov", sub: "Annual enrollment period", color: "amber" as const },
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

      {/* Benefits grid */}
      <div>
        <h2 className="text-base font-semibold font-heading mb-4" style={{ color: "#eef5ff" }}>
          Available Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefitPlans.map((plan) => (
            <div
              key={plan.name}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: plan.bg, border: `1px solid ${plan.border}` }}
                >
                  <plan.icon size={18} style={{ color: plan.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold" style={{ color: "#eef5ff" }}>{plan.name}</p>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                      style={{ background: "rgba(37,112,245,0.1)", color: "#4d8fff" }}
                    >
                      {plan.type}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "#7a9fc0" }}>{plan.provider}</p>
                </div>
              </div>
              <p className="text-sm" style={{ color: "#b8cce8" }}>{plan.description}</p>
              <div className="mt-4 pt-4 flex items-center justify-between border-t" style={{ borderColor: "rgba(37,112,245,0.1)" }}>
                <span className="text-xs font-medium" style={{ color: "#34d399" }}>
                  ✓ Active
                </span>
                <Link
                  href="/employees"
                  className="text-xs font-medium transition-opacity hover:opacity-100 opacity-70"
                  style={{ color: "#4d8fff" }}
                >
                  Manage enrollment →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
