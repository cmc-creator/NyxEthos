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
    jewel: {
      bg: "rgba(30,95,232,0.18)",
      border: "rgba(30,95,232,0.30)",
      glow: "rgba(30,95,232,0.15)",
      icon: "text-nyx-blue-bright",
      iconHover: "#4d8fff",
    },
  },
  {
    icon: DollarSign,
    title: "Payroll",
    description:
      "Accurate, compliant payroll runs on your schedule. Direct deposit, multi-state support, tax filings, and real-time payroll previews built in.",
    tags: ["Multi-state", "Direct deposit", "Tax filings"],
    jewel: {
      bg: "rgba(201,164,74,0.16)",
      border: "rgba(201,164,74,0.32)",
      glow: "rgba(201,164,74,0.14)",
      icon: "text-nyx-gold",
      iconHover: "#f0d07a",
    },
  },
  {
    icon: Clock,
    title: "Time & Attendance",
    description:
      "Clock-in via web or mobile, track hours against schedules, flag overtime automatically, and sync directly to payroll.",
    tags: ["Mobile clock-in", "Overtime alerts", "Payroll sync"],
    jewel: {
      bg: "rgba(4,120,87,0.16)",
      border: "rgba(4,120,87,0.32)",
      glow: "rgba(4,120,87,0.14)",
      icon: "text-nyx-emerald-bright",
      iconHover: "#10b981",
    },
  },
  {
    icon: Heart,
    title: "Benefits Management",
    description:
      "Let employees self-enroll in benefits plans. Manage open enrollment windows, dependents, and carrier integrations all in one place.",
    tags: ["Self-enrollment", "Open enrollment", "Carrier sync"],
    jewel: {
      bg: "rgba(190,18,60,0.15)",
      border: "rgba(190,18,60,0.30)",
      glow: "rgba(190,18,60,0.13)",
      icon: "text-nyx-ruby-bright",
      iconHover: "#f43f5e",
    },
  },
  {
    icon: Star,
    title: "Performance Reviews",
    description:
      "Schedule and run structured reviews — 360°, manager-led, or self-reviews. Track goals, ratings, and improvement plans over time.",
    tags: ["360° reviews", "Goal tracking", "Custom templates"],
    jewel: {
      bg: "rgba(124,58,237,0.16)",
      border: "rgba(124,58,237,0.32)",
      glow: "rgba(124,58,237,0.14)",
      icon: "text-nyx-violet-bright",
      iconHover: "#a855f7",
    },
  },
  {
    icon: FileCheck,
    title: "Compliance & Reporting",
    description:
      "Stay audit-ready with built-in federal and state compliance checklists, automated EEOC and ACA reports, and real-time policy alerts.",
    tags: ["EEOC reports", "ACA filing", "Policy alerts"],
    jewel: {
      bg: "rgba(15,118,110,0.16)",
      border: "rgba(15,118,110,0.32)",
      glow: "rgba(15,118,110,0.14)",
      icon: "text-nyx-teal-bright",
      iconHover: "#2dd4bf",
    },
  },
  {
    icon: FolderOpen,
    title: "Document Management",
    description:
      "Centralize all HR documents — offer letters, policies, signed agreements — with version control, access permissions, and expiry reminders.",
    tags: ["Version control", "Access control", "Expiry alerts"],
    jewel: {
      bg: "rgba(30,95,232,0.14)",
      border: "rgba(77,143,255,0.28)",
      glow: "rgba(77,143,255,0.12)",
      icon: "text-nyx-blue-bright",
      iconHover: "#82aaff",
    },
  },
  {
    icon: CalendarDays,
    title: "PTO & Leave Tracking",
    description:
      "Configurable leave policies, manager approvals, team calendar view, and automatic balance accruals with FMLA tracking built in.",
    tags: ["Custom policies", "FMLA tracking", "Team calendar"],
    jewel: {
      bg: "rgba(4,120,87,0.14)",
      border: "rgba(16,185,129,0.28)",
      glow: "rgba(16,185,129,0.12)",
      icon: "text-nyx-emerald-bright",
      iconHover: "#34d399",
    },
  },
];

export default function Modules() {
  return (
    <section
      id="modules"
      className="py-24 px-6 relative"
      style={{
        background:
          "linear-gradient(180deg, #06070f 0%, #09091a 50%, #06070f 100%)",
      }}
    >
      {/* Subtle amethyst orb center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "rgba(109,40,217,0.07)", filter: "blur(120px)" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
            style={{
              background:
                "linear-gradient(135deg, rgba(10,9,22,0.95), rgba(18,12,38,0.97))",
              border: "1px solid rgba(168,85,247,0.38)",
              boxShadow: "0 0 20px rgba(124,58,237,0.15)",
              color: "#c4b5fd",
            }}
          >
            Modular by Design
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-nyx-white tracking-[-0.03em] mb-4">
            Activate Only What You Need
          </h2>
          <p className="text-nyx-text text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Every NyxEthos module is a standalone building block. Start with
            one, stack more as you grow. Never pay for features you don&apos;t
            use.
          </p>
        </div>

        {/* Module grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.title}
                className="group relative rounded-2xl shine-border border p-6 transition-all duration-300 hover:-translate-y-1.5 cursor-default overflow-hidden"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(14,13,28,0.97) 0%, rgba(8,9,20,0.99) 100%)",
                  borderColor: mod.jewel.border,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.40)`,
                }}
              >
                {/* Hover glow overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-2xl"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${mod.jewel.glow} 0%, transparent 70%)`,
                    boxShadow: `inset 0 0 0 1px ${mod.jewel.border}`,
                  }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${mod.jewel.bg} 0%, rgba(6,7,15,0) 100%)`,
                      border: `1px solid ${mod.jewel.border}`,
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.07), 0 0 16px ${mod.jewel.glow}`,
                    }}
                  >
                    <Icon
                      size={18}
                      className={`${mod.jewel.icon} transition-colors duration-300`}
                    />
                  </div>

                  <h3 className="font-heading text-nyx-white font-semibold text-sm tracking-wide mb-2">
                    {mod.title}
                  </h3>
                  <p className="text-nyx-muted text-sm leading-relaxed mb-4">
                    {mod.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {mod.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full text-xs tracking-wide transition-all duration-300"
                        style={{
                          background: "rgba(6,7,15,0.80)",
                          border: `1px solid ${mod.jewel.border}`,
                          color: "#9094bc",
                        }}
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
          <a
            href="#pricing"
            className="text-nyx-violet-bright hover:text-nyx-gold transition-colors"
          >
            See pricing →
          </a>
        </p>
      </div>
    </section>
  );
}

