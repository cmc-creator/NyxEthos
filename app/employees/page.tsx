"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, Users } from "lucide-react";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string | null;
  jobTitle: string | null;
  status: string;
  employmentType: string | null;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/employees")
      .then((r) => r.json())
      .then((data) => { setEmployees(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this employee? This cannot be undone.")) return;
    setDeleting(id);
    await fetch(`/api/employees/${id}`, { method: "DELETE" });
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    setDeleting(null);
  }

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.firstName.toLowerCase().includes(q) ||
      e.lastName.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      (e.department ?? "").toLowerCase().includes(q) ||
      (e.jobTitle ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-nyx-white text-2xl font-extrabold tracking-tight">Employees</h1>
          <p className="text-nyx-muted text-sm mt-1">
            {loading ? "Loading…" : `${employees.length} total`}
          </p>
        </div>
        <Link
          href="/employees/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#2570f5,#4d8fff)", boxShadow: "0 0 20px rgba(37,112,245,0.35)" }}
        >
          <Plus size={15} />
          Add Employee
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-nyx-muted" />
        <input
          type="text"
          placeholder="Search by name, email, department…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border text-nyx-text text-sm placeholder-nyx-muted bg-transparent outline-none focus:border-nyx-blue transition-colors"
          style={{ borderColor: "rgba(37,112,245,0.25)", background: "rgba(10,24,50,0.6)" }}
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden"
        style={{ background: "rgba(10,24,50,0.7)", borderColor: "rgba(37,112,245,0.18)" }}>
        {loading ? (
          <div className="p-12 text-center text-nyx-muted text-sm">Loading employees…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={32} className="mx-auto mb-3 opacity-30 text-nyx-muted" />
            <p className="text-nyx-muted text-sm">
              {search ? "No employees match your search." : "No employees yet."}
            </p>
            {!search && (
              <Link href="/employees/new" className="inline-block mt-4 text-sm text-nyx-blue-bright hover:underline">
                Add your first employee →
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(37,112,245,0.1)" }}>
                {["Name", "Email", "Job Title", "Department", "Type", "Status", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-nyx-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr key={emp.id} className="border-b transition-colors hover:bg-white/[0.02]"
                  style={{ borderColor: "rgba(37,112,245,0.06)" }}>
                  <td className="px-5 py-3.5">
                    <Link href={`/employees/${emp.id}`}
                      className="text-nyx-white text-sm font-medium hover:text-nyx-blue-bright transition-colors">
                      {emp.firstName} {emp.lastName}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-nyx-muted text-sm">{emp.email}</td>
                  <td className="px-5 py-3.5 text-nyx-muted text-sm">{emp.jobTitle || "—"}</td>
                  <td className="px-5 py-3.5 text-nyx-muted text-sm">{emp.department || "—"}</td>
                  <td className="px-5 py-3.5 text-nyx-muted text-sm capitalize">
                    {emp.employmentType ? emp.employmentType.toLowerCase().replace("_", " ") : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={emp.status === "ACTIVE"
                        ? { background: "rgba(34,197,94,0.15)", color: "#86efac" }
                        : { background: "rgba(148,163,184,0.12)", color: "#94a3b8" }}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Link href={`/employees/${emp.id}`}
                        className="p-1.5 rounded-lg text-nyx-muted hover:text-nyx-white hover:bg-white/10 transition-colors">
                        <Pencil size={13} />
                      </Link>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        disabled={deleting === emp.id}
                        className="p-1.5 rounded-lg text-nyx-muted hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
