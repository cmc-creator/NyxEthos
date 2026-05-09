import {
  UserPlus,
  DollarSign,
  Clock,
  Heart,
  Star,
  FileCheck,
  FolderOpen,
  CalendarDays,
} from "lucide-react";

const modules = [
  {
    icon: UserPlus,
    title: "Employee Onboarding",
    description:
      "Streamline day-one with automated task lists, e-signatures, and role-specific onboarding tracks. New hires are productive from the start.",
    tags: ["E-signatures", "Task automation", "Role tracks"],
  },
  {
    icon: DollarSign,
    title: "Payroll",
    description:
      "Accurate, compliant payroll runs on your schedule. Direct deposit, multi-state support, tax filings, and real-time payroll previews built in.",
    tags: ["Multi-state", "Direct deposit", "Tax filings"],
  },
  {
    icon: Clock,
    title: "Time & Attendance",
    description:
      "Clock-in via web or mobile, track hours against schedules, flag overtime automatically, and sync directly to payroll.",
    tags: ["Mobile clock-in", "Overtime alerts", "Payroll sync"],
  },
  {
    icon: Heart,
    title: "Benefits Management",
    description:
      "Let employees self-enroll in benefits plans. Manage open enrollment windows, dependents, and carrier integrations all in one place.",
    tags: ["Self-enrollment", "Open enrollment", "Carrier sync"],
  },
  {
    icon: Star,
    title: "Performance Reviews",
    description:
      "Schedule and run structured reviews — 360°, manager-led, or self-reviews. Track goals, ratings, and improvement plans over time.",
    tags: ["360° reviews", "Goal tracking", "Custom templates"],
  },
  {
    icon: FileCheck,
    title: "Compliance & Reporting",
    description:
      "Stay audit-ready with built-in federal and state compliance checklists, automated EEOC and ACA reports, and real-time policy alerts.",
    tags: ["EEOC reports", "ACA filing", "Policy alerts"],
  },
  {
    icon: FolderOpen,
    title: "Document Management",
    description:
      "Centralize all HR documents — offer letters, policies, signed agreements — with version control, access permissions, and expiry reminders.",
    tags: ["Version control", "Access control", "Expiry alerts"],
  },
  {
    icon: CalendarDays,
    title: "PTO & Leave Tracking",
    description:
      "Configurable leave policies, manager approvals, team calendar view, and automatic balance accruals with FMLA tracking built in.",
    tags: ["Custom policies", "FMLA tracking", "Team calendar"],
  },
];

export default function Modules() {
  return (
    <section id="modules" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-nyx-border bg-nyx-surface text-nyx-blue-bright text-xs font-semibold tracking-wide mb-5">
            Modular by Design
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-nyx-white tracking-tight mb-4">
            Activate Only What You Need
          </h2>
          <p className="text-nyx-text text-lg max-w-2xl mx-auto">
            Every NyxEthos module is a standalone building block. Start with one,
            stack more as you grow. Never pay for features you don&apos;t use.
          </p>
        </div>

        {/* Module grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.title}
                className="group relative rounded-2xl border border-nyx-border bg-nyx-card p-6 transition-all duration-300 hover:border-nyx-blue hover:shadow-card-hover cursor-default overflow-hidden"
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-card-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />

                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-nyx-bg border border-nyx-border flex items-center justify-center mb-4 group-hover:border-nyx-blue transition-colors duration-300">
                    <Icon size={20} className="text-nyx-blue group-hover:text-nyx-blue-bright transition-colors duration-300" />
                  </div>
                  <h3 className="text-nyx-white font-semibold text-base mb-2">
                    {mod.title}
                  </h3>
                  <p className="text-nyx-muted text-sm leading-relaxed mb-4">
                    {mod.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {mod.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-xs bg-nyx-bg border border-nyx-border text-nyx-muted group-hover:border-nyx-blue/40 group-hover:text-nyx-text transition-colors duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <p className="text-center text-nyx-muted text-sm mt-10">
          All modules integrate seamlessly with each other.{" "}
          <a href="#pricing" className="text-nyx-blue-bright hover:underline">
            See pricing →
          </a>
        </p>
      </div>
    </section>
  );
}
