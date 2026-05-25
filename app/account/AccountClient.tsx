"use client";

import { useState } from "react";
import { User, Lock, Save, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Props {
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

const c1 = "#eef5ff";
const c3 = "#7a9fc0";

export default function AccountClient({ name, email, role, joinedAt }: Props) {
  const [n, setN] = useState(name);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confPw, setConfPw] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const msg = (
    setter: (v: { text: string; ok: boolean } | null) => void,
    text: string,
    ok: boolean,
  ) => {
    setter({ text, ok });
    setTimeout(() => setter(null), 4000);
  };

  const saveProfile = async () => {
    setProfileSaving(true);
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: n }),
    });
    setProfileSaving(false);
    msg(setProfileMsg, res.ok ? "Profile updated!" : "Failed to save.", res.ok);
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confPw) {
      msg(setPwMsg, "Passwords don't match.", false);
      return;
    }
    if (newPw.length < 8) {
      msg(setPwMsg, "Password must be at least 8 characters.", false);
      return;
    }
    setPwSaving(true);
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: curPw, newPassword: newPw }),
    });
    const data = await res.json();
    setPwSaving(false);
    msg(
      setPwMsg,
      res.ok ? "Password updated!" : data.error || "Failed to update.",
      res.ok,
    );
    if (res.ok) {
      setCurPw("");
      setNewPw("");
      setConfPw("");
    }
  };

  const inputStyle = {
    background: "rgba(37,112,245,0.06)",
    border: "1px solid rgba(37,112,245,0.18)",
    color: c1,
  };
  const inputClass =
    "w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/40 transition-all";

  function Msg({ m }: { m: { text: string; ok: boolean } | null }) {
    if (!m) return null;
    return (
      <div
        className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg"
        style={{
          background: m.ok ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)",
          color: m.ok ? "#34d399" : "#f87171",
          border: `1px solid ${m.ok ? "rgba(52,211,153,0.2)" : "rgba(239,68,68,0.2)"}`,
        }}
      >
        {m.ok ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
        {m.text}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Link
          href="/settings"
          className="text-xs hover:opacity-80 transition-opacity"
          style={{ color: c3 }}
        >
          ← Settings
        </Link>
      </div>
      <div className="flex items-center gap-5 mb-8">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
        >
          {(n[0] ?? "U").toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: c1 }}>
            {n}
          </h1>
          <p className="text-sm capitalize" style={{ color: c3 }}>
            {role} · Joined{" "}
            {new Date(joinedAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Profile */}
      <div className="glass-card rounded-2xl p-6 mb-5">
        <div className="flex items-center gap-2 mb-5">
          <User size={14} style={{ color: "#4d8fff" }} />
          <h2
            className="text-base font-semibold font-heading"
            style={{ color: c1 }}
          >
            Profile
          </h2>
        </div>
        <div className="space-y-4">
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
              style={{ color: c3 }}
            >
              Full Name
            </label>
            <input
              className={inputClass}
              style={inputStyle}
              value={n}
              onChange={(e) => setN(e.target.value)}
            />
          </div>
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
              style={{ color: c3 }}
            >
              Email
            </label>
            <input
              className={inputClass}
              style={{ ...inputStyle, opacity: 0.55 }}
              value={email}
              disabled
            />
          </div>
          <Msg m={profileMsg} />
          <button
            onClick={saveProfile}
            disabled={profileSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
          >
            <Save size={13} />
            {profileSaving ? "Saving…" : "Save Profile"}
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Lock size={14} style={{ color: "#4d8fff" }} />
          <h2
            className="text-base font-semibold font-heading"
            style={{ color: c1 }}
          >
            Change Password
          </h2>
        </div>
        <form onSubmit={updatePassword} className="space-y-4">
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
              style={{ color: c3 }}
            >
              Current Password
            </label>
            <input
              type="password"
              className={inputClass}
              style={inputStyle}
              value={curPw}
              onChange={(e) => setCurPw(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
              style={{ color: c3 }}
            >
              New Password
            </label>
            <input
              type="password"
              className={inputClass}
              style={inputStyle}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
              style={{ color: c3 }}
            >
              Confirm New Password
            </label>
            <input
              type="password"
              className={inputClass}
              style={inputStyle}
              value={confPw}
              onChange={(e) => setConfPw(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <Msg m={pwMsg} />
          <button
            type="submit"
            disabled={pwSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
          >
            <Lock size={13} />
            {pwSaving ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
