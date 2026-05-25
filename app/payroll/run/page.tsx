"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DollarSign, ArrowLeft, Play } from "lucide-react";

export default function RunPayrollPage() {
  const router = useRouter();
  const now = new Date();
  const defaultPeriod = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

  const [form, setForm] = useState({ period: defaultPeriod, startDate: defaultStart, endDate: defaultEnd, notes: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to run payroll."); return; }
      router.push("/payroll?ran=1");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/40 transition-all";
  const inputStyle = {
    background: "rgba(37,112,245,0.06)",
    border: "1px solid rgba(37,112,245,0.18)",
    color: "#eef5ff",
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <div className="mb-8">
        <Link href="/payroll" className="inline-flex items-center gap-1.5 text-xs mb-5 hover:opacity-80 transition-opacity" style={{ color: "#7a9fc0" }}>
          <ArrowLeft size={12} /> Back to Payroll
        </Link>
        <h1 className="text-2xl font-bold font-heading" style={{ color: "#eef5ff" }}>Run Payroll</h1>
        <p className="mt-1 text-sm" style={{ color: "#7a9fc0" }}>
          Process payroll for all active employees with salary data. Pay stubs are auto-generated.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6">
        {/* Info box */}
        <div className="rounded-xl p-4 mb-6" style={{ background: "rgba(37,112,245,0.07)", border: "1px solid rgba(37,112,245,0.15)" }}>
          <div className="flex items-start gap-2">
            <DollarSign size={14} style={{ color: "#4d8fff", marginTop: 2 }} />
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: "#4d8fff" }}>Auto-calculated deductions</p>
              <p className="text-xs" style={{ color: "#7a9fc0" }}>
                Federal (22%) · State (5%) · Social Security (6.2%) · Medicare (1.45%)
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: "#7a9fc0" }}>
              Period
            </label>
            <input
              className={inputClass}
              style={inputStyle}
              value={form.period}
              onChange={(e) => set("period", e.target.value)}
              placeholder="e.g. June 2026"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: "#7a9fc0" }}>
                Start Date
              </label>
              <input
                type="date"
                className={inputClass}
                style={{ ...inputStyle, colorScheme: "dark" }}
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: "#7a9fc0" }}>
                End Date
              </label>
              <input
                type="date"
                className={inputClass}
                style={{ ...inputStyle, colorScheme: "dark" }}
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: "#7a9fc0" }}>
              Notes (optional)
            </label>
            <textarea
              className={inputClass}
              style={{ ...inputStyle, resize: "none" }}
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Any notes for this payroll run..."
            />
          </div>

          {error && (
            <p className="text-sm px-4 py-3 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
          >
            <Play size={14} />
            {loading ? "Processing payroll..." : "Process Payroll"}
          </button>
        </form>
      </div>
    </div>
  );
}
