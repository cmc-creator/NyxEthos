import { LayoutGrid, Sliders, Rocket, LifeBuoy } from "lucide-react";

const steps = [
  {
    icon: LayoutGrid,
    step: "01",
    title: "Choose Your Modules",
    description:
      "Pick only the HR tools your organization actually needs. Our module selector walks you through your current pain points and recommends a starting stack.",
  },
  {
    icon: Sliders,
    step: "02",
    title: "Configure Your Workspace",
    description:
      "Set up your org structure, roles, pay schedules, and leave policies. NyxEthos adapts to how your business already runs  -  not the other way around.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Import &amp; Go Live",
    description:
      "Migrate your existing employee data via CSV or direct integrations. Most teams are fully live in under 30 minutes with zero IT involvement.",
  },
  {
    icon: LifeBuoy,
    step: "04",
    title: "Grow &amp; Scale",
    description:
      "Activate new modules as your team grows. Our support team is available via live chat and email to help you expand at any pace.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #060e1e 0%, #0a1830 50%, #060e1e 100%)" }}
    >
      {/* Subtle divider line glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-nyx-border to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card shine-border border border-nyx-border text-nyx-blue-bright text-xs font-semibold tracking-widest uppercase mb-6">
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
                  <div className="hidden lg:block absolute top-9 left-[calc(50%+32px)] right-0 h-px"
                    style={{ background: "linear-gradient(to right, rgba(37,112,245,0.35), rgba(37,112,245,0.05))" }}
                  />
                )}

                {/* Step number + icon */}
                <div className="flex flex-col items-start mb-5">
                  <span className="font-heading text-nyx-blue/40 text-4xl font-bold tracking-tighter mb-3 leading-none">
                    {step.step}
                  </span>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{
                      background: "linear-gradient(135deg, rgba(37,112,245,0.18) 0%, rgba(99,102,241,0.12) 100%)",
                      border: "1px solid rgba(37,112,245,0.28)",
                      boxShadow: "0 0 24px rgba(37,112,245,0.12), inset 0 1px 0 rgba(255,255,255,0.07)",
                    }}
                  >
                    <Icon size={22} className="text-nyx-blue-bright" />
                  </div>
                </div>

                <h3 className="font-heading text-nyx-white font-semibold text-base tracking-wide mb-2"
                  dangerouslySetInnerHTML={{ __html: step.title }}
                />
                <p className="text-nyx-muted text-sm leading-relaxed font-light"
                  dangerouslySetInnerHTML={{ __html: step.description }}
                />
              </div>
            );
          })}
        </div>

        {/* Social proof row */}
        <div className="mt-20 rounded-2xl glass-card shine-border border border-nyx-border p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { metric: "< 30 min", label: "Average setup time" },
            { metric: "99.9%", label: "Uptime SLA" },
            { metric: "8 modules", label: "Fully independent, zero overlap" },
          ].map((item) => (
            <div key={item.label}>
              <p className="font-heading text-4xl font-bold text-gradient tracking-tight mb-1">
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
