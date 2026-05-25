"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string | null;
  department: string | null;
}

const c1 = "#eef5ff";
const c3 = "#7a9fc0";

const inputStyle = {
  background: "rgba(37,112,245,0.06)",
  border: "1px solid rgba(37,112,245,0.18)",
  color: c1,
};
const inputClass =
  "w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/40 transition-all";

const TEMPLATES = [
  "Standard Onboarding",
  "Engineering Track",
  "Sales Track",
  "Remote Employee Onboarding",
  "Executive Onboarding",
  "Contractor Onboarding",
];

export default function NewOnboardingPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [templateName, setTemplateName] = useState(TEMPLATES[0]);
  const [customTemplate, setCustomTemplate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/employees")
      .then((r) => r.json())
      .then((d) => setEmployees(d.employees ?? d ?? []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) {
      setError("Please select an employee.");
      return;
    }
    const finalTemplate = templateName === "Custom" ? customTemplate : templateName;
    if (!finalTemplate.trim()) {
      setError("Please enter a template name.");
      return;
    }
    setSaving(true);
    setError("");
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId, templateName: finalTemplate }),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/onboarding");
      router.refresh();
    } else {
      const d = await res.json();
      setError(d.error ?? "Failed to create plan.");
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/onboarding"
          className="flex items-center gap-1.5 text-xs hover:opacity-80 transition-opacity"
          style={{ color: c3 }}
        >
          <ArrowLeft size={12} />
          Back to Onboarding
        </Link>
      </div>

      <h1 className="text-2xl font-bold font-heading mb-6" style={{ color: c1 }}>
        New Onboarding Plan
      </h1>

      <div className="glass-card rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Employee select */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
              style={{ color: c3 }}
            >
              Employee
            </label>
            <select
              className={inputClass}
              style={inputStyle}
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            >
              <option value="">Select employee…</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                  {emp.jobTitle ? ` — ${emp.jobTitle}` : ""}
                  {emp.department ? ` (${emp.department})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Template */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
              style={{ color: c3 }}
            >
              Template
            </label>
            <select
              className={inputClass}
              style={inputStyle}
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            >
              {TEMPLATES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
              <option value="Custom">Custom…</option>
            </select>
          </div>

          {templateName === "Custom" && (
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                style={{ color: c3 }}
              >
                Custom Template Name
              </label>
              <input
                className={inputClass}
                style={inputStyle}
                placeholder="e.g. Intern Onboarding"
                value={customTemplate}
                onChange={(e) => setCustomTemplate(e.target.value)}
                required
              />
            </div>
          )}

          {error && (
            <p className="text-xs" style={{ color: "#f87171" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
          >
            <Save size={13} />
            {saving ? "Creating…" : "Create Plan"}
          </button>
        </form>
      </div>

      <div
        className="mt-5 rounded-xl px-4 py-3 text-xs"
        style={{
          background: "rgba(37,112,245,0.06)",
          border: "1px solid rgba(37,112,245,0.12)",
          color: c3,
        }}
      >
        A default set of 11 onboarding tasks (HR paperwork, IT setup, training,
        milestones) will be automatically created for the selected template.
      </div>
    </div>
  );
}
