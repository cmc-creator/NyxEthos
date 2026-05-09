"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Clock,
  FileCheck,
  LogOut,
  ChevronRight,
} from "lucide-react";
import Logo from "@/components/Logo";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Employees", href: "/employees", icon: Users },
];

const comingSoon = [
  { label: "Payroll", icon: DollarSign },
  { label: "Time & Attendance", icon: Clock },
  { label: "Compliance", icon: FileCheck },
];

export default function AppSidebar({ userName }: { userName?: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col h-screen sticky top-0"
      style={{
        background: "linear-gradient(180deg, rgba(10,24,50,0.99) 0%, rgba(6,14,30,1) 100%)",
        borderRight: "1px solid rgba(37,112,245,0.18)",
      }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b"
        style={{ borderColor: "rgba(37,112,245,0.14)" }}>
        <Link href="/">
          <Logo size="sm" />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-3"
          style={{ color: "rgba(122,159,192,0.55)" }}>
          Platform
        </p>
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={active ? {
                background: "linear-gradient(135deg, rgba(37,112,245,0.25) 0%, rgba(77,143,255,0.12) 100%)",
                color: "#eef5ff",
                border: "1px solid rgba(77,143,255,0.25)",
              } : {
                color: "#7a9fc0",
                border: "1px solid transparent",
              }}
            >
              <Icon size={16} />
              {label}
              {active && <ChevronRight size={13} className="ml-auto opacity-50" />}
            </Link>
          );
        })}

        <div className="pt-5">
          <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-3"
            style={{ color: "rgba(122,159,192,0.55)" }}>
            Coming Soon
          </p>
          {comingSoon.map(({ label, icon: Icon }) => (
            <div key={label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm opacity-40 cursor-not-allowed select-none"
              style={{ color: "#7a9fc0" }}
            >
              <Icon size={16} />
              {label}
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded"
                style={{ background: "rgba(37,112,245,0.15)", color: "#4d8fff" }}>
                Soon
              </span>
            </div>
          ))}
        </div>
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(37,112,245,0.14)" }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1"
          style={{ background: "rgba(37,112,245,0.08)" }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}>
            {(userName?.[0] ?? "U").toUpperCase()}
          </div>
          <span className="text-nyx-text text-sm truncate">{userName || "Account"}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors duration-200 hover:text-nyx-white"
          style={{ color: "#7a9fc0" }}
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
