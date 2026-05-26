"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Search } from "lucide-react";

const c1 = "#eef5ff";
const c3 = "#7a9fc0";
const border = "rgba(37,112,245,0.12)";

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  userEmail: string | null;
  details: string | null;
  createdAt: string;
}

export default function AuditLogClient({ logs }: { logs: AuditLog[] }) {
  const [search, setSearch] = useState("");

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase();
    return (
      !q ||
      l.action.toLowerCase().includes(q) ||
      l.entityType.toLowerCase().includes(q) ||
      (l.userEmail ?? "").toLowerCase().includes(q) ||
      (l.details ?? "").toLowerCase().includes(q)
    );
  });

  function actionColor(action: string) {
    if (action.startsWith("CREATE")) return "#34d399";
    if (action.startsWith("DELETE") || action.startsWith("REVOKE")) return "#f87171";
    if (action.startsWith("UPDATE") || action.startsWith("APPROVE")) return "#60a5fa";
    if (action.startsWith("REJECT")) return "#fb923c";
    return "#a78bfa";
  }

  function fmt(d: string) {
    return new Date(d).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <Link
          href="/settings"
          className="flex items-center gap-1 text-xs hover:opacity-80 transition-opacity"
          style={{ color: c3 }}
        >
          <ArrowLeft size={13} /> Settings
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(167,139,250,0.15)" }}
        >
          <Shield size={18} style={{ color: "#a78bfa" }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: c1 }}>
            Audit Log
          </h1>
          <p className="text-sm" style={{ color: c3 }}>
            All admin actions across your organization
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: c3 }}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by action, type, user…"
          className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          style={{
            background: "rgba(37,112,245,0.06)",
            border: `1px solid ${border}`,
            color: c1,
          }}
        />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-14 text-center" style={{ color: c3 }}>
            {search ? "No matching log entries." : "No audit events yet."}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["Time", "Action", "Entity", "User", "Details"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: c3 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, i) => (
                <tr
                  key={log.id}
                  style={{
                    borderBottom: i < filtered.length - 1 ? `1px solid ${border}` : undefined,
                  }}
                >
                  <td className="px-5 py-3 text-xs whitespace-nowrap" style={{ color: c3 }}>
                    {fmt(log.createdAt)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-lg"
                      style={{
                        background: `${actionColor(log.action)}18`,
                        color: actionColor(log.action),
                      }}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: c1 }}>
                    <span className="font-medium">{log.entityType}</span>
                    {log.entityId && (
                      <span style={{ color: c3 }}> #{log.entityId.slice(-6)}</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: c3 }}>
                    {log.userEmail ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-xs max-w-xs truncate" style={{ color: c3 }}>
                    {log.details ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs mt-3 text-center" style={{ color: c3 }}>
        Showing {filtered.length} of {logs.length} events
      </p>
    </div>
  );
}
