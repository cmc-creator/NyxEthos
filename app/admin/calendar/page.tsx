'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import AdminLayout from '@/components/admin/AdminLayout';

type JobStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed';

interface CalendarJob {
  id: string;
  customer: string;
  service: string;
  time: string;
  duration: number; // hours
  status: JobStatus;
  amount: number;
}

const statusConfig: Record<JobStatus, { color: string; bg: string; border: string }> = {
  pending: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  confirmed: { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
  in_progress: { color: 'text-[#e84c1a]', bg: 'bg-[#e84c1a]/10', border: 'border-[#e84c1a]/30' },
  completed: { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' },
};

// Mock schedule data keyed by YYYY-MM-DD
const schedule: Record<string, CalendarJob[]> = {
  '2026-05-09': [
    { id: '1', customer: 'Maria Garcia', service: 'Brake Replacement', time: '9:00 AM', duration: 2, status: 'in_progress', amount: 180 },
  ],
  '2026-05-10': [
    { id: '2', customer: 'John Smith', service: 'Oil Change', time: '10:00 AM', duration: 1, status: 'confirmed', amount: 75 },
    { id: '3', customer: 'David Lee', service: 'AC Recharge', time: '11:30 AM', duration: 1.5, status: 'confirmed', amount: 95 },
  ],
  '2026-05-11': [
    { id: '4', customer: 'Sarah Johnson', service: 'Battery Replacement', time: '2:00 PM', duration: 1, status: 'pending', amount: 140 },
  ],
  '2026-05-12': [
    { id: '5', customer: 'Tom Wilson', service: 'Diagnostics', time: '9:00 AM', duration: 1, status: 'confirmed', amount: 65 },
  ],
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function pad(n: number) { return n.toString().padStart(2, '0'); }

export default function AdminCalendarPage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(
    `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`
  );

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayOfMonth = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const selectedJobs = selectedDay ? (schedule[selectedDay] ?? []) : [];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">Calendar</h1>
        <a
          href="/booking"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#e84c1a] text-white text-sm font-bold hover:bg-[#ff6b35] transition-colors"
        >
          <Plus size={14} />
          Schedule Job
        </a>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar grid */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="w-9 h-9 rounded-xl bg-[#1e3260]/50 flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors">
              <ChevronLeft size={16} />
            </button>
            <h2 className="text-white font-bold">
              {MONTHS[viewMonth]} {viewYear}
            </h2>
            <button onClick={nextMonth} className="w-9 h-9 rounded-xl bg-[#1e3260]/50 flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[#7a8fb5] text-xs font-semibold py-2">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
              const isToday = dateStr === `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
              const isSelected = dateStr === selectedDay;
              const hasJobs = dateStr in schedule;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(dateStr)}
                  className={cn(
                    'aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-semibold transition-all relative',
                    isSelected ? 'bg-[#e84c1a] text-white' :
                    isToday ? 'bg-[#1e3a6e] text-white border border-[#e84c1a]/50' :
                    'text-[#94a3b8] hover:bg-[#1e3260]/50 hover:text-white'
                  )}
                >
                  {day}
                  {hasJobs && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#e84c1a]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day detail */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4">
            {selectedDay
              ? new Date(selectedDay + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
              : 'Select a day'}
          </h3>
          {selectedJobs.length === 0 ? (
            <div className="text-center py-10">
              <Clock className="mx-auto text-[#1e3260] mb-2" size={32} />
              <p className="text-[#7a8fb5] text-sm">No appointments</p>
              <a
                href="/booking"
                className="inline-block mt-3 px-4 py-2 rounded-xl bg-[#e84c1a]/10 border border-[#e84c1a]/30 text-[#e84c1a] text-xs font-bold hover:bg-[#e84c1a]/20 transition-colors"
              >
                + Schedule One
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedJobs.map((job) => {
                const cfg = statusConfig[job.status];
                return (
                  <div key={job.id} className={cn('rounded-xl border p-4', cfg.bg, cfg.border)}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-white font-semibold text-sm">{job.customer}</div>
                        <div className="text-[#94a3b8] text-xs mt-0.5">{job.service}</div>
                      </div>
                      <span className={cn('text-xs font-bold', cfg.color)}>{formatCurrency(job.amount)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-[#7a8fb5]">
                      <Clock size={10} />
                      {job.time} · {job.duration}hr{job.duration !== 1 ? 's' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
