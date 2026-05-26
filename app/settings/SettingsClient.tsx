"use client";

import { useState } from "react";
import { Moon, Sun, PanelLeft, LayoutList, Save, User, LogOut, Users, Shield } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useTheme, Theme, LayoutMode } from "@/context/ThemeContext";

interface Props {
  orgName: string;
  orgId: string;
}

const c1 = "#eef5ff";
const c3 = "#7a9fc0";
const border = "rgba(37,112,245,0.12)";

export default function SettingsClient({ orgName, orgId }: Props) {
  const { theme, layout, setTheme, setLayout } = useTheme();
  const [orgN, setOrgN] = useState(orgName);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveOrg = async () => {
    setSaving(true);
    await fetch("/api/account/org", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: orgN }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  function ThemeCard({
    value,
    label,
    desc,
    icon: Icon,
  }: {
    value: Theme;
    label: string;
    desc: string;
    icon: React.ElementType;
  }) {
    const active = theme === value;
    const isDark = value === "dark";
    return (
      <button
        onClick={() => setTheme(value)}
        className="flex-1 relative rounded-2xl p-5 text-left transition-all duration-200"
        style={{
          background: isDark
            ? "linear-gradient(145deg,rgba(22,52,106,0.95),rgba(12,28,62,0.98))"
            : "linear-gradient(145deg,#f0f5ff,#e6f0ff)",
          border: active
            ? "2px solid rgba(77,143,255,0.7)"
            : "2px solid rgba(37,112,245,0.14)",
          boxShadow: active ? "0 0 24px rgba(37,112,245,0.22)" : "none",
          cursor: "pointer",
        }}
      >
        {active && (
          <div
            className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: "#2570f5" }}
          >
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
        )}
        {/* Mini preview */}
        <div
          className="rounded-xl overflow-hidden mb-4"
          style={{
            height: 52,
            background: isDark ? "#060e1e" : "#eef2fb",
            border: "1px solid rgba(37,112,245,0.15)",
          }}
        >
          <div className="flex h-full">
            <div
              className="h-full"
              style={{
                width: 36,
                background: isDark ? "rgba(10,24,50,0.99)" : "#0d1f40",
                flexShrink: 0,
              }}
            />
            <div className="flex-1 p-2 flex flex-col gap-1.5">
              <div
                className="rounded"
                style={{
                  height: 6,
                  width: "60%",
                  background: isDark
                    ? "rgba(37,112,245,0.3)"
                    : "rgba(37,112,245,0.25)",
                }}
              />
              <div
                className="rounded"
                style={{
                  height: 5,
                  width: "40%",
                  background: isDark
                    ? "rgba(37,112,245,0.15)"
                    : "rgba(0,0,0,0.1)",
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <Icon
            size={14}
            style={{ color: isDark ? "#4d8fff" : "#2570f5" }}
          />
          <p
            className="text-sm font-semibold"
            style={{ color: isDark ? c1 : "#0a1628" }}
          >
            {label}
          </p>
        </div>
        <p
          className="text-xs"
          style={{ color: isDark ? c3 : "#546e8a" }}
        >
          {desc}
        </p>
      </button>
    );
  }

  function LayoutCard({
    value,
    label,
    desc,
    sidebarW,
  }: {
    value: LayoutMode;
    label: string;
    desc: string;
    sidebarW: number;
  }) {
    const active = layout === value;
    return (
      <button
        onClick={() => setLayout(value)}
        className="flex-1 relative rounded-2xl p-5 text-left transition-all duration-200"
        style={{
          background:
            "linear-gradient(145deg,rgba(22,52,106,0.95),rgba(12,28,62,0.98))",
          border: active
            ? "2px solid rgba(77,143,255,0.7)"
            : "2px solid rgba(37,112,245,0.14)",
          boxShadow: active ? "0 0 24px rgba(37,112,245,0.22)" : "none",
          cursor: "pointer",
        }}
      >
        {active && (
          <div
            className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: "#2570f5" }}
          >
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
        )}
        {/* Mini preview */}
        <div
          className="rounded-xl overflow-hidden mb-4"
          style={{
            height: 52,
            background: "#060e1e",
            border: "1px solid rgba(37,112,245,0.15)",
          }}
        >
          <div className="flex h-full">
            <div
              className="h-full"
              style={{
                width: sidebarW,
                background: "rgba(10,24,50,0.99)",
                flexShrink: 0,
                transition: "width 0.3s",
              }}
            />
            <div className="flex-1 p-2 flex flex-col gap-1.5">
              <div
                className="rounded"
                style={{
                  height: 6,
                  width: "55%",
                  background: "rgba(37,112,245,0.3)",
                }}
              />
              <div
                className="rounded"
                style={{
                  height: 5,
                  width: "35%",
                  background: "rgba(37,112,245,0.15)",
                }}
              />
            </div>
          </div>
        </div>
        <p className="text-sm font-semibold mb-1" style={{ color: c1 }}>
          {label}
        </p>
        <p className="text-xs" style={{ color: c3 }}>
          {desc}
        </p>
      </button>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1
          className="text-2xl font-bold font-heading"
          style={{ color: c1 }}
        >
          Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: c3 }}>
          Customize your NyxEthos workspace.
        </p>
      </div>

      {/* Appearance */}
      <div className="glass-card rounded-2xl p-6 mb-5">
        <h2
          className="text-base font-semibold font-heading mb-1"
          style={{ color: c1 }}
        >
          Theme
        </h2>
        <p className="text-xs mb-5" style={{ color: c3 }}>
          Choose your color scheme. Applied instantly across the entire app.
        </p>
        <div className="flex gap-4">
          <ThemeCard
            value="dark"
            label="Dark"
            desc="Deep navy — easy on the eyes"
            icon={Moon}
          />
          <ThemeCard
            value="light"
            label="Light"
            desc="Bright, open page background"
            icon={Sun}
          />
        </div>
      </div>

      {/* Layout */}
      <div className="glass-card rounded-2xl p-6 mb-5">
        <h2
          className="text-base font-semibold font-heading mb-1"
          style={{ color: c1 }}
        >
          Sidebar Layout
        </h2>
        <p className="text-xs mb-5" style={{ color: c3 }}>
          Control how the navigation sidebar appears on all pages.
        </p>
        <div className="flex gap-4">
          <LayoutCard
            value="default"
            label="Default"
            desc="Full sidebar with section labels"
            sidebarW={40}
          />
          <LayoutCard
            value="compact"
            label="Compact"
            desc="Icons only — maximizes content area"
            sidebarW={12}
          />
        </div>
      </div>

      {/* Organization */}
      {orgId && (
        <div className="glass-card rounded-2xl p-6 mb-5">
          <h2
            className="text-base font-semibold font-heading mb-1"
            style={{ color: c1 }}
          >
            Organization
          </h2>
          <p className="text-xs mb-5" style={{ color: c3 }}>
            Update your company name displayed throughout the platform.
          </p>
          <label
            className="block text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: c3 }}
          >
            Company Name
          </label>
          <div className="flex gap-3">
            <input
              value={orgN}
              onChange={(e) => setOrgN(e.target.value)}
              className="flex-1 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
              style={{
                background: "rgba(37,112,245,0.06)",
                border: "1px solid rgba(37,112,245,0.18)",
                color: c1,
              }}
            />
            <button
              onClick={saveOrg}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{
                background: saved
                  ? "rgba(52,211,153,0.8)"
                  : "linear-gradient(135deg, #2570f5, #6366f1)",
                minWidth: 88,
              }}
            >
              <Save size={13} />
              {saved ? "Saved!" : saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      )}

      {/* Account quick links */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div
          className="px-6 py-4 border-b"
          style={{ borderColor: border }}
        >
          <h2
            className="text-base font-semibold font-heading"
            style={{ color: c1 }}
          >
            Account
          </h2>
        </div>
        <div>
          <Link
            href="/account"
            className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-blue-500/5"
          >
            <div className="flex items-center gap-3">
              <User size={14} style={{ color: "#4d8fff" }} />
              <span className="text-sm" style={{ color: c1 }}>
                My Account
              </span>
            </div>
            <span className="text-xs" style={{ color: c3 }}>
              Profile &amp; password →
            </span>
          </Link>
          <div style={{ height: 1, background: border }} />
          <Link
            href="/settings/team"
            className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-blue-500/5"
          >
            <div className="flex items-center gap-3">
              <Users size={14} style={{ color: "#34d399" }} />
              <span className="text-sm" style={{ color: c1 }}>
                Team Members
              </span>
            </div>
            <span className="text-xs" style={{ color: c3 }}>
              Invite &amp; manage →
            </span>
          </Link>
          <div style={{ height: 1, background: border }} />
          <Link
            href="/settings/audit"
            className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-blue-500/5"
          >
            <div className="flex items-center gap-3">
              <Shield size={14} style={{ color: "#a78bfa" }} />
              <span className="text-sm" style={{ color: c1 }}>
                Audit Log
              </span>
            </div>
            <span className="text-xs" style={{ color: c3 }}>
              All admin actions →
            </span>
          </Link>
          <div style={{ height: 1, background: border }} />
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center justify-between px-6 py-4 transition-colors hover:bg-red-500/5"
          >
            <div className="flex items-center gap-3">
              <LogOut size={14} style={{ color: "#f87171" }} />
              <span className="text-sm" style={{ color: "#f87171" }}>
                Sign out
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
