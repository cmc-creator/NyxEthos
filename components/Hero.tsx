"use client";

import { ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { useWaitlist } from "@/context/WaitlistContext";

export default function Hero() {
  const { open } = useWaitlist();
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      <div className="absolute inset-0 bg-hero-violet pointer-events-none" />
      <div
        className="absolute inset-0 bg-grid-pattern pointer-events-none"
        style={{ backgroundSize: "48px 48px" }}
      />
      {/* Large blue orb — center top */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "rgba(37,112,245,0.22)", filter: "blur(100px)" }}
      />
      {/* Violet orb — upper right */}
      <div className="absolute top-[-60px] right-[-80px] w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: "rgba(99,102,241,0.18)", filter: "blur(90px)" }}
      />
      {/* Small bright core orb */}
      <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[300px] h-[200px] rounded-full pointer-events-none"
        style={{ background: "rgba(77,143,255,0.15)", filter: "blur(60px)" }}
      />
      {/* Warm bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-nyx-bg to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Premium badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card shine-border border border-nyx-border text-nyx-blue-bright text-xs font-semibold tracking-widest uppercase mb-10">
          <Sparkles size={12} className="text-nyx-gold" />
          Built by NyxCollective LLC — Pure HR, Zero Bloat
          <span className="w-1.5 h-1.5 rounded-full bg-nyx-blue-bright animate-pulse" />
        </div>

        {/* Headline */}
        <h1 className="font-heading text-5xl md:text-7xl font-bold leading-[1.04] tracking-[-0.03em] mb-6">
          <span className="text-gradient">The HR Platform</span>
          <br />
          <span className="text-nyx-white">Built for What</span>
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #eef5ff 0%, #4d8fff 45%, #6366f1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Actually Matters
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-nyx-text text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light">
          NyxEthos delivers every HR tool your team needs — onboarding, payroll,
          compliance, and more — as modular building blocks. Activate only what
          you use. No bloat, no forced bundles.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => open()}
            className="group flex items-center gap-2.5 px-7 py-4 bg-gradient-to-r from-nyx-blue to-nyx-blue-bright hover:from-nyx-blue-bright hover:to-nyx-blue rounded-full text-white font-semibold text-sm tracking-wide transition-all duration-300 shadow-btn-primary hover:shadow-btn-primary-hover hover:-translate-y-0.5"
          >
            Start Free Trial
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </button>
          <a
            href="#modules"
            className="flex items-center gap-2.5 px-7 py-4 rounded-full glass-card shine-border border border-nyx-border hover:border-nyx-border-bright text-nyx-text hover:text-nyx-white font-semibold text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5"
          >
            Explore Modules
          </a>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-nyx-muted text-xs tracking-wide">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-nyx-blue" />
            SOC 2 Type II Ready
          </div>
          <div className="w-px h-3 bg-nyx-border" />
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-nyx-blue" />
            Setup in under 30 minutes
          </div>
          <div className="w-px h-3 bg-nyx-border" />
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-nyx-blue" />
            HIPAA &amp; GDPR Aligned
          </div>
        </div>
      </div>

      {/* Dashboard preview card */}
      <div className="relative z-10 mt-24 w-full max-w-5xl mx-auto px-6 pb-20">
        <div
          className="rounded-2xl overflow-hidden shine-border"
          style={{
            background: "linear-gradient(145deg, rgba(14,30,58,0.97) 0%, rgba(9,20,40,0.99) 100%)",
            border: "1px solid rgba(37,112,245,0.28)",
            boxShadow: "0 0 120px rgba(37,112,245,0.22), 0 40px 80px rgba(0,0,0,0.6)",
          }}
        >
          {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-5 py-3.5 bg-nyx-surface/80 border-b border-nyx-border">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <div className="flex-1 h-6 rounded-md bg-nyx-bg/80 border border-nyx-border ml-4 flex items-center px-3">
              <span className="text-nyx-muted text-xs font-heading tracking-wide">app.nyxethos.com/dashboard</span>
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
              <div key={stat.label} className="rounded-xl glass-card shine-border border border-nyx-border p-4 hover:border-nyx-border-bright transition-colors duration-300">
                <p className="text-nyx-muted text-xs mb-1 tracking-wide">{stat.label}</p>
                <p className="text-nyx-white text-2xl font-heading font-bold">{stat.value}</p>
                <p className="text-nyx-blue-bright text-xs mt-1">{stat.change}</p>
              </div>
            ))}
          </div>
          <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mini chart bar placeholder */}
            <div className="md:col-span-2 rounded-xl glass-card shine-border border border-nyx-border p-4">
              <p className="text-nyx-muted text-xs mb-3 tracking-wide">Headcount Over Time</p>
              <div className="flex items-end gap-1.5 h-16">
                {[55, 70, 60, 80, 75, 90, 85, 100, 95, 100, 105, 110].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t transition-all duration-300"
                    style={{
                      height: `${h}%`,
                      background: `linear-gradient(to top, #2570f5, #4d8fff)`,
                      opacity: 0.6 + (h / 110) * 0.4,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-xl glass-card shine-border border border-nyx-border p-4">
              <p className="text-nyx-muted text-xs mb-3 tracking-wide">Module Usage</p>
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
                    <div className="h-1 bg-nyx-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${m.pct}%`, background: "linear-gradient(to right, #2570f5, #4d8fff)" }}
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
