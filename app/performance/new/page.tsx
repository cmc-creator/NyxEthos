"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, ArrowLeft } from "lucide-react";

type Employee = { id: string; firstName: string; lastName: string; jobTitle: string | null };

export default function NewReviewPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    employeeId: "",
    period: "",
    reviewDate: new Date().toISOString().split("T")[0],
    score: "",
    status: "scheduled",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/employees")
      .then((r) => r.json())
      .then((d) => setEmployees(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.employeeId || !form.period) {
      setError("Employee and review period are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          score: form.score ? parseFloat(form.score) : null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create review.");
      } else {
        router.push("/performance");
        router.refresh();
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    background: "rgba(6,14,30,0.8)",
    border: "1px solid rgba(37,112,245,0.22)",
    color: "#eef5ff",
    borderRadius: "0.75rem",
    padding: "0.6rem 0.875rem",
    fontSize: "0.875rem",
    width: "100%",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    color: "#7a9fc0",
    marginBottom: "0.4rem",
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/performance" className="inline-flex items-center gap-2 text-sm mb-4 opacity-60 hover:opacity-100 transition-opacity" style={{ color: "#4d8fff" }}>
          <ArrowLeft size={13} /> Back to Performance
        </Link>
        <h1 className="text-2xl font-bold font-heading" style={{ color: "#eef5ff" }}>Schedule Review</h1>
        <p className="mt-1 text-sm" style={{ color: "#7a9fc0" }}>Schedule a performance review for an employee.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5">
        <div>
          <label style={labelStyle}>Employee *</label>
          <select value={form.employeeId} onChange={(e) => setForm((f) => ({ ...f, employeeId: e.target.value }))} style={inputStyle} required>
            <option value="">Select employee…</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}{emp.jobTitle ? ` — ${emp.jobTitle}` : ""}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Review Period *</label>
            <input type="text" placeholder="e.g. Q4 2025" value={form.period} onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))} style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Review Date *</label>
            <input type="date" value={form.reviewDate} onChange={(e) => setForm((f) => ({ ...f, reviewDate: e.target.value }))} style={inputStyle} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Score (1–5)</label>
            <input type="number" min="1" max="5" step="0.1" placeholder="e.g. 4.2" value={form.score} onChange={(e) => setForm((f) => ({ ...f, score: e.target.value }))} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} style={inputStyle}>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Notes</label>
          <textarea placeholder="Review notes or goals…" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
        </div>

        {error && <p className="text-sm px-4 py-3 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>{error}</p>}

        <div className="flex gap-3 pt-2">
          <Link href="/performance" className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity" style={{ border: "1px solid rgba(37,112,245,0.2)", color: "#7a9fc0" }}>Cancel</Link>
          <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50" style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}>
            <Star size={14} /> {loading ? "Saving…" : "Schedule Review"}
          </button>
        </div>
      </form>
    </div>
  );
}
