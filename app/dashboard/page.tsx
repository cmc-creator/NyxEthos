"use client";

import { useState } from "react";
import {
  UserPlus, DollarSign, Clock, Heart,
  Star, FileCheck, FolderOpen, CalendarDays,
  Check, ChevronRight, LayoutDashboard,
} from "lucide-react";
import Logo from "@/components/Logo";

const ALL_MODULES = [
  { id: "onboarding", icon: UserPlus, title: "Employee Onboarding", desc: "Automate day-one tasks, e-signatures, and role tracks." },
  { id: "payroll", icon: DollarSign, title: "Payroll", desc: "Multi-state payroll, direct deposit, and tax filings." },
  { id: "time", icon: Clock, title: "Time & Attendance", desc: "Web/mobile clock-in, overtime alerts, payroll sync." },
  { id: "benefits", icon: Heart, title: "Benefits Management", desc: "Self-enrollment, open enrollment, carrier integrations." },
  { id: "performance", icon: Star, title: "Performance Reviews", desc: "360° reviews, goal tracking, custom templates." },
  { id: "compliance", icon: FileCheck, title: "Compliance & Reporting", desc: "EEOC, ACA, real-time policy alerts." },
  { id: "documents", icon: FolderOpen, title: "Document Management", desc: "Version control, access permissions, expiry reminders." },
  { id: "pto", icon: CalendarDays, title: "PTO & Leave Tracking", desc: "Custom policies, FMLA, team calendar." },
];

type Step = "welcome" | "modules" | "done";

export default function DashboardPage() {
  const [step, setStep] = useState<Step>("welcome");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-nyx-bg flex flex-col">
      {/* Top bar */}
      <header className="h-14 border-b border-nyx-border bg-nyx-surface flex items-center px-6 gap-4">
        <a href="/" className="mr-auto">
          <Logo size="sm" />
        </a>
        <span className="text-nyx-muted text-xs">Setup Wizard</span>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        {step === "welcome" && (
          <div className="max-w-lg w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-nyx-blue mx-auto flex items-center justify-center mb-6 shadow-blue-glow">
              <LayoutDashboard size={28} className="text-white" />
            </div>
            <h1 className="text-nyx-white text-3xl font-extrabold tracking-tight mb-3">
              Welcome to NyxEthos
            </h1>
            <p className="text-nyx-text text-base mb-8">
              Let&apos;s get your workspace set up. First, choose the HR modules
              your team actually needs. You can add or remove them any time.
            </p>
            <button
              onClick={() => setStep("modules")}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-nyx-blue hover:bg-nyx-blue-bright text-white font-semibold rounded-xl transition-colors shadow-blue-glow"
            >
              Choose Your Modules
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {step === "modules" && (
          <div className="max-w-3xl w-full">
            <div className="text-center mb-10">
              <h2 className="text-nyx-white text-2xl font-extrabold tracking-tight mb-2">
                Select Your Modules
              </h2>
              <p className="text-nyx-text text-sm">
                Pick the tools you need now. Add more later from Settings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {ALL_MODULES.map((mod) => {
                const Icon = mod.icon;
                const active = selected.has(mod.id);
                return (
                  <button
                    key={mod.id}
                    onClick={() => toggle(mod.id)}
                    className={`relative text-left rounded-2xl border p-5 transition-all duration-200 ${
                      active
                        ? "border-nyx-blue bg-nyx-card shadow-card-hover"
                        : "border-nyx-border bg-nyx-card hover:border-nyx-blue/50"
                    }`}
                  >
                    {active && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-nyx-blue flex items-center justify-center">
                        <Check size={11} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${active ? "border-nyx-blue bg-nyx-bg" : "border-nyx-border bg-nyx-bg"}`}>
                        <Icon size={18} className={active ? "text-nyx-blue-bright" : "text-nyx-muted"} />
                      </div>
                      <span className={`font-semibold text-sm ${active ? "text-nyx-white" : "text-nyx-text"}`}>
                        {mod.title}
                      </span>
                    </div>
                    <p className="text-nyx-muted text-xs leading-relaxed">{mod.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-nyx-muted text-sm">
                {selected.size} module{selected.size !== 1 ? "s" : ""} selected
              </span>
              <button
                onClick={() => selected.size > 0 && setStep("done")}
                disabled={selected.size === 0}
                className="flex items-center gap-2 px-6 py-3 bg-nyx-blue hover:bg-nyx-blue-bright disabled:opacity-40 text-white font-semibold text-sm rounded-xl transition-colors shadow-blue-glow"
              >
                Confirm &amp; Continue
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="max-w-lg w-full text-center">
            <div className="w-16 h-16 rounded-full bg-nyx-blue/20 border border-nyx-blue mx-auto flex items-center justify-center mb-6">
              <Check size={32} className="text-nyx-blue-bright" />
            </div>
            <h2 className="text-nyx-white text-3xl font-extrabold tracking-tight mb-3">
              You&apos;re all set!
            </h2>
            <p className="text-nyx-text text-base mb-3">
              Your workspace is being configured with{" "}
              <span className="text-nyx-white font-semibold">{selected.size} module{selected.size !== 1 ? "s" : ""}</span>:
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {ALL_MODULES.filter((m) => selected.has(m.id)).map((m) => (
                <span key={m.id} className="px-3 py-1 rounded-full bg-nyx-card border border-nyx-border text-nyx-text text-xs">
                  {m.title}
                </span>
              ))}
            </div>
            <p className="text-nyx-muted text-sm mb-8">
              This is a preview. Full functionality is coming soon — we&apos;ll
              email you at <span className="text-nyx-text">info@nyxethos.com</span> when
              your account is ready.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setStep("modules"); }}
                className="px-5 py-2.5 border border-nyx-border bg-nyx-card hover:border-nyx-blue text-nyx-text hover:text-nyx-white text-sm font-medium rounded-xl transition-colors"
              >
                Back
              </button>
              <a
                href="/"
                className="px-5 py-2.5 bg-nyx-blue hover:bg-nyx-blue-bright text-white text-sm font-semibold rounded-xl transition-colors shadow-blue-glow"
              >
                Back to Home
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
