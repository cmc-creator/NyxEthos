'use client';

import { motion } from 'framer-motion';
import {
  DollarSign,
  Briefcase,
  Users,
  CheckCircle2,
  TrendingUp,
  Calendar,
  ArrowRight,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import AdminLayout from '@/components/admin/AdminLayout';

const revenueData = [
  { month: 'Jan', revenue: 3200 },
  { month: 'Feb', revenue: 4100 },
  { month: 'Mar', revenue: 3800 },
  { month: 'Apr', revenue: 5200 },
  { month: 'May', revenue: 4700 },
  { month: 'Jun', revenue: 6100 },
];

const recentJobs = [
  { id: '1', customer: 'John Smith', service: 'Oil Change', status: 'completed', date: '2026-05-08', amount: 75 },
  { id: '2', customer: 'Maria Garcia', service: 'Brake Replacement', status: 'in_progress', date: '2026-05-09', amount: 180 },
  { id: '3', customer: 'David Lee', service: 'AC Recharge', status: 'confirmed', date: '2026-05-10', amount: 95 },
  { id: '4', customer: 'Sarah Johnson', service: 'Battery Replacement', status: 'pending', date: '2026-05-11', amount: 140 },
];

type JobStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

const statusConfig: Record<JobStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  confirmed: { label: 'Confirmed', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  in_progress: { label: 'In Progress', color: 'text-[#e84c1a]', bg: 'bg-[#e84c1a]/10' },
  completed: { label: 'Completed', color: 'text-green-400', bg: 'bg-green-400/10' },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-400/10' },
};

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f1e3d] border border-[#1e3260] rounded-xl px-4 py-3 text-sm">
        <div className="text-[#94a3b8] mb-1">{label}</div>
        <div className="text-white font-bold">{formatCurrency(payload[0].value)}</div>
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <FadeIn>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">Dashboard</h1>
            <p className="text-[#7a8fb5] text-sm mt-0.5">Good morning, here&apos;s what&apos;s happening today.</p>
          </div>
          <Link
            href="/admin/jobs"
            className="px-4 py-2 rounded-xl bg-[#e84c1a] text-white text-sm font-bold hover:bg-[#ff6b35] transition-colors"
          >
            + New Job
          </Link>
        </div>
      </FadeIn>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Revenue This Month', value: '$6,100', icon: DollarSign, color: '#e84c1a', change: '+18%' },
          { label: 'Active Jobs', value: '3', icon: Briefcase, color: '#3b82f6', change: '2 today' },
          { label: 'Total Customers', value: '48', icon: Users, color: '#10b981', change: '+4 this week' },
          { label: 'Jobs Completed', value: '127', icon: CheckCircle2, color: '#eab308', change: 'All time' },
        ].map(({ label, value, icon: Icon, color, change }, i) => (
          <FadeIn key={label} delay={i * 0.06}>
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <span className="text-[#7a8fb5] text-xs">{change}</span>
              </div>
              <div className="text-2xl font-black text-white mb-0.5">{value}</div>
              <div className="text-[#7a8fb5] text-xs">{label}</div>
            </div>
          </FadeIn>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <FadeIn delay={0.2} className="lg:col-span-2">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold flex items-center gap-2">
                <TrendingUp size={16} className="text-[#e84c1a]" />
                Revenue Overview
              </h2>
              <span className="text-xs text-[#7a8fb5]">Last 6 months</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e84c1a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e84c1a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3260" />
                <XAxis dataKey="month" tick={{ fill: '#7a8fb5', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#7a8fb5', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#e84c1a" strokeWidth={2} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </FadeIn>

        {/* Today's schedule */}
        <FadeIn delay={0.25}>
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold flex items-center gap-2">
                <Calendar size={16} className="text-[#e84c1a]" />
                Today
              </h2>
              <Link href="/admin/calendar" className="text-xs text-[#e84c1a] flex items-center gap-1 hover:underline">
                View calendar <ArrowRight size={11} />
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { time: '9:00 AM', name: 'Maria Garcia', service: 'Brakes', status: 'in_progress' },
                { time: '11:30 AM', name: 'David Lee', service: 'AC Recharge', status: 'confirmed' },
                { time: '2:00 PM', name: 'Tom Wilson', service: 'Diagnostics', status: 'confirmed' },
              ].map((appt) => {
                const cfg = statusConfig[appt.status as JobStatus];
                return (
                  <div key={appt.time} className="flex items-center gap-3 py-2.5 border-b border-[#1e3260]/30 last:border-0">
                    <div className="w-14 text-[#7a8fb5] text-xs font-mono">{appt.time}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-xs font-semibold truncate">{appt.name}</div>
                      <div className="text-[#7a8fb5] text-xs">{appt.service}</div>
                    </div>
                    <span className={cn('text-xs px-1.5 py-0.5 rounded-md font-semibold', cfg.bg, cfg.color)}>
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Recent jobs table */}
      <FadeIn delay={0.3} className="mt-6">
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e3260]/50">
            <h2 className="text-white font-bold">Recent Jobs</h2>
            <Link href="/admin/jobs" className="text-xs text-[#e84c1a] flex items-center gap-1 hover:underline">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e3260]/50">
                  {['Customer', 'Service', 'Date', 'Status', 'Amount', ''].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-[#7a8fb5] text-xs font-semibold uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e3260]/30">
                {recentJobs.map((job) => {
                  const cfg = statusConfig[job.status as JobStatus];
                  return (
                    <tr key={job.id} className="hover:bg-[#1e3260]/20 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{job.customer}</td>
                      <td className="px-6 py-4 text-[#94a3b8]">{job.service}</td>
                      <td className="px-6 py-4 text-[#7a8fb5]">{formatDate(job.date)}</td>
                      <td className="px-6 py-4">
                        <span className={cn('text-xs px-2 py-1 rounded-full font-semibold', cfg.bg, cfg.color)}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white font-semibold">{formatCurrency(job.amount)}</td>
                      <td className="px-6 py-4">
                        <Link href={`/admin/jobs/${job.id}`} className="text-xs text-[#e84c1a] hover:underline">
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </AdminLayout>
  );
}
