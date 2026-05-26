"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FolderOpen, ArrowLeft, Upload, X, FileText } from "lucide-react";

type Employee = { id: string; firstName: string; lastName: string };

export default function NewDocumentPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string; size: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    type: "offer_letter",
    employeeId: "",
    url: "",
    notes: "",
  });

  const c1 = "#eef5ff";
  const c3 = "#7a9fc0";
  const border = "rgba(37,112,245,0.12)";

  useEffect(() => {
    fetch("/api/employees")
      .then((r) => r.json())
      .then((d) => setEmployees(Array.isArray(d) ? d : []));
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: data });
    if (res.ok) {
      const json = await res.json();
      setUploadedFile({ name: file.name, url: json.url, size: json.size });
      setForm((f) => ({ ...f, url: json.url, title: f.title || file.name.replace(/\.[^.]+$/, "") }));
    } else {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Upload failed — paste a URL instead.");
    }
    setUploading(false);
  }

  function removeFile() {
    setUploadedFile(null);
    setForm((f) => ({ ...f, url: "" }));
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.url) { setError("Title and file/URL are required."); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/documents");
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Failed to save document.");
      setLoading(false);
    }
  }

  const inputStyle = {
    background: "rgba(37,112,245,0.06)",
    border: `1px solid ${border}`,
    color: c1,
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/documents" className="flex items-center gap-1 text-xs hover:opacity-80 transition-opacity" style={{ color: c3 }}>
          <ArrowLeft size={13} /> Documents
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(37,112,245,0.15)" }}>
          <FolderOpen size={18} style={{ color: "#4d8fff" }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: c1 }}>Add Document</h1>
          <p className="text-sm" style={{ color: c3 }}>Upload a file or paste a URL</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4">
        {error && (
          <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(248,113,113,0.12)", color: "#f87171" }}>
            {error}
          </div>
        )}

        {/* File upload */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: c3 }}>
            File Upload
          </label>
          {uploadedFile ? (
            <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
              <FileText size={16} style={{ color: "#34d399" }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: c1 }}>{uploadedFile.name}</p>
                <p className="text-xs" style={{ color: c3 }}>{(uploadedFile.size / 1024).toFixed(0)} KB</p>
              </div>
              <button type="button" onClick={removeFile} style={{ color: c3 }}>
                <X size={14} />
              </button>
            </div>
          ) : (
            <div>
              <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{ background: "rgba(37,112,245,0.08)", border: `1px dashed rgba(37,112,245,0.3)`, color: c3 }}
              >
                <Upload size={14} />
                {uploading ? "Uploading…" : "Choose file to upload"}
              </button>
            </div>
          )}
        </div>

        {/* URL fallback */}
        {!uploadedFile && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: c3 }}>
              …or paste URL
            </label>
            <input
              type="url"
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              placeholder="https://"
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
              style={inputStyle}
            />
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: c3 }}>Title *</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Offer Letter – Jane Doe"
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            style={inputStyle}
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: c3 }}>Document Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            style={inputStyle}
          >
            {["offer_letter", "contract", "id", "tax_form", "policy", "review", "other"].map((t) => (
              <option key={t} value={t}>{t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
            ))}
          </select>
        </div>

        {/* Employee */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: c3 }}>Employee (optional)</label>
          <select
            value={form.employeeId}
            onChange={(e) => setForm((f) => ({ ...f, employeeId: e.target.value }))}
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            style={inputStyle}
          >
            <option value="">— Org-wide —</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: c3 }}>Notes</label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
            style={inputStyle}
          />
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <Link href="/documents" className="px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80" style={{ background: "rgba(37,112,245,0.08)", color: c3 }}>
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || uploading}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
          >
            {loading ? "Saving…" : "Add Document"}
          </button>
        </div>
      </form>
    </div>
  );
}
