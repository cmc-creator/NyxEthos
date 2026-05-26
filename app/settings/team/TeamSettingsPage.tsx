"use client";

import { useEffect, useState, useCallback } from "react";
import { UserPlus, Trash2, Copy, Check, Loader2, Users, Mail, Clock, Crown } from "lucide-react";

type TeamUser = { id: string; name: string | null; email: string; role: string; createdAt: string };
type InviteToken = { id: string; email: string; role: string; token: string; usedAt: string | null; expiresAt: string; createdAt: string };

export default function TeamSettingsPage() {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [tokens, setTokens] = useState<InviteToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ email: "", role: "admin" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  const load = useCallback(async () => {
    const r = await fetch("/api/invite");
    const d = await r.json();
    setUsers(d.users ?? []);
    setTokens(d.tokens ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSending(true);
    const r = await fetch("/api/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await r.json();
    if (!r.ok) { setError(d.error || "Failed."); setSending(false); return; }
    setForm({ email: "", role: "admin" });
    await load();
    showToast("Invite created!");
    setSending(false);
  }

  async function revoke(id: string) {
    setRevoking(id);
    await fetch("/api/invite", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setTokens(prev => prev.filter(t => t.id !== id));
    showToast("Invite revoked");
    setRevoking(null);
  }

  function copyLink(token: string, id: string) {
    const url = `${window.location.origin}/invite/${token}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      showToast("Link copied!");
    });
  }

  const glass = { background: "rgba(10,24,50,0.6)", border: "1px solid rgba(37,112,245,0.15)" };
  const inputStyle = { borderColor: "rgba(37,112,245,0.25)", background: "rgba(10,24,50,0.6)", color: "#eef5ff" };
  const activeTokens = tokens.filter(t => !t.usedAt && new Date(t.expiresAt) > new Date());

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 size={22} className="animate-spin text-nyx-blue" /></div>;

  return (
    <div className="max-w-3xl">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-xl" style={{ background: "rgba(52,211,153,0.9)", color: "#0a1832" }}>
          {toast}
        </div>
      )}

      <h2 className="text-xl font-bold mb-1" style={{ color: "#eef5ff" }}>Team Members</h2>
      <p className="text-sm text-nyx-muted mb-6">Invite colleagues to manage this workspace.</p>

      {/* Invite Form */}
      <form onSubmit={sendInvite} className="rounded-2xl p-5 mb-6" style={glass}>
        <h3 className="text-sm font-semibold text-nyx-white mb-4 flex items-center gap-2"><UserPlus size={15} style={{ color: "#4d8fff" }} /> Invite by Email</h3>
        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
        <div className="flex flex-col sm:flex-row gap-3">
          <input required type="email" className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-nyx-blue transition-colors"
            style={inputStyle} value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="colleague@company.com" />
          <select className="px-4 py-2.5 rounded-xl border text-sm outline-none" style={inputStyle} value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
          </select>
          <button type="submit" disabled={sending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-opacity flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}>
            {sending ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
            Invite
          </button>
        </div>
      </form>

      {/* Current Members */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-nyx-white mb-3 flex items-center gap-2"><Users size={14} style={{ color: "#34d399" }} /> Members ({users.length})</h3>
        <div className="space-y-2">
          {users.map(u => (
            <div key={u.id} className="rounded-xl p-3.5 flex items-center gap-3" style={glass}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: "rgba(37,112,245,0.2)", color: "#4d8fff" }}>
                {(u.name ?? u.email)[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-nyx-white truncate">{u.name ?? "—"}</p>
                <p className="text-xs text-nyx-muted truncate">{u.email}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs px-2 py-0.5 rounded-full capitalize flex items-center gap-1"
                  style={{ background: u.role === "admin" ? "rgba(251,191,36,0.1)" : "rgba(37,112,245,0.1)", color: u.role === "admin" ? "#fbbf24" : "#4d8fff" }}>
                  {u.role === "admin" && <Crown size={10} />} {u.role}
                </span>
                <span className="text-xs text-nyx-muted hidden sm:block">Joined {new Date(u.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Invites */}
      {activeTokens.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-nyx-white mb-3 flex items-center gap-2"><Mail size={14} style={{ color: "#fbbf24" }} /> Pending Invites ({activeTokens.length})</h3>
          <div className="space-y-2">
            {activeTokens.map(t => {
              const expired = new Date(t.expiresAt) < new Date();
              return (
                <div key={t.id} className="rounded-xl p-3.5 flex items-center gap-3" style={glass}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.2)" }}>
                    <Mail size={14} style={{ color: "#fbbf24" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-nyx-white truncate">{t.email}</p>
                    <p className="text-xs text-nyx-muted flex items-center gap-1">
                      <Clock size={10} /> Expires {new Date(t.expiresAt).toLocaleDateString()} · {t.role}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => copyLink(t.token, t.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      style={{ background: "rgba(37,112,245,0.15)", color: "#4d8fff", border: "1px solid rgba(37,112,245,0.25)" }}>
                      {copiedId === t.id ? <Check size={11} /> : <Copy size={11} />}
                      {copiedId === t.id ? "Copied!" : "Copy Link"}
                    </button>
                    <button onClick={() => revoke(t.id)} disabled={revoking === t.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                      style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                      {revoking === t.id ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                      Revoke
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}