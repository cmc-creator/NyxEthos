"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";

export default function AcceptInvitePage() {
  const params = useParams() as { token: string };
  const router = useRouter();
  const [invite, setInvite] = useState<{ email: string; role: string } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", password: "", confirm: "" });

  useEffect(() => {
    fetch(`/api/invite/${params.token}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else setInvite(d);
        setLoading(false);
      })
      .catch(() => { setError("Failed to load invite."); setLoading(false); });
  }, [params.token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setError(""); setSubmitting(true);
    const r = await fetch(`/api/invite/${params.token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, password: form.password }),
    });
    const d = await r.json();
    if (!r.ok) { setError(d.error || "Failed to accept invite."); setSubmitting(false); return; }
    setDone(true);
    setTimeout(() => router.push("/sign-in"), 2500);
  }

  const glass = { background: "rgba(10,24,50,0.85)", border: "1px solid rgba(37,112,245,0.25)" };
  const inputStyle = { borderColor: "rgba(37,112,245,0.25)", background: "rgba(10,24,50,0.6)", color: "#eef5ff" };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#06101f" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "#eef5ff" }}>NyxEthos</h1>
          <p className="text-nyx-muted text-sm mt-2">You&apos;ve been invited to join</p>
        </div>

        <div className="rounded-2xl p-7" style={glass}>
          {loading && <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin text-nyx-blue" /></div>}

          {!loading && error && !done && (
            <div className="text-center py-6">
              <AlertCircle size={40} className="mx-auto mb-3" style={{ color: "#f87171" }} />
              <p className="text-nyx-white font-semibold mb-2">Invalid Invite</p>
              <p className="text-nyx-muted text-sm mb-5">{error}</p>
              <Link href="/sign-in" className="text-nyx-blue-bright text-sm hover:underline">Go to sign in →</Link>
            </div>
          )}

          {!loading && invite && !done && (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: "rgba(37,112,245,0.15)", border: "1px solid rgba(37,112,245,0.3)" }}>
                  <span className="text-sm font-semibold" style={{ color: "#4d8fff" }}>{invite.email}</span>
                </div>
                <p className="text-nyx-muted text-xs">Set up your account to get started</p>
              </div>
              {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-nyx-muted uppercase tracking-wider mb-1.5">Full Name</label>
                  <input required className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-nyx-blue transition-colors"
                    style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-nyx-muted uppercase tracking-wider mb-1.5">Password</label>
                  <input required type="password" className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-nyx-blue transition-colors"
                    style={inputStyle} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Min 8 characters" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-nyx-muted uppercase tracking-wider mb-1.5">Confirm Password</label>
                  <input required type="password" className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-nyx-blue transition-colors"
                    style={inputStyle} value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} placeholder="Repeat password" />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}>
                  {submitting ? "Setting up account…" : "Accept Invite & Join"}
                </button>
              </form>
            </>
          )}

          {done && (
            <div className="text-center py-6">
              <CheckCircle size={48} className="mx-auto mb-3" style={{ color: "#34d399" }} />
              <p className="text-nyx-white font-bold text-lg mb-2">Welcome aboard!</p>
              <p className="text-nyx-muted text-sm">Redirecting to sign in…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}