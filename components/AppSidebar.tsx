"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Clock,
  CalendarDays,
  FileText,
  Star,
  Heart,
  FolderOpen,
  LogOut,
  ChevronRight,
  BarChart2,
  GitBranch,
  UserPlus,
  FileBarChart,
  Settings,
} from "lucide-react";
import Logo from "@/components/Logo";
import { useTheme } from "@/context/ThemeContext";

const navSections = [
  {
    heading: "Platform",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Analytics", href: "/analytics", icon: BarChart2 },
      { label: "Employees", href: "/employees", icon: Users },
      { label: "Org Chart", href: "/org-chart", icon: GitBranch },
    ],
  },
  {
    heading: "HR",
    items: [
      { label: "Payroll", href: "/payroll", icon: DollarSign },
      { label: "Time & Attendance", href: "/time", icon: Clock },
      { label: "PTO & Leave", href: "/pto", icon: CalendarDays },
      { label: "Reports", href: "/reports", icon: FileBarChart },
    ],
  },
  {
    heading: "People Ops",
    items: [
      { label: "Onboarding", href: "/onboarding", icon: UserPlus },
      { label: "Performance", href: "/performance", icon: Star },
      { label: "Benefits", href: "/benefits", icon: Heart },
      { label: "Compliance", href: "/compliance", icon: FileText },
      { label: "Documents", href: "/documents", icon: FolderOpen },
    ],
  },
];

export default function AppSidebar({ userName }: { userName?: string | null }) {
  const pathname = usePathname();
  const { layout } = useTheme();
  const compact = layout === "compact";
  const initial = (userName?.[0] ?? "U").toUpperCase();

  return (
    <aside
      style={{
        width: compact ? "56px" : "240px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        background:
          "linear-gradient(180deg, var(--sidebar-from) 0%, var(--sidebar-to) 100%)",
        borderRight: "1px solid var(--sidebar-border)",
        transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: compact ? "center" : "flex-start",
          padding: compact ? "0 14px" : "0 20px",
          borderBottom: "1px solid var(--item-border)",
          flexShrink: 0,
        }}
      >
        {compact ? (
          <Link href="/">
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "linear-gradient(135deg, #2570f5, #6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: 13,
                fontFamily: "Sora, sans-serif",
              }}
            >
              N
            </div>
          </Link>
        ) : (
          <Link href="/">
            <Logo size="sm" />
          </Link>
        )}
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          overflowY: "auto",
          padding: compact ? "14px 6px" : "14px 10px",
        }}
      >
        {navSections.map(({ heading, items }, si) => (
          <div key={heading} style={{ marginBottom: 18 }}>
            {!compact && (
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(122,159,192,0.5)",
                  padding: "0 10px",
                  marginBottom: 4,
                }}
              >
                {heading}
              </p>
            )}
            {compact && si > 0 && (
              <div
                style={{
                  height: 1,
                  background: "rgba(37,112,245,0.12)",
                  margin: "6px 0 10px",
                }}
              />
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {items.map(({ label, href, icon: Icon }) => {
                const active =
                  pathname === href ||
                  (href !== "/dashboard" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    title={compact ? label : undefined}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: compact ? "center" : "flex-start",
                      gap: compact ? 0 : 10,
                      padding: compact ? "9px 0" : "8px 10px",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 500,
                      textDecoration: "none",
                      transition: "all 0.15s",
                      ...(active
                        ? {
                            background:
                              "linear-gradient(135deg,rgba(37,112,245,0.25),rgba(77,143,255,0.12))",
                            color: "#eef5ff",
                            border: "1px solid rgba(77,143,255,0.25)",
                          }
                        : {
                            color: "#7a9fc0",
                            border: "1px solid transparent",
                          }),
                    }}
                  >
                    <Icon size={compact ? 17 : 14} />
                    {!compact && (
                      <span
                        style={{
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {label}
                      </span>
                    )}
                    {!compact && active && (
                      <ChevronRight
                        size={11}
                        style={{ opacity: 0.45, flexShrink: 0 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: Settings, Account, Sign out */}
      <div
        style={{
          padding: compact ? "10px 6px" : "10px",
          borderTop: "1px solid var(--item-border)",
          flexShrink: 0,
        }}
      >
        {/* Settings */}
        <Link
          href="/settings"
          title={compact ? "Settings" : undefined}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: compact ? "center" : "flex-start",
            gap: compact ? 0 : 10,
            padding: compact ? "8px 0" : "8px 10px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 500,
            color: pathname === "/settings" ? "#eef5ff" : "#7a9fc0",
            background:
              pathname === "/settings"
                ? "linear-gradient(135deg,rgba(37,112,245,0.2),rgba(77,143,255,0.1))"
                : "transparent",
            textDecoration: "none",
            transition: "all 0.15s",
            marginBottom: 2,
          }}
        >
          <Settings size={compact ? 17 : 14} />
          {!compact && <span>Settings</span>}
        </Link>

        {/* Account */}
        <Link
          href="/account"
          title={compact ? (userName || "Account") : undefined}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: compact ? "center" : "flex-start",
            gap: compact ? 0 : 10,
            padding: compact ? "6px 0" : "7px 10px",
            borderRadius: 10,
            textDecoration: "none",
            background:
              pathname === "/account"
                ? "rgba(37,112,245,0.12)"
                : "rgba(37,112,245,0.06)",
            transition: "all 0.15s",
            marginBottom: 2,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
              background: "linear-gradient(135deg, #2570f5, #6366f1)",
            }}
          >
            {initial}
          </div>
          {!compact && (
            <span
              style={{
                fontSize: 13,
                color: "#b8cce8",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}
            >
              {userName || "Account"}
            </span>
          )}
        </Link>

        {/* Sign out */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          title={compact ? "Sign out" : undefined}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: compact ? "center" : "flex-start",
            gap: compact ? 0 : 10,
            padding: compact ? "8px 0" : "7px 10px",
            borderRadius: 10,
            fontSize: 13,
            color: "#7a9fc0",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            width: "100%",
            transition: "opacity 0.15s",
          }}
        >
          <LogOut size={compact ? 17 : 14} />
          {!compact && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
