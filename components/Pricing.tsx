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
      <div className="absolute inset-0 bg-hero-gradient opacity-50 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-nyx-border bg-nyx-surface text-nyx-blue-bright text-xs font-semibold tracking-wide mb-5">
            Transparent Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-nyx-white tracking-tight mb-4">
            Pay for What You Use
          </h2>
          <p className="text-nyx-text text-lg max-w-2xl mx-auto">
            No hidden fees, no annual lock-in surprises. Every plan includes a
            14-day free trial with full module access.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 flex flex-col transition-all duration-300 ${
                plan.highlighted
                  ? "border-nyx-blue bg-nyx-card shadow-[0_0_60px_rgba(29,111,232,0.18)]"
                  : "border-nyx-border bg-nyx-card hover:border-nyx-blue/50"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-nyx-blue text-white text-xs font-bold tracking-wide whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <p className="text-nyx-muted text-sm font-semibold tracking-widest uppercase mb-1">
                  {plan.name}
                </p>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-nyx-white text-4xl font-extrabold">
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-nyx-muted text-sm pb-1">{plan.per}</span>
                  )}
                </div>
                {plan.price === "Custom" && (
                  <p className="text-nyx-muted text-sm">{plan.per}</p>
                )}
                <p className="text-nyx-text text-sm mt-2">{plan.description}</p>
              </div>

              {/* Module count badge */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-nyx-bg border border-nyx-border mb-6">
                <div className="w-2 h-2 rounded-full bg-nyx-blue-bright" />
                <span className="text-nyx-text text-sm font-medium">
                  {plan.moduleNote}
                </span>
              </div>

              {/* Features list */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      size={15}
                      className="text-nyx-blue-bright mt-0.5 flex-shrink-0"
                    />
                    <span className="text-nyx-text text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => open(plan.name)}
                className={`w-full py-3 rounded-xl text-sm font-semibold text-center transition-all duration-200 ${
                  plan.highlighted
                    ? "bg-nyx-blue hover:bg-nyx-blue-bright text-white shadow-blue-glow"
                    : "bg-nyx-bg border border-nyx-border hover:border-nyx-blue text-nyx-text hover:text-nyx-white"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-nyx-muted text-sm mt-8">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
}
