"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FolderOpen, ArrowLeft } from "lucide-react";

type Employee = { id: string; firstName: string; lastName: string };

export default function NewDocumentPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: "other",
    employeeId: "",
    fileUrl: "",
    size: "",
  });

  useEffect(() => {
    fetch("/api/employees")
      .then((r) => r.json())
      .then((d) => setEmployees(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) { setError("Document name is required."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, employeeId: form.employeeId || null }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to add document.");
      } else {
        router.push("/documents");
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
        <Link href="/documents" className="inline-flex items-center gap-2 text-sm mb-4 opacity-60 hover:opacity-100 transition-opacity" style={{ color: "#4d8fff" }}>
          <ArrowLeft size={13} /> Back to Documents
        </Link>
        <h1 className="text-2xl font-bold font-heading" style={{ color: "#eef5ff" }}>Add Document</h1>
        <p className="mt-1 text-sm" style={{ color: "#7a9fc0" }}>Add a document record to the system.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5">
        <div>
          <label style={labelStyle}>Document Name *</label>
          <input type="text" placeholder="e.g. Employment Contract — Jane Doe" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} style={inputStyle} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Category</label>
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} style={inputStyle}>
              <option value="contract">Contract</option>
              <option value="policy">Policy</option>
              <option value="form">Form</option>
              <option value="report">Report</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Employee (optional)</label>
            <select value={form.employeeId} onChange={(e) => setForm((f) => ({ ...f, employeeId: e.target.value }))} style={inputStyle}>
              <option value="">Organization-wide</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>File URL (optional)</label>
          <input type="url" placeholder="https://drive.google.com/…" value={form.fileUrl} onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))} style={inputStyle} />
          <p className="text-xs mt-1.5" style={{ color: "#7a9fc0" }}>Link to document in Google Drive, Dropbox, SharePoint, etc.</p>
        </div>

        <div>
          <label style={labelStyle}>File Size (optional)</label>
          <input type="text" placeholder="e.g. 245 KB" value={form.size} onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))} style={inputStyle} />
        </div>

        {error && <p className="text-sm px-4 py-3 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>{error}</p>}

        <div className="flex gap-3 pt-2">
          <Link href="/documents" className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity" style={{ border: "1px solid rgba(37,112,245,0.2)", color: "#7a9fc0" }}>Cancel</Link>
          <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50" style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}>
            <FolderOpen size={14} /> {loading ? "Saving…" : "Add Document"}
          </button>
        </div>
      </form>
    </div>
  );
}
