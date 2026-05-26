"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Save, Trash2, User, Clock, Calendar, FileText,
  DollarSign, Star, Briefcase, Phone, Mail, Edit2, ChevronRight,
} from "lucide-react";

const DEPARTMENTS = ["Engineering","Sales","Marketing","Operations","HR","Finance","Legal","Support","Product","Design"];
const TABS = ["Overview","PTO History","Time Entries","Documents","Payroll","Reviews"] as const;
type Tab = typeof TABS[number];

type Employee = {
  id: string; firstName: string; lastName: string; email: string; phone: string;
  jobTitle: string; startDate: string | null; department: string | null;
  status: string; employmentType: string; salary: number | null;
  managerId: string | null;
  manager: { id: string; firstName: string; lastName: string } | null;
};
type LeaveRequest = { id: string; type: string; startDate: string; endDate: string; days: number; status: string; notes: string | null; createdAt: string };
type TimeEntry  = { id: string; date: string; hours: number; type: string; status: string; note: string | null };
type Document   = { id: string; name: string; category: string; fileUrl: string | null; size: string | null; uploadedAt: string };
type PayStub    = { id: string; grossPay: number; netPay: number; federalTax: number; stateTax: number; socialSecurity: number; medicare: number; createdAt: string; payrollRun: { period: string } };
type Review     = { id: string; period: string; score: number | null; status: string; notes: string | null; reviewDate: string };
type PtoBalance = { vacationDays: number; sickDays: number; personalDays: number; usedVacation: number; usedSick: number; usedPersonal: number };

