import { LayoutGrid, Sliders, Rocket, LifeBuoy } from "lucide-react";

const steps = [
  {
    icon: LayoutGrid,
    step: "01",
    title: "Choose Your Modules",
    description:
      "Pick only the HR tools your organization actually needs. Our module selector walks you through your current pain points and recommends a starting stack.",
    accent: { icon: "#4d8fff", glow: "rgba(30,95,232,0.22)", num: "#1e5fe8" },
  },
  {
    icon: Sliders,
    step: "02",
    title: "Configure Your Workspace",
    description:
      "Set up your org structure, roles, pay schedules, and leave policies. NyxEthos adapts to how your business already runs — not the other way around.",
    accent: { icon: "#a855f7", glow: "rgba(124,58,237,0.22)", num: "#7c3aed" },
  },
  {
    icon: Rocket,
    step: "03",
    title: "Import & Go Live",
    description:
      "Migrate your existing employee data via CSV or direct integrations. Most teams are fully live in under 30 minutes with zero IT involvement.",
    accent: { icon: "#f0d07a", glow: "rgba(201,164,74,0.22)", num: "#c9a44a" },
  },
  {
    icon: LifeBuoy,
    step: "04",
    title: "Grow & Scale",
    description:
      "Activate new modules as your team grows. Our support team is available via live chat and email to help you expand at any pace.",
    accent: { icon: "#10b981", glow: "rgba(4,120,87,0.22)", num: "#047857" },
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 px-6 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #06070f 0%, #0a0b1c 50%, #06070f 100%)",
      }}
    >
      {/* Subtle divider line glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-nyx-border to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
            style={{
              background:
                "linear-gradient(135deg, rgba(10,9,22,0.95), rgba(18,12,38,0.97))",
              border: "1px solid rgba(30,95,232,0.35)",
              boxShadow: "0 0 20px rgba(30,95,232,0.12)",
              color: "#82aaff",
            }}
          >
            Simple by Design
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-nyx-white tracking-[-0.03em] mb-4">
            Up and Running in Minutes
          </h2>
          <p className="text-nyx-text text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Getting started with NyxEthos doesn&apos;t require a consultant, a
            multi-week implementation, or a dedicated IT team.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            return (
              <div key={step.step} className="relative flex flex-col">
                {/* Connector line */}
                {!isLast && (
                  <div
                    className="hidden lg:block absolute top-9 left-[calc(50%+36px)] right-0 h-px"
                    style={{
                      background: `linear-gradient(to right, ${step.accent.glow.replace("0.22", "0.50")}, transparent)`,
                    }}
                  />
                )}

                {/* Step number + icon */}
                <div className="flex flex-col items-start mb-5">
                  <span
                    className="font-heading text-4xl font-bold tracking-tighter mb-3 leading-none"
                    style={{ color: step.accent.num, opacity: 0.45 }}
                  >
                    {step.step}
                  </span>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${step.accent.glow} 0%, rgba(6,7,15,0.6) 100%)`,
                      border: `1px solid ${step.accent.glow.replace("0.22", "0.40")}`,
                      boxShadow: `0 0 28px ${step.accent.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
                    }}
                  >
                    <Icon size={22} style={{ color: step.accent.icon }} />
                  </div>
                </div>

                <h3 className="font-heading text-nyx-white font-semibold text-base tracking-wide mb-2">
                  {step.title}
                </h3>
                <p className="text-nyx-muted text-sm leading-relaxed font-light">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Social proof row */}
        <div
          className="mt-20 rounded-2xl shine-border border border-nyx-border p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          style={{
            background:
              "linear-gradient(145deg, rgba(18,14,44,0.97) 0%, rgba(8,9,20,0.99) 100%)",
            boxShadow:
              "0 0 60px rgba(124,58,237,0.08), 0 20px 40px rgba(0,0,0,0.40)",
          }}
        >
          {[
            { metric: "< 30 min", label: "Average setup time", color: "#4d8fff" },
            { metric: "99.9%", label: "Uptime SLA", color: "#a855f7" },
            {
              metric: "8 modules",
              label: "Fully independent, zero overlap",
              color: "#f0d07a",
            },
          ].map((item) => (
            <div key={item.label}>
              <p
                className="font-heading text-4xl font-bold tracking-tight mb-1"
                style={{
                  background: `linear-gradient(135deg, #eef0ff, ${item.color})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {item.metric}
              </p>
              <p className="text-nyx-muted text-sm tracking-wide">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

