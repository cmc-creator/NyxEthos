'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronDown,
  MapPin,
  Phone,
  Car,
  Clock,
  CheckCircle2,
  XCircle,
  Edit2,
  FileText,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import AdminLayout from '@/components/admin/AdminLayout';

type JobStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

const allJobs = [
  { id: '1', customer: 'John Smith', phone: '(602) 555-0101', service: 'Full Synthetic Oil Change', vehicle: '2020 Honda CR-V', address: '1234 W McDowell Rd, Phoenix', date: '2026-05-10', time: '10:00 AM', status: 'confirmed' as JobStatus, amount: 75, notes: '' },
  { id: '2', customer: 'Maria Garcia', phone: '(480) 555-0202', service: 'Brake Pad Replacement (Front)', vehicle: '2018 Toyota Camry', address: '890 E Broadway Rd, Tempe', date: '2026-05-09', time: '9:00 AM', status: 'in_progress' as JobStatus, amount: 180, notes: 'Customer noted grinding noise' },
  { id: '3', customer: 'David Lee', phone: '(623) 555-0303', service: 'AC Recharge & Performance Check', vehicle: '2019 Ford F-150', address: '5678 W Thomas Rd, Glendale', date: '2026-05-10', time: '11:30 AM', status: 'confirmed' as JobStatus, amount: 95, notes: '' },
  { id: '4', customer: 'Sarah Johnson', phone: '(480) 555-0404', service: 'Battery Replacement & Test', vehicle: '2021 Chevrolet Equinox', address: '3456 S Mill Ave, Tempe', date: '2026-05-11', time: '2:00 PM', status: 'pending' as JobStatus, amount: 140, notes: '' },
  { id: '5', customer: 'Tom Wilson', phone: '(602) 555-0505', service: 'Check Engine Diagnostics', vehicle: '2017 Nissan Altima', address: '7890 N 7th St, Phoenix', date: '2026-05-08', time: '2:00 PM', status: 'completed' as JobStatus, amount: 65, notes: 'P0420 code — catalyst monitor' },
  { id: '6', customer: 'Amy Chen', phone: '(480) 555-0606', service: 'Full Synthetic Oil Change', vehicle: '2022 Subaru Outback', address: '234 N Scottsdale Rd, Scottsdale', date: '2026-05-07', time: '9:30 AM', status: 'completed' as JobStatus, amount: 85, notes: '' },
];

const statusConfig: Record<JobStatus, { label: string; color: string; bg: string; nextStates: JobStatus[] }> = {
  pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-400/10', nextStates: ['confirmed', 'cancelled'] },
  confirmed: { label: 'Confirmed', color: 'text-blue-400', bg: 'bg-blue-400/10', nextStates: ['in_progress', 'cancelled'] },
  in_progress: { label: 'In Progress', color: 'text-[#e84c1a]', bg: 'bg-[#e84c1a]/10', nextStates: ['completed'] },
  completed: { label: 'Completed', color: 'text-green-400', bg: 'bg-green-400/10', nextStates: [] },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-400/10', nextStates: [] },
};

export default function AdminJobsPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | JobStatus>('all');
  const [jobs, setJobs] = useState(allJobs);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = jobs.filter((j) => {
    const matchSearch =
      j.customer.toLowerCase().includes(search.toLowerCase()) ||
      j.service.toLowerCase().includes(search.toLowerCase()) ||
      j.vehicle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || j.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string, newStatus: JobStatus) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j)));
  };

  const filters: { label: string; value: 'all' | JobStatus }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">Jobs</h1>
        <Link
          href="/booking"
          className="px-4 py-2 rounded-xl bg-[#e84c1a] text-white text-sm font-bold hover:bg-[#ff6b35] transition-colors"
        >
          + New Job
        </Link>
      </div>

      {/* Search + filter bar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8fb5]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, service, vehicle…"
            className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#0f1e3d] border border-[#1e3260] text-white text-sm placeholder:text-[#4a6090] focus:outline-none focus:border-[#e84c1a]/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilterStatus(value)}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-semibold transition-colors',
                filterStatus === value
                  ? 'bg-[#e84c1a] text-white'
                  : 'bg-[#0f1e3d] border border-[#1e3260] text-[#7a8fb5] hover:text-white'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="glass-card rounded-2xl p-10 text-center text-[#7a8fb5]">
            No jobs found.
          </div>
        )}
        {filtered.map((job) => {
          const cfg = statusConfig[job.status];
          const isOpen = expanded === job.id;
          return (
            <motion.div key={job.id} layout className="glass-card rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : job.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#1e3260]/20 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-semibold text-sm">{job.customer}</span>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold', cfg.bg, cfg.color)}>
                      {cfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[#7a8fb5] text-xs flex-wrap">
                    <span>{job.service}</span>
                    <span className="text-[#1e3260]">·</span>
                    <span className="flex items-center gap-1"><Car size={10} />{job.vehicle}</span>
                    <span className="text-[#1e3260]">·</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{job.date} {job.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-white font-bold text-sm">{formatCurrency(job.amount)}</span>
                  <ChevronDown
                    size={15}
                    className={cn('text-[#7a8fb5] transition-transform', isOpen && 'rotate-180')}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 border-t border-[#1e3260]/40 pt-4 grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-[#94a3b8]">
                      <Phone size={13} className="text-[#e84c1a] flex-shrink-0" />
                      <a href={`tel:${job.phone}`} className="hover:text-white">{job.phone}</a>
                    </p>
                    <p className="flex items-start gap-2 text-[#94a3b8]">
                      <MapPin size={13} className="text-[#e84c1a] flex-shrink-0 mt-0.5" />
                      {job.address}
                    </p>
                    {job.notes && (
                      <p className="text-[#7a8fb5] text-xs italic">Note: {job.notes}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    {cfg.nextStates.length > 0 && (
                      <div>
                        <span className="text-[#7a8fb5] text-xs mb-1 block">Update Status</span>
                        <div className="flex gap-2 flex-wrap">
                          {cfg.nextStates.map((state) => (
                            <button
                              key={state}
                              onClick={() => updateStatus(job.id, state)}
                              className={cn(
                                'px-3 py-1.5 rounded-lg text-xs font-bold transition-colors',
                                statusConfig[state].bg,
                                statusConfig[state].color,
                                'border border-current/20 hover:opacity-80'
                              )}
                            >
                              → {statusConfig[state].label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Link
                        href={`/admin/invoices/new?job=${job.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e3260] text-[#94a3b8] text-xs hover:text-white hover:border-[#e84c1a]/40 transition-colors"
                      >
                        <FileText size={12} />
                        Create Invoice
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
