"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setItems(data))
      .catch(() => null);
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = items.filter((n) => !n.read).length;

  function markAllRead() {
    fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) })
      .catch(() => null);
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function handleOpen() {
    setOpen((v) => !v);
  }

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={handleOpen}
        aria-label="Notifications"
        style={{
          position: "relative",
          width: 34,
          height: 34,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: open ? "rgba(37,112,245,0.18)" : "rgba(37,112,245,0.08)",
          border: "1px solid rgba(37,112,245,0.18)",
          cursor: "pointer",
          color: "#a0b8d8",
          transition: "all 0.15s",
          flexShrink: 0,
        }}
      >
        <Bell size={15} />
        {unread > 0 && (
          <span
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#ef4444",
              border: "1.5px solid var(--sidebar-from, #0d1829)",
            }}
          />
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 320,
            maxHeight: 420,
            overflowY: "auto",
            borderRadius: 16,
            background: "#0d1829",
            border: "1px solid rgba(37,112,245,0.2)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderBottom: "1px solid rgba(37,112,245,0.12)",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 13, color: "#eef5ff" }}>
              Notifications
              {unread > 0 && (
                <span
                  style={{
                    marginLeft: 8,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "1px 7px",
                    borderRadius: 20,
                    background: "rgba(239,68,68,0.15)",
                    color: "#f87171",
                  }}
                >
                  {unread}
                </span>
              )}
            </span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  fontSize: 11,
                  color: "#4d8fff",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Items */}
          {items.length === 0 ? (
            <div
              style={{
                padding: "32px 16px",
                textAlign: "center",
                fontSize: 12,
                color: "#7a9fc0",
              }}
            >
              <Bell size={24} style={{ margin: "0 auto 8px", opacity: 0.3 }} />
              No notifications yet
            </div>
          ) : (
            items.map((n) => {
              const content = (
                <div
                  key={n.id}
                  style={{
                    padding: "11px 16px",
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    background: n.read ? "transparent" : "rgba(37,112,245,0.06)",
                    borderBottom: "1px solid rgba(37,112,245,0.06)",
                    cursor: n.href ? "pointer" : "default",
                    transition: "background 0.1s",
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: n.read ? "transparent" : "#4d8fff",
                      marginTop: 5,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#eef5ff", margin: 0 }}>
                      {n.title}
                    </p>
                    <p style={{ fontSize: 11, color: "#7a9fc0", margin: "2px 0 0" }}>
                      {n.body}
                    </p>
                    <p style={{ fontSize: 10, color: "#4a6a8a", margin: "3px 0 0" }}>
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                </div>
              );

              return n.href ? (
                <a key={n.id} href={n.href} style={{ textDecoration: "none", display: "block" }}>
                  {content}
                </a>
              ) : (
                <div key={n.id}>{content}</div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
