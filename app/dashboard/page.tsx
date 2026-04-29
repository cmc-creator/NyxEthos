'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Calendar,
  FileText,
  Car,
  User,
  LogOut,
  Plus,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bell,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';

// Mock data — replace with Supabase queries
const mockBookings = [
  {
    id: '1',
    service: 'Full Synthetic Oil Change',
    status: 'confirmed' as const,
    date: '2026-05-10',
    time: '10:00 AM',
    vehicle: '2020 Honda CR-V',
    amount: 75,
  },
  {
    id: '2',
    service: 'Brake Pad Replacement (Front)',
    status: 'completed' as const,
    date: '2026-04-15',
    time: '2:00 PM',
    vehicle: '2020 Honda CR-V',
    amount: 120,
  },
];

const mockInvoices = [
  {
    id: '1',
    number: 'AD-029847',
    service: 'Brake Pad Replacement (Front)',
    date: '2026-04-15',
    total: 120,
    status: 'paid' as const,
  },
  {
    id: '2',
    number: 'AD-028130',
    service: 'Full Synthetic Oil Change',
    date: '2026-03-10',
    total: 75,
    status: 'paid' as const,
  },
];

const statusConfig = {
  pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  confirmed: { label: 'Confirmed', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  in_progress: { label: 'In Progress', color: 'text-[#e84c1a]', bg: 'bg-[#e84c1a]/10' },
  completed: { label: 'Completed', color: 'text-green-400', bg: 'bg-green-400/10' },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-400/10' },
  paid: { label: 'Paid', color: 'text-green-400', bg: 'bg-green-400/10' },
  draft: { label: 'Draft', color: 'text-[#94a3b8]', bg: 'bg-[#94a3b8]/10' },
  sent: { label: 'Sent', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  overdue: { label: 'Overdue', color: 'text-red-400', bg: 'bg-red-400/10' },
};

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function DashboardPage() {
  const customerName = 'John'; // Replace with actual auth user

  return (
    <div className="min-h-screen hex-pattern">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Header */}
        <FadeIn className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">
              Hey, {customerName} 👋
            </h1>
            <p className="text-[#7a8fb5] mt-1">Welcome back to your Auto-Docs dashboard.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 rounded-xl bg-[#0f1e3d] border border-[#1e3260] flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#e84c1a]" />
            </button>
            <Link
              href="/booking"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e84c1a] text-white text-sm font-bold hover:bg-[#ff6b35] transition-colors"
            >
              <Plus size={14} />
              New Booking
            </Link>
          </div>
        </FadeIn>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Services', value: '3', icon: Car, color: '#e84c1a' },
            { label: 'Upcoming', value: '1', icon: Calendar, color: '#3b82f6' },
            { label: 'Invoices', value: '2', icon: FileText, color: '#10b981' },
            { label: 'Total Spent', value: '$195', icon: CheckCircle2, color: '#eab308' },
          ].map(({ label, value, icon: Icon, color }, i) => (
            <FadeIn key={label} delay={i * 0.07}>
              <div className="glass-card rounded-2xl p-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${color}20` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <div className="text-2xl font-black text-white mb-0.5">{value}</div>
                <div className="text-[#7a8fb5] text-xs">{label}</div>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <FadeIn delay={0.15}>
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e3260]/50">
                <h2 className="text-white font-bold flex items-center gap-2">
                  <Calendar size={16} className="text-[#e84c1a]" />
                  Bookings
                </h2>
                <Link href="/dashboard/bookings" className="text-xs text-[#e84c1a] flex items-center gap-1 hover:underline">
                  View all <ChevronRight size={12} />
                </Link>
              </div>
              <div className="divide-y divide-[#1e3260]/30">
                {mockBookings.map((b) => {
                  const cfg = statusConfig[b.status];
                  return (
                    <div key={b.id} className="flex items-start gap-4 px-6 py-5">
                      <div className="w-10 h-10 rounded-xl bg-[#1e3260]/60 flex items-center justify-center flex-shrink-0">
                        <Car size={16} className="text-[#94a3b8]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-semibold truncate">{b.service}</div>
                        <div className="text-[#7a8fb5] text-xs mt-0.5">{b.vehicle}</div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold', cfg.bg, cfg.color)}>
                            {cfg.label}
                          </span>
                          <span className="text-[#7a8fb5] text-xs flex items-center gap-1">
                            <Clock size={10} />
                            {b.date} at {b.time}
                          </span>
                        </div>
                      </div>
                      <div className="text-white font-bold text-sm flex-shrink-0">
                        {formatCurrency(b.amount)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>

          {/* Recent Invoices */}
          <FadeIn delay={0.2}>
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e3260]/50">
                <h2 className="text-white font-bold flex items-center gap-2">
                  <FileText size={16} className="text-[#e84c1a]" />
                  Invoices
                </h2>
                <Link href="/dashboard/invoices" className="text-xs text-[#e84c1a] flex items-center gap-1 hover:underline">
                  View all <ChevronRight size={12} />
                </Link>
              </div>
              <div className="divide-y divide-[#1e3260]/30">
                {mockInvoices.map((inv) => {
                  const cfg = statusConfig[inv.status as keyof typeof statusConfig];
                  return (
                    <div key={inv.id} className="flex items-center gap-4 px-6 py-5">
                      <div className="w-10 h-10 rounded-xl bg-[#1e3260]/60 flex items-center justify-center flex-shrink-0">
                        <FileText size={16} className="text-[#94a3b8]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-semibold">{inv.number}</div>
                        <div className="text-[#7a8fb5] text-xs truncate">{inv.service}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold', cfg?.bg, cfg?.color)}>
                            {cfg?.label}
                          </span>
                          <span className="text-[#7a8fb5] text-xs">{formatDate(inv.date)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-white font-bold text-sm">{formatCurrency(inv.total)}</span>
                        <Link
                          href={`/dashboard/invoices/${inv.id}`}
                          className="text-xs px-3 py-1.5 rounded-lg border border-[#1e3260] text-[#94a3b8] hover:text-white hover:border-[#e84c1a]/40 transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Quick Actions */}
        <FadeIn delay={0.25} className="mt-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-white font-bold mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { icon: Plus, label: 'Book a Service', href: '/booking', color: '#e84c1a' },
                { icon: FileText, label: 'View Invoices', href: '/dashboard/invoices', color: '#10b981' },
                { icon: User, label: 'Edit Profile', href: '/dashboard/profile', color: '#6366f1' },
              ].map(({ icon: Icon, label, href, color }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-3 p-4 rounded-xl border border-[#1e3260]/50 hover:border-[#e84c1a]/40 hover:bg-[#0f1e3d] transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <span className="text-[#94a3b8] text-sm font-semibold group-hover:text-white transition-colors">
                    {label}
                  </span>
                  <ChevronRight size={14} className="text-[#4a6090] ml-auto group-hover:text-[#e84c1a] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
