"use client";

import { useEffect, useState } from "react";
import { Heart, Shield, DollarSign, Activity, Users, CheckCircle, XCircle, Loader2 } from "lucide-react";

type Plan = { id: string; name: string; provider: string; type: string; description: string; enrollments: { id: string; employeeId: string }[] };
type Enrollment = { planId: string; employeeId: string; status: string };

const TYPE_META: Record<string, { icon: typeof Heart; color: string; bg: string; border: string }> = {
  health:     { icon: Heart,      color: "#f87171", bg: "rgba(239,68,68,0.1)",    border: "rgba(239,68,68,0.2)" },
  retirement: { icon: DollarSign, color: "#fbbf24", bg: "rgba(251,191,36,0.1)",   border: "rgba(251,191,36,0.2)" },
  insurance:  { icon: Shield,     color: "#818cf8", bg: "rgba(99,102,241,0.12)",  border: "rgba(99,102,241,0.2)" },
  wellness:   { icon: Activity,   color: "#4d8fff", bg: "rgba(37,112,245,0.12)",  border: "rgba(37,112,245,0.22)" },
};

export default function BenefitsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  async function load() {
    const r = await fetch("/api/benefits");
    const d = await r.json();
    setPlans(d.plans ?? []);
    setEnrollments(d.enrollments ?? []);
    setEmployeeCount(d.employeeCount ?? 0);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function enrollAll(planId: string) {
    setEnrolling(planId);
    const r = await fetch("/api/benefits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "enroll_all", planId }) });
    const d = await r.json();
    if (r.ok) { showToast(`Enrolled ${d.enrolled} employees`); await load(); }
    setEnrolling(null);
  }

  const activeCount = (planId: string) => enrollments.filter(e => e.planId === planId && e.status === "active").length;
  const glass = { background: "rgba(10,24,50,0.7)", border: "1px solid rgba(37,112,245,0.18)" };
  const totalEnrolled = new Set(enrollments.filter(e => e.status === "active").map(e => e.employeeId)).size;

  if (loading) return <div className="p-8 flex items-center justify-center min-h-[40vh]"><Loader2 size={22} className="animate-spin text-nyx-blue" /></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-xl" style={{ background: "rgba(52,211,153,0.9)", color: "#0a1832" }}>
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: "#eef5ff" }}>Benefits</h1>
          <p className="mt-1 text-sm" style={{ color: "#7a9fc0" }}>Employee benefit plans and enrollment.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { icon: Heart,    label: "Plans Available",  value: String(plans.length),    sub: "Active benefit plans" },
          { icon: Users,    label: "Eligible Employees", value: String(employeeCount), sub: "Active employees" },
          { icon: CheckCircle, label: "Enrolled Employees", value: String(totalEnrolled), sub: "Across all plans" },
          { icon: Shield,   label: "Plan Types",        value: String(new Set(plans.map(p => p.type)).size), sub: "Health, Retirement, Insurance, Wellness" },
        ].map(({ icon: Icon, label, value, sub }, i) => {
          const colors = [
            { bg: "rgba(37,112,245,0.15)", text: "#4d8fff", border: "rgba(37,112,245,0.25)" },
            { bg: "rgba(52,211,153,0.12)", text: "#34d399", border: "rgba(52,211,153,0.25)" },
            { bg: "rgba(99,102,241,0.18)", text: "#818cf8", border: "rgba(99,102,241,0.25)" },
            { bg: "rgba(251,191,36,0.12)", text: "#fbbf24", border: "rgba(251,191,36,0.25)" },
          ][i];
          return (
            <div key={label} className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7a9fc0" }}>{label}</span>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
                  <Icon size={15} style={{ color: colors.text }} />
                </div>
              </div>
              <p className="text-2xl font-bold font-heading" style={{ color: "#eef5ff" }}>{value}</p>
              {sub && <p className="text-xs mt-1" style={{ color: "#7a9fc0" }}>{sub}</p>}
            </div>
          );
        })}
      </div>

      {/* Plans Grid */}
      <h2 className="text-base font-semibold font-heading mb-4" style={{ color: "#eef5ff" }}>Available Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {plans.map(plan => {
          const meta = TYPE_META[plan.type] ?? TYPE_META.health;
          const Icon = meta.icon;
          const enrolled = activeCount(plan.id);
          const pct = employeeCount > 0 ? Math.round((enrolled / employeeCount) * 100) : 0;
          const busy = enrolling === plan.id;
          return (
            <div key={plan.id} className="rounded-2xl p-6" style={glass}>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: meta.bg, border: `1px solid ${meta.border}` }}>
                  <Icon size={18} style={{ color: meta.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold" style={{ color: "#eef5ff" }}>{plan.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize flex-shrink-0"
                      style={{ background: "rgba(37,112,245,0.1)", color: "#4d8fff" }}>{plan.type}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "#7a9fc0" }}>{plan.provider}</p>
                </div>
              </div>
              <p className="text-sm mb-4" style={{ color: "#b8cce8" }}>{plan.description}</p>

              {/* Enrollment bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-nyx-muted font-medium">Enrollment</span>
                  <span className="text-xs font-semibold" style={{ color: "#eef5ff" }}>{enrolled}/{employeeCount} ({pct}%)</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: meta.color }} />
                </div>
              </div>

              <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: "rgba(37,112,245,0.1)" }}>
                <span className="text-xs font-medium flex items-center gap-1" style={{ color: "#34d399" }}>
                  <CheckCircle size={12} /> Active
                </span>
                <button onClick={() => enrollAll(plan.id)} disabled={busy}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-60"
                  style={{ background: "rgba(37,112,245,0.2)", color: "#4d8fff", border: "1px solid rgba(37,112,245,0.3)" }}>
                  {busy ? <Loader2 size={11} className="animate-spin" /> : <Users size={11} />}
                  Enroll All
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}