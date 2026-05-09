"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "Operations", "HR", "Finance", "Legal", "Support", "Product", "Design"];

const FIELDS = [
  { id: "firstName", label: "First Name", type: "text", required: true, half: true },
  { id: "lastName",  label: "Last Name",  type: "text", required: true, half: true },
  { id: "email",     label: "Work Email", type: "email", required: true, half: true },
  { id: "phone",     label: "Phone",      type: "tel",  required: false, half: true },
  { id: "jobTitle",  label: "Job Title",  type: "text", required: false, half: true },
  { id: "startDate", label: "Start Date", type: "date", required: false, half: true },
] as const;

type FormData = {
  firstName: string; lastName: string; email: string; phone: string;
  jobTitle: string; startDate: string; department: string;
  status: string; employmentType: string; salary: string;
};

const init: FormData = {
  firstName: "", lastName: "", email: "", phone: "",
  jobTitle: "", startDate: "", department: "",
  status: "ACTIVE", employmentType: "FULL_TIME", salary: "",
};

export default function NewEmployeePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(init);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        salary: form.salary ? parseFloat(form.salary) : undefined,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to create employee.");
      setSaving(false);
      return;
    }
    router.push("/employees");
    router.refresh();
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl border text-nyx-text text-sm bg-transparent outline-none focus:border-nyx-blue transition-colors placeholder-nyx-muted";
  const inputStyle = { borderColor: "rgba(37,112,245,0.25)", background: "rgba(10,24,50,0.6)" };
  const labelClass = "block text-xs font-semibold text-nyx-muted uppercase tracking-wider mb-1.5";

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/employees" className="flex items-center gap-1.5 text-nyx-muted hover:text-nyx-white text-sm transition-colors">
          <ArrowLeft size={15} /> Back
        </Link>
        <div>
          <h1 className="text-nyx-white text-2xl font-extrabold tracking-tight">Add Employee</h1>
          <p className="text-nyx-muted text-sm mt-0.5">Fill in the details below to add a new team member.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}
        className="rounded-2xl border p-8 space-y-6"
        style={{ background: "rgba(10,24,50,0.7)", borderColor: "rgba(37,112,245,0.18)" }}>

        {error && (
          <div className="px-4 py-3 rounded-xl text-sm text-red-300"
            style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}>
            {error}
          </div>
        )}

        {/* Text fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FIELDS.map(({ id, label, type, required }) => (
            <div key={id}>
              <label className={labelClass}>{label}{required && " *"}</label>
              <input
                type={type}
                required={required}
                value={form[id as keyof FormData]}
                onChange={(e) => set(id as keyof FormData, e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </div>
          ))}
        </div>

        {/* Department */}
        <div>
          <label className={labelClass}>Department</label>
          <select
            value={form.department}
            onChange={(e) => set("department", e.target.value)}
            className={inputClass}
            style={inputStyle}
          >
            <option value="">— Select —</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Employment type */}
          <div>
            <label className={labelClass}>Employment Type</label>
            <select value={form.employmentType} onChange={(e) => set("employmentType", e.target.value)}
              className={inputClass} style={inputStyle}>
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="CONTRACTOR">Contractor</option>
              <option value="INTERN">Intern</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className={labelClass}>Status</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)}
              className={inputClass} style={inputStyle}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="TERMINATED">Terminated</option>
            </select>
          </div>
        </div>

        {/* Salary */}
        <div>
          <label className={labelClass}>Annual Salary (USD)</label>
          <input
            type="number"
            min="0"
            step="1000"
            placeholder="e.g. 75000"
            value={form.salary}
            onChange={(e) => set("salary", e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/employees"
            className="px-5 py-2.5 text-sm font-medium text-nyx-muted hover:text-nyx-white rounded-xl border transition-colors"
            style={{ borderColor: "rgba(37,112,245,0.2)" }}>
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-opacity"
            style={{ background: "linear-gradient(135deg,#2570f5,#4d8fff)", boxShadow: "0 0 20px rgba(37,112,245,0.35)" }}>
            <Save size={14} />
            {saving ? "Saving…" : "Save Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}
