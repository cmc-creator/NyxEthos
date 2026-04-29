'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Wrench,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/jobs', label: 'Jobs', icon: Wrench },
  { href: '/admin/calendar', label: 'Calendar', icon: Calendar },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/invoices', label: 'Invoices', icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#1e3260]/50">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1e3a6e] to-[#e84c1a] flex items-center justify-center text-white font-black text-sm">
            AD
          </div>
          <div>
            <div className="text-white font-black text-sm leading-none">AUTO-DOCS</div>
            <div className="text-[#7a8fb5] text-xs mt-0.5">Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                active
                  ? 'bg-[#e84c1a] text-white'
                  : 'text-[#7a8fb5] hover:text-white hover:bg-[#1e3260]/50'
              )}
            >
              <Icon size={16} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[#1e3260]/50">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#7a8fb5] hover:text-white hover:bg-[#1e3260]/50 transition-all"
        >
          <LogOut size={16} />
          Back to Site
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen hex-pattern flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-[#0a1628]/90 backdrop-blur border-r border-[#1e3260]/50 fixed inset-y-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-50 w-56 h-full bg-[#0a1628] border-r border-[#1e3260]/50 flex flex-col">
            <div className="absolute top-4 right-4">
              <button onClick={() => setSidebarOpen(false)} className="text-[#7a8fb5]">
                <X size={20} />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-56 min-h-screen">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-[#0a1628]/90 backdrop-blur border-b border-[#1e3260]/50">
          <button onClick={() => setSidebarOpen(true)} className="text-[#94a3b8]">
            <Menu size={20} />
          </button>
          <span className="text-white font-bold text-sm">Admin Panel</span>
        </div>
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
