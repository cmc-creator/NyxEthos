"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Circle, Plus, Loader2, ClipboardList, ShieldCheck, Scale, Flame, Lock, BarChart2, DollarSign, Heart } from "lucide-react";

type Task = { id: string; title: string; description: string | null; category: string; status: string; dueDate: string | null; completedAt: string | null };

const CAT_META: Record<string, { icon: typeof ClipboardList; color: string; bg: string }> = {
  policy:   { icon: ClipboardList, color: "#4d8fff", bg: "rgba(37,112,245,0.15)" },
  training: { icon: ShieldCheck,   color: "#34d399", bg: "rgba(52,211,153,0.12)" },
  legal:    { icon: Scale,         color: "#818cf8", bg: "rgba(99,102,241,0.15)" },
  safety:   { icon: Flame,         color: "#f87171", bg: "rgba(239,68,68,0.12)" },
  finance:  { icon: DollarSign,    color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
  benefits: { icon: Heart,         color: "#f472b6", bg: "rgba(244,114,182,0.12)" },
  other:    { icon: Lock,          color: "#94a3b8", bg: "rgba(148,163,184,0.12)" },
};

export default function CompliancePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "policy", dueDate: "" });
  const [toast, setToast] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  async function load() {
    const r = await fetch("/api/compliance");
    const d = await r.json();
    setTasks(Array.isArray(d) ? d : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggle(task: Task) {
    setToggling(task.id);
    const newStatus = task.status === "completed" ? "pending" : "completed";
    const r = await fetch("/api/compliance", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: task.id, status: newStatus }),
    });
    if (r.ok) {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus, completedAt: newStatus === "completed" ? new Date().toISOString() : null } : t));
      showToast(newStatus === "completed" ? "Marked complete!" : "Marked pending");
    }
    setToggling(null);
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) return;
    setAdding(true);
    const r = await fetch("/api/compliance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (r.ok) {
      await load();
      setForm({ title: "", description: "", category: "policy", dueDate: "" });
      setShowAdd(false);
      showToast("Task added!");
    }
    setAdding(false);
  }

  const filtered = tasks.filter(t => filter === "all" || t.status === filter);
  const completed = tasks.filter(t => t.status === "completed").length;
  const pending = tasks.filter(t => t.status === "pending").length;
  const pct = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
  const glass = { background: "rgba(10,24,50,0.7)", border: "1px solid rgba(37,112,245,0.18)" };
  const inputStyle = { borderColor: "rgba(37,112,245,0.25)", background: "rgba(10,24,50,0.6)", color: "#eef5ff" };

  if (loading) return <div className="p-8 flex items-center justify-center min-h-[40vh]"><Loader2 size={22} className="animate-spin text-nyx-blue" /></div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-xl" style={{ background: "rgba(52,211,153,0.9)", color: "#0a1832" }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: "#eef5ff" }}>Compliance</h1>
          <p className="mt-1 text-sm" style={{ color: "#7a9fc0" }}>Track compliance tasks and regulatory requirements.</p>
        </div>
        <button onClick={() => setShowAdd(v => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          style={{ background: "rgba(37,112,245,0.2)", color: "#4d8fff", border: "1px solid rgba(37,112,245,0.35)" }}>
          <Plus size={15} /> Add Task
        </button>
      </div>

      {/* Progress Card */}
      <div className="rounded-2xl p-6 mb-6 grid grid-cols-3 gap-6" style={glass}>
        <div className="col-span-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold" style={{ color: "#eef5ff" }}>Overall Compliance</span>
            <span className="text-xl font-bold" style={{ color: pct >= 80 ? "#34d399" : pct >= 50 ? "#fbbf24" : "#f87171" }}>{pct}%</span>
          </div>
          <div className="h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: pct >= 80 ? "#34d399" : pct >= 50 ? "#fbbf24" : "#f87171" }} />
          </div>
          <p className="text-xs mt-2" style={{ color: "#7a9fc0" }}>{completed} of {tasks.length} tasks completed</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs"><span className="text-nyx-muted">Completed</span><span className="font-semibold" style={{ color: "#34d399" }}>{completed}</span></div>
          <div className="flex justify-between text-xs"><span className="text-nyx-muted">Pending</span><span className="font-semibold" style={{ color: "#fbbf24" }}>{pending}</span></div>
          <div className="flex justify-between text-xs"><span className="text-nyx-muted">Total</span><span className="font-semibold text-nyx-white">{tasks.length}</span></div>
        </div>
      </div>

      {/* Add Task Form */}
      {showAdd && (
        <form onSubmit={addTask} className="rounded-2xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4" style={glass}>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-nyx-muted uppercase tracking-wider mb-1.5">Title *</label>
            <input required className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-nyx-blue transition-colors"
              style={inputStyle} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Task title…" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-nyx-muted uppercase tracking-wider mb-1.5">Description</label>
            <input className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-nyx-blue transition-colors"
              style={inputStyle} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Optional description…" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-nyx-muted uppercase tracking-wider mb-1.5">Category</label>
            <select className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={inputStyle} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
              {Object.keys(CAT_META).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-nyx-muted uppercase tracking-wider mb-1.5">Due Date</label>
            <input type="date" className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={inputStyle} value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" disabled={adding}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 transition-opacity"
              style={{ background: "rgba(37,112,245,0.9)", color: "#fff" }}>
              {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add Task
            </button>
            <button type="button" onClick={() => setShowAdd(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ color: "#7a9fc0" }}>Cancel</button>
          </div>
        </form>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {(["all","pending","completed"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all"
            style={filter === f ? { background: "rgba(37,112,245,0.25)", color: "#eef5ff", border: "1px solid rgba(37,112,245,0.4)" } : { color: "#7a9fc0", border: "1px solid transparent" }}>
            {f} {f === "all" ? `(${tasks.length})` : f === "pending" ? `(${pending})` : `(${completed})`}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filtered.map(task => {
          const meta = CAT_META[task.category] ?? CAT_META.other;
          const Icon = meta.icon;
          const done = task.status === "completed";
          const busy = toggling === task.id;
          return (
            <div key={task.id} className="rounded-xl p-4 flex items-center gap-4 transition-all" style={{ ...glass, opacity: done ? 0.75 : 1 }}>
              <button onClick={() => toggle(task)} disabled={busy} className="flex-shrink-0 transition-transform hover:scale-110">
                {busy ? <Loader2 size={20} className="animate-spin text-nyx-blue" /> :
                  done ? <CheckCircle size={20} style={{ color: "#34d399" }} /> :
                  <Circle size={20} style={{ color: "#7a9fc0" }} />}
              </button>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
                <Icon size={14} style={{ color: meta.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: done ? "#7a9fc0" : "#eef5ff", textDecoration: done ? "line-through" : "none" }}>{task.title}</p>
                {task.description && <p className="text-xs mt-0.5" style={{ color: "#7a9fc0" }}>{task.description}</p>}
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs capitalize px-2 py-0.5 rounded-full" style={{ background: meta.bg, color: meta.color }}>{task.category}</span>
                  {task.dueDate && <span className="text-xs" style={{ color: "#7a9fc0" }}>Due {new Date(task.dueDate).toLocaleDateString()}</span>}
                  {task.completedAt && <span className="text-xs" style={{ color: "#34d399" }}>Completed {new Date(task.completedAt).toLocaleDateString()}</span>}
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 capitalize"
                style={done ? { background: "rgba(52,211,153,0.12)", color: "#34d399" } : { background: "rgba(251,191,36,0.1)", color: "#fbbf24" }}>
                {task.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}