export default function EmployeeProfilePage() {
  const router = useRouter();
  const params = useParams() as { id: string };
  const id = params.id;

  const [emp, setEmp] = useState<Employee | null>(null);
  const [managers, setManagers] = useState<{ id: string; firstName: string; lastName: string }[]>([]);
  const [tab, setTab] = useState<Tab>("Overview");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [payStubs, setPayStubs] = useState<PayStub[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [balance, setBalance] = useState<PtoBalance | null>(null);

  const [form, setForm] = useState<Partial<Employee & { salary: string }>>({});

  useEffect(() => {
    fetch("/api/employees").then(r => r.json()).then(d => Array.isArray(d) && setManagers(d)).catch(() => null);
  }, []);

  useEffect(() => {
    fetch(`/api/employees/${id}`).then(r => r.json()).then((d: Employee & { leaveRequests?: LeaveRequest[]; timeEntries?: TimeEntry[]; documents?: Document[]; payStubs?: PayStub[]; performanceReviews?: Review[]; ptoBalance?: PtoBalance }) => {
      setEmp(d);
      const { salary: rawSalary, ...rest } = d;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setForm({ ...rest, salary: rawSalary != null ? String(rawSalary) : "" } as any);
      setLeaveRequests(d.leaveRequests ?? []);
      setTimeEntries(d.timeEntries ?? []);
      setDocuments(d.documents ?? []);
      setPayStubs(d.payStubs ?? []);
      setReviews(d.performanceReviews ?? []);
      setBalance(d.ptoBalance ?? null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSaving(true); setSaved(false);
    const res = await fetch(`/api/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, salary: form.salary ? parseFloat(form.salary as string) : null, startDate: form.startDate ? new Date(form.startDate).toISOString() : null }),
    });
    if (!res.ok) { const d = await res.json().catch(() => ({})); setError(d.error || "Failed."); }
    else { const d = await res.json(); setEmp(d); setSaved(true); setEditing(false); }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm("Permanently delete this employee?")) return;
    setDeleting(true);
    await fetch(`/api/employees/${id}`, { method: "DELETE" });
    router.push("/employees");
    router.refresh();
  }

  const glass = { background: "rgba(10,24,50,0.7)", border: "1px solid rgba(37,112,245,0.18)" };
  const inputClass = "w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-nyx-blue transition-colors";
  const inputStyle = { borderColor: "rgba(37,112,245,0.25)", background: "rgba(10,24,50,0.6)", color: "#eef5ff" };
  const label = "block text-xs font-semibold uppercase tracking-wider mb-1.5 text-nyx-muted";

  const statusColor = (s: string) => {
    if (s === "approved") return { color: "#34d399", bg: "rgba(52,211,153,0.1)" };
    if (s === "rejected") return { color: "#f87171", bg: "rgba(239,68,68,0.1)" };
    return { color: "#fbbf24", bg: "rgba(251,191,36,0.1)" };
  };

  if (loading) return <div className="p-8 flex items-center justify-center min-h-[40vh]"><p className="text-nyx-muted text-sm">Loading…</p></div>;
  if (!emp) return <div className="p-8"><p className="text-nyx-muted text-sm">Employee not found.</p><Link href="/employees" className="text-nyx-blue-bright text-sm hover:underline mt-2 inline-block">← Back</Link></div>;

  const fullName = `${emp.firstName} ${emp.lastName}`;
  const initials = `${emp.firstName[0] ?? ""}${emp.lastName[0] ?? ""}`.toUpperCase();
  const tenure = emp.startDate ? Math.floor((Date.now() - new Date(emp.startDate).getTime()) / (1000*60*60*24*365)) : null;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/employees" className="flex items-center gap-1 text-nyx-muted hover:text-nyx-white text-sm transition-colors">
          <ArrowLeft size={14} /> Back
        </Link>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5" style={glass}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0"
          style={{ background: "rgba(37,112,245,0.2)", border: "1px solid rgba(37,112,245,0.4)", color: "#4d8fff" }}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-nyx-white text-2xl font-extrabold tracking-tight">{fullName}</h1>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize"
              style={{ background: emp.status === "active" ? "rgba(52,211,153,0.15)" : "rgba(156,163,175,0.15)", color: emp.status === "active" ? "#34d399" : "#9ca3af" }}>
              {emp.status}
            </span>
          </div>
          <p className="text-nyx-muted text-sm mt-0.5">{emp.jobTitle ?? "—"} {emp.department ? `· ${emp.department}` : ""}</p>
          <div className="flex flex-wrap gap-4 mt-3">
            {emp.email && <div className="flex items-center gap-1.5 text-xs text-nyx-muted"><Mail size={12} />{emp.email}</div>}
            {emp.phone && <div className="flex items-center gap-1.5 text-xs text-nyx-muted"><Phone size={12} />{emp.phone}</div>}
            {tenure != null && <div className="flex items-center gap-1.5 text-xs text-nyx-muted"><Briefcase size={12} />{tenure}yr tenure</div>}
            {emp.salary && <div className="flex items-center gap-1.5 text-xs text-nyx-muted"><DollarSign size={12} />${emp.salary.toLocaleString()}/yr</div>}
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => setEditing(v => !v)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
            style={{ background: editing ? "rgba(239,68,68,0.15)" : "rgba(37,112,245,0.15)", color: editing ? "#f87171" : "#4d8fff", border: `1px solid ${editing ? "rgba(239,68,68,0.3)" : "rgba(37,112,245,0.3)"}` }}>
            <Edit2 size={13} /> {editing ? "Cancel" : "Edit"}
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
            style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" }}>
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>

      {/* Edit Form */}
      {editing && (
        <form onSubmit={handleSave} className="rounded-2xl p-6 mb-6" style={glass}>
          <h2 className="text-nyx-white font-semibold text-sm mb-4">Edit Employee</h2>
          {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
          {saved && <p className="text-green-400 text-xs mb-3">Saved!</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {([["firstName","First Name"],["lastName","Last Name"],["email","Email"],["phone","Phone"],["jobTitle","Job Title"],["salary","Salary"]] as [keyof typeof form, string][]).map(([f,lbl]) => (
              <div key={f}><label className={label}>{lbl}</label>
                <input className={inputClass} style={inputStyle} value={(form[f] as string) ?? ""} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} /></div>
            ))}
            <div><label className={label}>Department</label>
              <select className={inputClass} style={inputStyle} value={form.department ?? ""} onChange={e => setForm(p => ({ ...p, department: e.target.value }))}>
                <option value="">— Select —</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select></div>
            <div><label className={label}>Status</label>
              <select className={inputClass} style={inputStyle} value={form.status ?? "active"} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                {["active","inactive","on-leave"].map(s => <option key={s} value={s}>{s}</option>)}
              </select></div>
            <div><label className={label}>Employment Type</label>
              <select className={inputClass} style={inputStyle} value={form.employmentType ?? "full-time"} onChange={e => setForm(p => ({ ...p, employmentType: e.target.value }))}>
                {["full-time","part-time","contractor","intern"].map(s => <option key={s} value={s}>{s}</option>)}
              </select></div>
            <div><label className={label}>Start Date</label>
              <input type="date" className={inputClass} style={inputStyle} value={emp.startDate ? emp.startDate.slice(0,10) : ""} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} /></div>
            <div><label className={label}>Manager</label>
              <select className={inputClass} style={inputStyle} value={form.managerId ?? ""} onChange={e => setForm(p => ({ ...p, managerId: e.target.value }))}>
                <option value="">— None —</option>
                {managers.filter(m => m.id !== id).map(m => <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>)}
              </select></div>
          </div>
          <div className="flex gap-3 mt-5">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-60"
              style={{ background: "rgba(37,112,245,0.9)", color: "#fff" }}>
              <Save size={14} /> {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      {/* PTO Balance Strip */}
      {balance && (
        <div className="rounded-2xl p-5 mb-6 grid grid-cols-3 gap-4" style={glass}>
          {[
            { label: "Vacation", total: balance.vacationDays, used: balance.usedVacation, color: "#4d8fff" },
            { label: "Sick Leave", total: balance.sickDays, used: balance.usedSick, color: "#34d399" },
            { label: "Personal", total: balance.personalDays, used: balance.usedPersonal, color: "#fbbf24" },
          ].map(({ label: lbl, total, used, color }) => {
            const remaining = Math.max(0, total - used);
            const pct = Math.min(100, (used / total) * 100);
            return (
              <div key={lbl}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-nyx-muted uppercase tracking-wider">{lbl}</span>
                  <span className="text-xs font-bold" style={{ color }}>{remaining}d left</span>
                </div>
                <div className="h-1.5 rounded-full mb-1" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                </div>
                <p className="text-xs text-nyx-muted">{used}d used of {total}d</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-5 rounded-xl p-1" style={{ background: "rgba(10,24,50,0.5)", border: "1px solid rgba(37,112,245,0.12)" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all"
            style={tab === t ? { background: "rgba(37,112,245,0.25)", color: "#eef5ff" } : { color: "#7a9fc0" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {tab === "Overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: User, label: "Full Name", value: fullName },
            { icon: Mail, label: "Email", value: emp.email },
            { icon: Phone, label: "Phone", value: emp.phone || "—" },
            { icon: Briefcase, label: "Department", value: emp.department || "—" },
            { icon: Star, label: "Job Title", value: emp.jobTitle || "—" },
            { icon: DollarSign, label: "Salary", value: emp.salary ? `$${emp.salary.toLocaleString()}` : "—" },
            { icon: Calendar, label: "Start Date", value: emp.startDate ? new Date(emp.startDate).toLocaleDateString() : "—" },
            { icon: User, label: "Manager", value: emp.manager ? `${emp.manager.firstName} ${emp.manager.lastName}` : "—" },
            { icon: Briefcase, label: "Employment Type", value: emp.employmentType },
            { icon: User, label: "Status", value: emp.status },
          ].map(({ icon: Icon, label: lbl, value }) => (
            <div key={lbl} className="rounded-xl p-4 flex items-center gap-3" style={glass}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(37,112,245,0.12)", border: "1px solid rgba(37,112,245,0.2)" }}>
                <Icon size={14} style={{ color: "#4d8fff" }} />
              </div>
              <div><p className="text-xs text-nyx-muted font-semibold uppercase tracking-wider">{lbl}</p>
                <p className="text-sm text-nyx-white font-medium">{value}</p></div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: PTO History */}
      {tab === "PTO History" && (
        <div className="rounded-2xl overflow-hidden" style={glass}>
          {leaveRequests.length === 0 ? (
            <div className="p-8 text-center text-nyx-muted text-sm">No leave requests.</div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr style={{ borderBottom: "1px solid rgba(37,112,245,0.1)" }}>
                {["Type","Start","End","Days","Status","Notes"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-nyx-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr></thead>
              <tbody>{leaveRequests.map(r => {
                const sc = statusColor(r.status);
                return (
                  <tr key={r.id} style={{ borderBottom: "1px solid rgba(37,112,245,0.06)" }}>
                    <td className="px-4 py-3 capitalize text-nyx-white">{r.type}</td>
                    <td className="px-4 py-3 text-nyx-muted">{new Date(r.startDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-nyx-muted">{new Date(r.endDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-nyx-white font-medium">{r.days}d</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full capitalize font-medium" style={{ color: sc.color, background: sc.bg }}>{r.status}</span></td>
                    <td className="px-4 py-3 text-nyx-muted text-xs max-w-[150px] truncate">{r.notes || "—"}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab: Time Entries */}
      {tab === "Time Entries" && (
        <div className="rounded-2xl overflow-hidden" style={glass}>
          {timeEntries.length === 0 ? (
            <div className="p-8 text-center text-nyx-muted text-sm">No time entries.</div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr style={{ borderBottom: "1px solid rgba(37,112,245,0.1)" }}>
                {["Date","Hours","Type","Status","Note"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-nyx-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr></thead>
              <tbody>{timeEntries.map(e => {
                const sc = statusColor(e.status);
                return (
                  <tr key={e.id} style={{ borderBottom: "1px solid rgba(37,112,245,0.06)" }}>
                    <td className="px-4 py-3 text-nyx-white">{new Date(e.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-nyx-white font-medium">{e.hours}h</td>
                    <td className="px-4 py-3 text-nyx-muted capitalize">{e.type}</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full capitalize font-medium" style={{ color: sc.color, background: sc.bg }}>{e.status}</span></td>
                    <td className="px-4 py-3 text-nyx-muted text-xs">{e.note || "—"}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab: Documents */}
      {tab === "Documents" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.length === 0 ? (
            <div className="col-span-full p-8 text-center text-nyx-muted text-sm">No documents.</div>
          ) : documents.map(d => (
            <div key={d.id} className="rounded-xl p-4 flex items-start gap-3" style={glass}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(37,112,245,0.12)", border: "1px solid rgba(37,112,245,0.2)" }}>
                <FileText size={15} style={{ color: "#4d8fff" }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-nyx-white font-medium truncate">{d.name}</p>
                <p className="text-xs text-nyx-muted capitalize">{d.category}{d.size ? ` · ${d.size}` : ""}</p>
                <p className="text-xs text-nyx-muted">{new Date(d.uploadedAt).toLocaleDateString()}</p>
                {d.fileUrl && <a href={d.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-nyx-blue-bright hover:underline mt-1 inline-block">View →</a>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Payroll */}
      {tab === "Payroll" && (
        <div className="rounded-2xl overflow-hidden" style={glass}>
          {payStubs.length === 0 ? (
            <div className="p-8 text-center text-nyx-muted text-sm">No pay stubs.</div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr style={{ borderBottom: "1px solid rgba(37,112,245,0.1)" }}>
                {["Period","Gross","Fed. Tax","State Tax","SS+Medicare","Net Pay"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-nyx-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr></thead>
              <tbody>{payStubs.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid rgba(37,112,245,0.06)" }}>
                  <td className="px-4 py-3 text-nyx-white">{p.payrollRun?.period ?? "—"}</td>
                  <td className="px-4 py-3 text-nyx-white">${p.grossPay.toLocaleString()}</td>
                  <td className="px-4 py-3 text-nyx-muted">${p.federalTax.toLocaleString()}</td>
                  <td className="px-4 py-3 text-nyx-muted">${p.stateTax.toLocaleString()}</td>
                  <td className="px-4 py-3 text-nyx-muted">${(p.socialSecurity + p.medicare).toLocaleString()}</td>
                  <td className="px-4 py-3 font-bold" style={{ color: "#34d399" }}>${p.netPay.toLocaleString()}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab: Reviews */}
      {tab === "Reviews" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reviews.length === 0 ? (
            <div className="col-span-full p-8 text-center text-nyx-muted text-sm">No performance reviews.</div>
          ) : reviews.map(r => {
            const statusStyle = r.status === "completed" ? { color: "#34d399", bg: "rgba(52,211,153,0.1)" } : { color: "#fbbf24", bg: "rgba(251,191,36,0.1)" };
            return (
              <div key={r.id} className="rounded-xl p-5" style={glass}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-nyx-white font-semibold text-sm">{r.period}</p>
                    <p className="text-xs text-nyx-muted">{new Date(r.reviewDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.score != null && (
                      <span className="text-sm font-bold" style={{ color: r.score >= 4 ? "#34d399" : r.score >= 3 ? "#fbbf24" : "#f87171" }}>
                        {r.score}/5
                      </span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded-full capitalize font-medium" style={{ color: statusStyle.color, background: statusStyle.bg }}>{r.status}</span>
                  </div>
                </div>
                {r.notes && <p className="text-xs text-nyx-muted">{r.notes}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}