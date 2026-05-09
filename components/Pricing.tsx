"use client";

import { Check } from "lucide-react";
import { useWaitlist } from "@/context/WaitlistContext";

const plans = [
  {
    name: "Starter",
    price: "$6",
    per: "per employee / mo",
    description: "For small teams getting HR off the ground.",
    modules: 3,
    moduleNote: "Any 3 modules",
    features: [
      "Up to 50 employees",
      "Any 3 NyxEthos modules",
      "CSV data import",
      "Email support",
      "Standard reporting",
      "99.9% uptime SLA",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$12",
    per: "per employee / mo",
    description: "For scaling teams that need more coverage.",
    modules: 6,
    moduleNote: "Any 6 modules",
    features: [
      "Up to 250 employees",
      "Any 6 NyxEthos modules",
      "API + CSV import",
      "Live chat & email support",
      "Advanced reporting & exports",
      "Role-based access control",
      "Custom leave policies",
      "Priority onboarding",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    per: "contact us for pricing",
    description: "For large organizations with complex needs.",
    modules: 8,
    moduleNote: "All 8 modules",
    features: [
      "Unlimited employees",
      "All 8 NyxEthos modules",
      "Dedicated account manager",
      "SSO / SAML integration",
      "Custom integrations & APIs",
      "SLA 99.99% uptime",
      "Data residency options",
      "Compliance consulting",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function Pricing() {
  const { open } = useWaitlist();
  return (
    <section id="pricing" className="py-24 px-6 relative">
      {/* Background orbs */}
      <div className="absolute inset-0 bg-hero-gradient opacity-40 pointer-events-none" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "rgba(37,112,245,0.10)", filter: "blur(120px)" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card shine-border border border-nyx-border text-nyx-blue-bright text-xs font-semibold tracking-widest uppercase mb-6">
            Transparent Pricing
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-nyx-white tracking-[-0.03em] mb-4">
            Pay for What You Use
          </h2>
          <p className="text-nyx-text text-lg max-w-2xl mx-auto font-light leading-relaxed">
            No hidden fees, no annual lock-in surprises. Every plan includes a
            14-day free trial with full module access.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1"
              style={plan.highlighted ? {
                background: "linear-gradient(145deg, rgba(15,42,100,0.98) 0%, rgba(8,25,65,0.99) 100%)",
                border: "2px solid rgba(77,143,255,0.70)",
                boxShadow: "0 0 0 1px rgba(77,143,255,0.25), 0 0 100px rgba(37,112,245,0.40), 0 20px 60px rgba(37,112,245,0.20)",
              } : {
                background: "linear-gradient(145deg, rgba(22,52,106,0.90) 0%, rgba(12,28,62,0.95) 100%)",
                border: "1px solid rgba(37,112,245,0.28)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
              }}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase whitespace-nowrap"
                  style={{
                    background: "linear-gradient(135deg, #c9a44a 0%, #f0d889 50%, #c9a44a 100%)",
                    color: "#060e1e",
                    boxShadow: "0 0 32px rgba(201,164,74,0.55)",
                  }}
                >
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <p className="font-heading text-nyx-muted text-xs font-semibold tracking-widest uppercase mb-3">
                  {plan.name}
                </p>
                <div className="flex items-end gap-2 mb-1">
                  <span className={`font-heading text-4xl font-bold tracking-tight ${
                    plan.highlighted ? "text-gradient" : "text-nyx-white"
                  }`}>
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-nyx-muted text-sm pb-1">{plan.per}</span>
                  )}
                </div>
                {plan.price === "Custom" && (
                  <p className="text-nyx-muted text-sm">{plan.per}</p>
                )}
                <p className="text-nyx-text text-sm mt-2 font-light">{plan.description}</p>
              </div>

              {/* Module count badge */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card border border-nyx-border mb-6">
                <div className={`w-2 h-2 rounded-full ${
                  plan.highlighted ? "bg-nyx-gold" : "bg-nyx-blue-bright"
                }`} />
                <span className="text-nyx-text text-sm font-medium font-heading">
                  {plan.moduleNote}
                </span>
              </div>

              {/* Features list */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      size={14}
                      className={`mt-0.5 flex-shrink-0 ${
                        plan.highlighted ? "text-nyx-gold" : "text-nyx-blue-bright"
                      }`}
                    />
                    <span className="text-nyx-text text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => open(plan.name)}
                className={`w-full py-3.5 rounded-full text-sm font-semibold text-center transition-all duration-300 tracking-wide ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-nyx-blue to-nyx-blue-bright text-white shadow-btn-primary hover:shadow-btn-primary-hover hover:-translate-y-0.5"
                    : "glass-card border border-nyx-border hover:border-nyx-border-bright text-nyx-text hover:text-nyx-white"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-nyx-muted text-sm mt-8 tracking-wide">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
}
