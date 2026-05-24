"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, ArrowLeft } from "lucide-react";

type Employee = { id: string; firstName: string; lastName: string; jobTitle: string | null };

export default function NewTimeEntryPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    hours: "",
    type: "regular",
    note: "",
  });

  useEffect(() => {
    fetch("/api/employees")
      .then((r) => r.json())
      .then((data) => setEmployees(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.employeeId || !form.hours) {
      setError("Employee and hours are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          hours: parseFloat(form.hours),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to log time.");
      } else {
        router.push("/time");
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
        <Link
          href="/time"
          className="inline-flex items-center gap-2 text-sm mb-4 transition-opacity hover:opacity-100 opacity-60"
          style={{ color: "#4d8fff" }}
        >
          <ArrowLeft size={13} /> Back to Time &amp; Attendance
        </Link>
        <h1 className="text-2xl font-bold font-heading" style={{ color: "#eef5ff" }}>
          Log Time Entry
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#7a9fc0" }}>
          Record hours worked for an employee.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5">
        <div>
          <label style={labelStyle}>Employee *</label>
          <select
            value={form.employeeId}
            onChange={(e) => setForm((f) => ({ ...f, employeeId: e.target.value }))}
            style={inputStyle}
            required
          >
            <option value="">Select employee…</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
                {emp.jobTitle ? ` — ${emp.jobTitle}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Date *</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Hours *</label>
            <input
              type="number"
              min="0.5"
              max="24"
              step="0.5"
              placeholder="8.0"
              value={form.hours}
              onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))}
              style={inputStyle}
              required
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            style={inputStyle}
          >
            <option value="regular">Regular</option>
            <option value="overtime">Overtime</option>
            <option value="pto">PTO</option>
            <option value="sick">Sick</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Note</label>
          <input
            type="text"
            placeholder="Optional note…"
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            style={inputStyle}
          />
        </div>

        {error && (
          <p className="text-sm px-4 py-3 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Link
            href="/time"
            className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ border: "1px solid rgba(37,112,245,0.2)", color: "#7a9fc0" }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
          >
            <Clock size={14} />
            {loading ? "Saving…" : "Log Time"}
          </button>
        </div>
      </form>
    </div>
  );
}
