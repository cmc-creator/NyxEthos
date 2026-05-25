"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "Operations", "HR", "Finance", "Legal", "Support", "Product", "Design"];

type FormData = {
  firstName: string; lastName: string; email: string; phone: string;
  jobTitle: string; startDate: string; department: string;
  status: string; employmentType: string; salary: string; managerId: string;
};

export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams() as { id: string };
  const id = params.id;

  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [managers, setManagers] = useState<{ id: string; firstName: string; lastName: string }[]>([]);

  useEffect(() => {
    fetch("/api/employees")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setManagers(data))
      .catch(() => null);
  }, []);

  useEffect(() => {
    fetch(`/api/employees/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          jobTitle: data.jobTitle ?? "",
          startDate: data.startDate ? data.startDate.slice(0, 10) : "",
          department: data.department ?? "",
          status: data.status ?? "ACTIVE",
          employmentType: data.employmentType ?? "FULL_TIME",
          salary: data.salary != null ? String(data.salary) : "",
          managerId: data.managerId ?? "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  function set(field: keyof FormData, value: string) {
    setForm((prev) => prev ? { ...prev, [field]: value } : prev);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setError(""); setSaving(true); setSaved(false);
    const res = await fetch(`/api/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        salary: form.salary ? parseFloat(form.salary) : null,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to save.");
    } else {
      setSaved(true);
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm("Permanently delete this employee?")) return;
    setDeleting(true);
    await fetch(`/api/employees/${id}`, { method: "DELETE" });
    router.push("/employees");
    router.refresh();
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl border text-nyx-text text-sm bg-transparent outline-none focus:border-nyx-blue transition-colors placeholder-nyx-muted";
  const inputStyle = { borderColor: "rgba(37,112,245,0.25)", background: "rgba(10,24,50,0.6)" };
  const labelClass = "block text-xs font-semibold text-nyx-muted uppercase tracking-wider mb-1.5";

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[40vh]">
        <p className="text-nyx-muted text-sm">Loading…</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="p-8">
        <p className="text-nyx-muted text-sm">Employee not found.</p>
        <Link href="/employees" className="text-nyx-blue-bright text-sm hover:underline mt-2 inline-block">← Back to Employees</Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/employees" className="flex items-center gap-1.5 text-nyx-muted hover:text-nyx-white text-sm transition-colors">
          <ArrowLeft size={15} /> Back
        </Link>
        <div className="flex-1">
          <h1 className="text-nyx-white text-2xl font-extrabold tracking-tight">
            {form.firstName} {form.lastName}
          </h1>
          <p className="text-nyx-muted text-sm mt-0.5">Edit employee details</p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 transition-colors disabled:opacity-40">
          <Trash2 size={14} />
          {deleting ? "Deleting…" : "Delete"}
        </button>
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
        {saved && (
          <div className="px-4 py-3 rounded-xl text-sm text-green-300"
            style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)" }}>
            Changes saved.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(["firstName", "lastName"] as const).map((f) => (
            <div key={f}>
              <label className={labelClass}>{f === "firstName" ? "First Name *" : "Last Name *"}</label>
              <input required type="text" value={form[f]} onChange={(e) => set(f, e.target.value)} className={inputClass} style={inputStyle} />
            </div>
          ))}
          <div>
            <label className={labelClass}>Work Email *</label>
            <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className={labelClass}>Job Title</label>
            <input type="text" value={form.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className={labelClass}>Start Date</label>
            <input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className={inputClass} style={inputStyle} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Department</label>
          <select value={form.department} onChange={(e) => set("department", e.target.value)} className={inputClass} style={inputStyle}>
            <option value="">— Select —</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Employment Type</label>
            <select value={form.employmentType} onChange={(e) => set("employmentType", e.target.value)} className={inputClass} style={inputStyle}>
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="CONTRACTOR">Contractor</option>
              <option value="INTERN">Intern</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputClass} style={inputStyle}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="TERMINATED">Terminated</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Annual Salary (USD)</label>
          <input type="number" min="0" step="1000" placeholder="e.g. 75000"
            value={form.salary} onChange={(e) => set("salary", e.target.value)}
            className={inputClass} style={inputStyle} />
        </div>

        <div>
          <label className={labelClass}>Manager</label>
          <select
            value={form.managerId}
            onChange={(e) => set("managerId", e.target.value)}
            className={inputClass}
            style={inputStyle}
          >
            <option value="">— No manager —</option>
            {managers
              .filter((m) => m.id !== id)
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {m.firstName} {m.lastName}
                </option>
              ))}
          </select>
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
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
