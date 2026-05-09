"use client";

import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { useWaitlist } from "@/context/WaitlistContext";

export default function Hero() {
  const { open } = useWaitlist();
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      <div
        className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-100"
        style={{ backgroundSize: "40px 40px" }}
      />
      {/* Blue orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-nyx-blue opacity-[0.06] blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-nyx-border bg-nyx-surface text-nyx-blue-bright text-xs font-semibold tracking-wide mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-nyx-blue-bright animate-pulse" />
          Built by NyxCollective LLC — Pure HR, Zero Bloat
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
          <span className="text-gradient">The HR Platform</span>
          <br />
          <span className="text-nyx-white">Built for What</span>
          <br />
          <span className="text-gradient">Actually Matters</span>
        </h1>

        {/* Subheadline */}
        <p className="text-nyx-text text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          NyxEthos delivers every HR tool your team needs — onboarding, payroll,
          compliance, and more — as modular building blocks. Activate only what
          you use. No bloat, no forced bundles.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => open()}
            className="group flex items-center gap-2 px-6 py-3.5 bg-nyx-blue hover:bg-nyx-blue-bright rounded-xl text-white font-semibold text-base transition-all duration-200 shadow-blue-glow hover:shadow-[0_0_40px_rgba(59,139,255,0.35)]"
          >
            Start Free Trial
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
          <a
            href="#modules"
            className="flex items-center gap-2 px-6 py-3.5 border border-nyx-border bg-nyx-surface hover:border-nyx-blue rounded-xl text-nyx-text hover:text-nyx-white font-semibold text-base transition-all duration-200"
          >
            Explore Modules
          </a>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-nyx-muted text-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-nyx-blue" />
            SOC 2 Type II Ready
          </div>
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-nyx-blue" />
            Set up in under 30 minutes
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-nyx-blue" />
            HIPAA &amp; GDPR Aligned
          </div>
        </div>
      </div>

      {/* Dashboard preview card */}
      <div className="relative z-10 mt-20 w-full max-w-5xl mx-auto px-6 pb-20">
        <div className="rounded-2xl border border-nyx-border bg-nyx-card overflow-hidden shadow-[0_0_80px_rgba(29,111,232,0.12)]">
          {/* Fake browser bar */}
          <div className="flex items-center gap-2 px-5 py-3.5 bg-nyx-surface border-b border-nyx-border">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <div className="flex-1 h-6 rounded-md bg-nyx-bg border border-nyx-border ml-4 flex items-center px-3">
              <span className="text-nyx-muted text-xs">app.nyxethos.com/dashboard</span>
            </div>
          </div>
          {/* Dashboard mockup */}
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Employees", value: "248", change: "+4 this month" },
              { label: "On Leave Today", value: "12", change: "5% of workforce" },
              { label: "Payroll Due", value: "3 days", change: "$192,400 est." },
              { label: "Open Onboardings", value: "7", change: "2 starting today" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-nyx-bg border border-nyx-border p-4">
                <p className="text-nyx-muted text-xs mb-1">{stat.label}</p>
                <p className="text-nyx-white text-2xl font-bold">{stat.value}</p>
                <p className="text-nyx-blue-bright text-xs mt-1">{stat.change}</p>
              </div>
            ))}
          </div>
          <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mini chart bar placeholder */}
            <div className="md:col-span-2 rounded-xl bg-nyx-bg border border-nyx-border p-4">
              <p className="text-nyx-muted text-xs mb-3">Headcount Over Time</p>
              <div className="flex items-end gap-1.5 h-16">
                {[55, 70, 60, 80, 75, 90, 85, 100, 95, 100, 105, 110].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-nyx-blue opacity-70"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-nyx-bg border border-nyx-border p-4">
              <p className="text-nyx-muted text-xs mb-3">Module Usage</p>
              <div className="space-y-2.5">
                {[
                  { name: "Payroll", pct: 92 },
                  { name: "Time & Attendance", pct: 78 },
                  { name: "Onboarding", pct: 65 },
                ].map((m) => (
                  <div key={m.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-nyx-text">{m.name}</span>
                      <span className="text-nyx-muted">{m.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-nyx-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-nyx-blue rounded-full"
                        style={{ width: `${m.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
