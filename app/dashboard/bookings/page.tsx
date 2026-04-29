'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Car,
  Clock,
  Filter,
  ChevronDown,
  MapPin,
  Phone,
  X,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';

const mockBookings = [
  {
    id: '1',
    service: 'Full Synthetic Oil Change',
    status: 'confirmed' as const,
    date: '2026-05-10',
    time: '10:00 AM',
    vehicle: '2020 Honda CR-V',
    vin: '2HKRW2H56LH123456',
    address: '1234 W McDowell Rd, Phoenix, AZ 85007',
    notes: 'Please arrive through the side gate.',
    amount: 75,
  },
  {
    id: '2',
    service: 'Brake Pad Replacement (Front)',
    status: 'completed' as const,
    date: '2026-04-15',
    time: '2:00 PM',
    vehicle: '2020 Honda CR-V',
    vin: '2HKRW2H56LH123456',
    address: '1234 W McDowell Rd, Phoenix, AZ 85007',
    notes: '',
    amount: 120,
  },
  {
    id: '3',
    service: 'AC Recharge & Performance Check',
    status: 'completed' as const,
    date: '2026-03-05',
    time: '9:00 AM',
    vehicle: '2020 Honda CR-V',
    vin: '2HKRW2H56LH123456',
    address: '1234 W McDowell Rd, Phoenix, AZ 85007',
    notes: '',
    amount: 95,
  },
];

type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

const statusConfig: Record<BookingStatus, { label: string; color: string; bg: string; dot: string }> = {
  pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-400/10', dot: 'bg-yellow-400' },
  confirmed: { label: 'Confirmed', color: 'text-blue-400', bg: 'bg-blue-400/10', dot: 'bg-blue-400' },
  in_progress: { label: 'In Progress', color: 'text-[#e84c1a]', bg: 'bg-[#e84c1a]/10', dot: 'bg-[#e84c1a]' },
  completed: { label: 'Completed', color: 'text-green-400', bg: 'bg-green-400/10', dot: 'bg-green-400' },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-400/10', dot: 'bg-red-400' },
};

const filters = ['All', 'Confirmed', 'Completed', 'Pending', 'Cancelled'];

export default function BookingsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = mockBookings.filter((b) =>
    activeFilter === 'All' ? true : statusConfig[b.status].label === activeFilter
  );

  return (
    <div className="min-h-screen hex-pattern">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">My Bookings</h1>
            <p className="text-[#7a8fb5] mt-1">Track and manage all your service appointments.</p>
          </div>
          <Link
            href="/booking"
            className="px-5 py-2.5 rounded-xl bg-[#e84c1a] text-white text-sm font-bold hover:bg-[#ff6b35] transition-colors"
          >
            + Book Service
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-semibold transition-colors',
                activeFilter === f
                  ? 'bg-[#e84c1a] text-white'
                  : 'bg-[#0f1e3d] text-[#7a8fb5] border border-[#1e3260] hover:text-white'
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Bookings list */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Calendar className="mx-auto text-[#7a8fb5] mb-3" size={40} />
              <p className="text-[#7a8fb5]">No bookings found.</p>
              <Link href="/booking" className="mt-4 inline-block px-6 py-2.5 bg-[#e84c1a] text-white rounded-xl text-sm font-bold hover:bg-[#ff6b35] transition-colors">
                Book Now
              </Link>
            </div>
          )}

          {filtered.map((b) => {
            const cfg = statusConfig[b.status];
            const isOpen = expanded === b.id;

            return (
              <motion.div
                key={b.id}
                layout
                className="glass-card rounded-2xl overflow-hidden"
              >
                {/* Card header */}
                <button
                  onClick={() => setExpanded(isOpen ? null : b.id)}
                  className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-[#1e3260]/20 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#1e3260]/60 flex items-center justify-center flex-shrink-0">
                    <Car size={18} className="text-[#94a3b8]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-semibold text-sm">{b.service}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1', cfg.bg, cfg.color)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[#7a8fb5] text-xs">
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {b.date} at {b.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Car size={10} />
                        {b.vehicle}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-white font-bold">{formatCurrency(b.amount)}</span>
                    <ChevronDown
                      size={16}
                      className={cn('text-[#7a8fb5] transition-transform', isOpen && 'rotate-180')}
                    />
                  </div>
                </button>

                {/* Expanded details */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0 border-t border-[#1e3260]/50 grid sm:grid-cols-2 gap-4 mt-0 pt-4">
                        <div className="space-y-3">
                          <div>
                            <span className="text-[#7a8fb5] text-xs uppercase tracking-wider">Address</span>
                            <p className="text-white text-sm mt-1 flex items-start gap-1.5">
                              <MapPin size={13} className="text-[#e84c1a] mt-0.5 flex-shrink-0" />
                              {b.address}
                            </p>
                          </div>
                          {b.notes && (
                            <div>
                              <span className="text-[#7a8fb5] text-xs uppercase tracking-wider">Notes</span>
                              <p className="text-white text-sm mt-1">{b.notes}</p>
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div>
                            <span className="text-[#7a8fb5] text-xs uppercase tracking-wider">Vehicle VIN</span>
                            <p className="text-white text-sm mt-1 font-mono">{b.vin}</p>
                          </div>
                          <div className="flex gap-2 pt-1">
                            {b.status === 'confirmed' && (
                              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-500/40 text-red-400 text-xs hover:bg-red-500/10 transition-colors">
                                <X size={12} />
                                Cancel
                              </button>
                            )}
                            <a
                              href="tel:+16029999999"
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1e3260] text-[#94a3b8] text-xs hover:border-[#e84c1a]/40 hover:text-white transition-colors"
                            >
                              <Phone size={12} />
                              Call Us
                            </a>
                            {b.status === 'completed' && (
                              <Link
                                href="/dashboard/invoices"
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#e84c1a]/10 border border-[#e84c1a]/30 text-[#e84c1a] text-xs hover:bg-[#e84c1a]/20 transition-colors"
                              >
                                View Invoice
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
