"use client";

import { ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { useWaitlist } from "@/context/WaitlistContext";

/** Jewel-tone gradients cycled across the headcount bar chart */
const BAR_GRADIENTS = [
  "linear-gradient(to top, #1e5fe8, #4d8fff)", // sapphire
  "linear-gradient(to top, #6d28d9, #a855f7)", // amethyst
  "linear-gradient(to top, #047857, #10b981)", // emerald
] as const;

export default function Hero() {
  const { open } = useWaitlist();
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">
      {/* Jewel accent bar — top of hero */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] pointer-events-none z-20"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #1e5fe8 20%, #a855f7 45%, #c9a44a 65%, #10b981 82%, transparent 100%)",
        }}
      />

      {/* ── Background layers ── */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      <div className="absolute inset-0 bg-hero-violet pointer-events-none" />
      <div className="absolute inset-0 bg-hero-emerald pointer-events-none" />
      <div
        className="absolute inset-0 bg-grid-pattern pointer-events-none"
        style={{ backgroundSize: "48px 48px" }}
      />

      {/* Sapphire orb — center top */}
      <div
        className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full pointer-events-none animate-glow"
        style={{ background: "rgba(30,95,232,0.50)", filter: "blur(130px)" }}
      />
      {/* Amethyst orb — upper right */}
      <div
        className="absolute top-[-40px] right-[-100px] w-[650px] h-[650px] rounded-full pointer-events-none"
        style={{ background: "rgba(124,58,237,0.48)", filter: "blur(110px)" }}
      />
      {/* Bright sapphire core */}
      <div
        className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[340px] h-[240px] rounded-full pointer-events-none"
        style={{ background: "rgba(77,143,255,0.38)", filter: "blur(72px)" }}
      />
      {/* Emerald hint — lower left */}
      <div
        className="absolute bottom-[80px] left-[-80px] w-[400px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "rgba(4,120,87,0.22)", filter: "blur(100px)" }}
      />
      {/* Gold glint — lower right */}
      <div
        className="absolute bottom-[60px] right-[10%] w-[260px] h-[200px] rounded-full pointer-events-none"
        style={{ background: "rgba(201,164,74,0.16)", filter: "blur(90px)" }}
      />
      {/* Bottom fade into page */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#06070f] to-transparent pointer-events-none" />

      {/* ── Hero content ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Premium jewel badge */}
        <div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(14,12,32,0.95) 0%, rgba(20,14,44,0.97) 100%)",
            border: "1px solid rgba(168,85,247,0.45)",
            boxShadow:
              "0 0 28px rgba(124,58,237,0.22), inset 0 1px 0 rgba(255,255,255,0.07)",
            color: "#c4b5fd",
          }}
        >
          <Sparkles size={12} className="text-nyx-gold" />
          Built by NyxCollective LLC — Pure HR, Zero Bloat
          <span className="w-1.5 h-1.5 rounded-full bg-nyx-amethyst-bright animate-pulse" />
        </div>

        {/* ── Headline ── */}
        <h1 className="font-heading text-5xl md:text-7xl font-bold leading-[1.04] tracking-[-0.03em] mb-6">
          <span className="text-gradient">The HR Platform</span>
          <br />
          <span className="text-nyx-white">Built for What</span>
          <br />
          <span
            style={{
              background:
                "linear-gradient(135deg, #eef0ff 0%, #4d8fff 35%, #a855f7 70%, #c9a44a 100%)",
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

        {/* ── CTA buttons ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => open()}
            className="group relative flex items-center gap-2.5 px-8 py-4 rounded-full text-white font-semibold text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #1e5fe8 0%, #4d8fff 50%, #7c3aed 100%)",
              boxShadow:
                "0 4px 28px rgba(30,95,232,0.60), 0 0 60px rgba(124,58,237,0.20), inset 0 1px 0 rgba(255,255,255,0.18)",
            }}
          >
            {/* Inner shimmer */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  "linear-gradient(135deg, #4d8fff 0%, #a855f7 50%, #1e5fe8 100%)",
              }}
              aria-hidden="true"
            />
            <span className="relative z-10 flex items-center gap-2.5">
              Start Free Trial
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </span>
          </button>

          <a
            href="#modules"
            className="flex items-center gap-2.5 px-7 py-4 rounded-full glass-card shine-border border border-nyx-border hover:border-nyx-amethyst/50 text-nyx-text hover:text-nyx-white font-semibold text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5"
          >
            Explore Modules
          </a>
        </div>

        {/* ── Trust badges ── */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-nyx-muted text-xs tracking-wide">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-nyx-emerald-bright" />
            SOC 2 Type II Ready
          </div>
          <div className="w-px h-3 bg-nyx-border" />
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-nyx-gold" />
            Setup in under 30 minutes
          </div>
          <div className="w-px h-3 bg-nyx-border" />
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-nyx-blue-bright" />
            HIPAA &amp; GDPR Aligned
          </div>
        </div>
      </div>

      {/* ── Dashboard preview card ── */}
      <div className="relative z-10 mt-24 w-full max-w-5xl mx-auto px-6 pb-20">
        <div
          className="rounded-2xl overflow-hidden shine-border"
          style={{
            background:
              "linear-gradient(145deg, rgba(16,14,40,0.98) 0%, rgba(8,9,20,0.99) 100%)",
            border: "1px solid rgba(30,95,232,0.28)",
            boxShadow:
              "0 0 140px rgba(30,95,232,0.20), 0 0 80px rgba(124,58,237,0.12), 0 40px 80px rgba(0,0,0,0.65)",
          }}
        >
          {/* Browser bar */}
          <div className="flex items-center gap-2 px-5 py-3.5 bg-nyx-surface/80 border-b border-nyx-border">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <div className="flex-1 h-6 rounded-md bg-nyx-bg/80 border border-nyx-border ml-4 flex items-center px-3">
              <span className="text-nyx-muted text-xs font-heading tracking-wide">
                app.nyxethos.com/dashboard
              </span>
            </div>
          </div>

          {/* Stat cards */}
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Total Employees",
                value: "248",
                change: "+4 this month",
                accent: "rgba(30,95,232,0.35)",
              },
              {
                label: "On Leave Today",
                value: "12",
                change: "5% of workforce",
                accent: "rgba(124,58,237,0.30)",
              },
              {
                label: "Payroll Due",
                value: "3 days",
                change: "$192,400 est.",
                accent: "rgba(201,164,74,0.28)",
              },
              {
                label: "Open Onboardings",
                value: "7",
                change: "2 starting today",
                accent: "rgba(4,120,87,0.28)",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl shine-border border border-nyx-border p-4 hover:border-nyx-border-bright transition-colors duration-300"
                style={{
                  background: `linear-gradient(145deg, ${stat.accent} 0%, rgba(10,11,26,0.95) 100%)`,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-nyx-muted text-xs mb-1 tracking-wide">
                  {stat.label}
                </p>
                <p className="text-nyx-white text-2xl font-heading font-bold">
                  {stat.value}
                </p>
                <p className="text-nyx-blue-bright text-xs mt-1">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bar chart */}
            <div
              className="md:col-span-2 rounded-xl shine-border border border-nyx-border p-4"
              style={{
                background:
                  "linear-gradient(145deg, rgba(14,12,32,0.96) 0%, rgba(8,9,20,0.98) 100%)",
              }}
            >
              <p className="text-nyx-muted text-xs mb-3 tracking-wide">
                Headcount Over Time
              </p>
              <div className="flex items-end gap-1.5 h-16">
                {[55, 70, 60, 80, 75, 90, 85, 100, 95, 100, 105, 110].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t transition-all duration-300"
                      style={{
                        height: `${h}%`,
                        background: BAR_GRADIENTS[i % BAR_GRADIENTS.length],
                        opacity: 0.55 + (h / 110) * 0.45,
                      }}
                    />
                  )
                )}
              </div>
            </div>

            {/* Module usage */}
            <div
              className="rounded-xl shine-border border border-nyx-border p-4"
              style={{
                background:
                  "linear-gradient(145deg, rgba(14,12,32,0.96) 0%, rgba(8,9,20,0.98) 100%)",
              }}
            >
              <p className="text-nyx-muted text-xs mb-3 tracking-wide">
                Module Usage
              </p>
              <div className="space-y-2.5">
                {[
                  {
                    name: "Payroll",
                    pct: 92,
                    color: "linear-gradient(to right, #c9a44a, #f0d07a)",
                  },
                  {
                    name: "Time & Attendance",
                    pct: 78,
                    color: "linear-gradient(to right, #1e5fe8, #4d8fff)",
                  },
                  {
                    name: "Onboarding",
                    pct: 65,
                    color: "linear-gradient(to right, #7c3aed, #a855f7)",
                  },
                ].map((m) => (
                  <div key={m.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-nyx-text">{m.name}</span>
                      <span className="text-nyx-muted">{m.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-nyx-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${m.pct}%`, background: m.color }}
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

