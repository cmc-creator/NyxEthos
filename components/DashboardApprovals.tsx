"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface PendingItem {
  id: string;
  kind: "pto" | "time";
  name: string;
  detail: string;
  sub: string;
}

interface Props {
  items: PendingItem[];
}

export default function DashboardApprovals({ items: initial }: Props) {
  const [items, setItems] = useState(initial);
  const [loading, setLoading] = useState<string | null>(null);

  const act = async (id: string, kind: "pto" | "time", status: "approved" | "rejected") => {
    setLoading(id);
    const url = kind === "pto" ? `/api/pto/${id}` : `/api/time/${id}`;
    await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setItems((prev) => prev.filter((i) => i.id !== id));
    setLoading(null);
  };

  const c1 = "#eef5ff";
  const c3 = "#7a9fc0";

  if (items.length === 0) {
    return (
      <div
        className="flex flex-col items-center gap-2 py-8"
        style={{ color: c3 }}
      >
        <CheckCircle size={28} style={{ opacity: 0.35 }} />
        <p className="text-xs">All caught up — no pending approvals</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ background: "rgba(37,112,245,0.05)" }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background:
                item.kind === "pto"
                  ? "rgba(139,92,246,0.15)"
                  : "rgba(245,158,11,0.15)",
            }}
          >
            <Clock
              size={13}
              style={{ color: item.kind === "pto" ? "#8b5cf6" : "#f59e0b" }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: c1 }}>
              {item.name}
            </p>
            <p className="text-xs truncate" style={{ color: c3 }}>
              {item.detail} · {item.sub}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => act(item.id, item.kind, "approved")}
              disabled={loading === item.id}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-40"
              style={{ background: "rgba(52,211,153,0.18)", color: "#34d399" }}
            >
              <CheckCircle size={11} /> OK
            </button>
            <button
              onClick={() => act(item.id, item.kind, "rejected")}
              disabled={loading === item.id}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
              style={{ background: "rgba(239,68,68,0.12)", color: "#f87171" }}
            >
              <XCircle size={11} /> No
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
