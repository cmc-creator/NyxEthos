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
    <section id="pricing" className="py-24 px-6 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 bg-hero-gradient opacity-35 pointer-events-none" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "rgba(124,58,237,0.12)", filter: "blur(130px)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "rgba(30,95,232,0.10)", filter: "blur(100px)" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
            style={{
              background:
                "linear-gradient(135deg, rgba(10,9,22,0.95), rgba(18,12,38,0.97))",
              border: "1px solid rgba(201,164,74,0.38)",
              boxShadow: "0 0 20px rgba(201,164,74,0.14)",
              color: "#f0d07a",
            }}
          >
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
              className="relative rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1.5"
              style={
                plan.highlighted
                  ? {
                      background:
                        "linear-gradient(145deg, rgba(22,14,56,0.99) 0%, rgba(10,8,30,0.99) 100%)",
                      border: "2px solid rgba(168,85,247,0.65)",
                      boxShadow:
                        "0 0 0 1px rgba(168,85,247,0.20), 0 0 120px rgba(124,58,237,0.30), 0 0 60px rgba(30,95,232,0.18), 0 20px 60px rgba(0,0,0,0.50)",
                    }
                  : {
                      background:
                        "linear-gradient(145deg, rgba(14,13,28,0.97) 0%, rgba(8,9,20,0.99) 100%)",
                      border: "1px solid rgba(30,95,232,0.25)",
                      boxShadow: "0 8px 40px rgba(0,0,0,0.40)",
                    }
              }
            >
              {/* Shine overlay for highlighted */}
              {plan.highlighted && (
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(168,85,247,0.08) 0%, transparent 50%, rgba(30,95,232,0.06) 100%)",
                  }}
                />
              )}

              {plan.highlighted && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase whitespace-nowrap"
                  style={{
                    background:
                      "linear-gradient(135deg, #c9a44a 0%, #f0d07a 50%, #c9a44a 100%)",
                    color: "#06070f",
                    boxShadow:
                      "0 0 40px rgba(201,164,74,0.65), 0 4px 16px rgba(0,0,0,0.40)",
                  }}
                >
                  Most Popular
                </div>
              )}

              <div className="mb-6 relative z-10">
                <p className="font-heading text-nyx-muted text-xs font-semibold tracking-widest uppercase mb-3">
                  {plan.name}
                </p>
                <div className="flex items-end gap-2 mb-1">
                  <span
                    className="font-heading text-4xl font-bold tracking-tight"
                    style={
                      plan.highlighted
                        ? {
                            background:
                              "linear-gradient(135deg, #eef0ff 0%, #a855f7 60%, #4d8fff 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }
                        : { color: "#eef0ff" }
                    }
                  >
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-nyx-muted text-sm pb-1">{plan.per}</span>
                  )}
                </div>
                {plan.price === "Custom" && (
                  <p className="text-nyx-muted text-sm">{plan.per}</p>
                )}
                <p className="text-nyx-text text-sm mt-2 font-light">
                  {plan.description}
                </p>
              </div>

              {/* Module count badge */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl border mb-6 relative z-10"
                style={{
                  background: "rgba(6,7,15,0.70)",
                  borderColor: plan.highlighted
                    ? "rgba(168,85,247,0.35)"
                    : "rgba(30,95,232,0.22)",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: plan.highlighted ? "#a855f7" : "#4d8fff",
                    boxShadow: plan.highlighted
                      ? "0 0 8px rgba(168,85,247,0.80)"
                      : "0 0 8px rgba(77,143,255,0.80)",
                  }}
                />
                <span className="text-nyx-text text-sm font-medium font-heading">
                  {plan.moduleNote}
                </span>
              </div>

              {/* Features list */}
              <ul className="space-y-3 mb-8 flex-1 relative z-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      size={14}
                      className="mt-0.5 flex-shrink-0"
                      style={{
                        color: plan.highlighted ? "#a855f7" : "#4d8fff",
                      }}
                    />
                    <span className="text-nyx-text text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => open(plan.name)}
                className="relative z-10 w-full py-3.5 rounded-full text-sm font-semibold text-center transition-all duration-300 tracking-wide hover:-translate-y-0.5"
                style={
                  plan.highlighted
                    ? {
                        background:
                          "linear-gradient(135deg, #1e5fe8 0%, #7c3aed 60%, #a855f7 100%)",
                        color: "#fff",
                        boxShadow:
                          "0 4px 28px rgba(124,58,237,0.55), inset 0 1px 0 rgba(255,255,255,0.18)",
                      }
                    : {
                        background: "rgba(6,7,15,0.70)",
                        border: "1px solid rgba(30,95,232,0.28)",
                        color: "#b0b5e0",
                      }
                }
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

