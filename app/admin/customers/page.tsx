'use client';

import { useState } from 'react';
import { Search, Users, Phone, Mail, Car, ChevronDown } from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import AdminLayout from '@/components/admin/AdminLayout';

const customers = [
  {
    id: '1', name: 'John Smith', email: 'john@example.com', phone: '(602) 555-0101',
    address: '1234 W McDowell Rd, Phoenix, AZ 85007', vehicles: ['2020 Honda CR-V'],
    bookings: 3, totalSpent: 350, joined: '2026-01-15', lastService: '2026-05-10',
  },
  {
    id: '2', name: 'Maria Garcia', email: 'maria@example.com', phone: '(480) 555-0202',
    address: '890 E Broadway Rd, Tempe, AZ 85281', vehicles: ['2018 Toyota Camry', '2015 Honda Civic'],
    bookings: 5, totalSpent: 620, joined: '2025-11-02', lastService: '2026-05-09',
  },
  {
    id: '3', name: 'David Lee', email: 'david@example.com', phone: '(623) 555-0303',
    address: '5678 W Thomas Rd, Glendale, AZ 85301', vehicles: ['2019 Ford F-150'],
    bookings: 2, totalSpent: 190, joined: '2026-02-20', lastService: '2026-05-10',
  },
  {
    id: '4', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '(480) 555-0404',
    address: '3456 S Mill Ave, Tempe, AZ 85281', vehicles: ['2021 Chevrolet Equinox'],
    bookings: 1, totalSpent: 140, joined: '2026-04-30', lastService: '2026-05-11',
  },
  {
    id: '5', name: 'Tom Wilson', email: 'tom@example.com', phone: '(602) 555-0505',
    address: '7890 N 7th St, Phoenix, AZ 85014', vehicles: ['2017 Nissan Altima'],
    bookings: 4, totalSpent: 380, joined: '2025-09-10', lastService: '2026-05-08',
  },
];

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Customers</h1>
          <p className="text-[#7a8fb5] text-sm mt-0.5">{customers.length} total customers</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8fb5]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone…"
          className="w-full max-w-md pl-8 pr-4 py-2.5 rounded-xl bg-[#0f1e3d] border border-[#1e3260] text-white text-sm placeholder:text-[#4a6090] focus:outline-none focus:border-[#e84c1a]/50"
        />
      </div>

      {/* Customer cards */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="glass-card rounded-2xl p-10 text-center text-[#7a8fb5]">No customers found.</div>
        )}
        {filtered.map((c) => {
          const isOpen = expanded === c.id;
          return (
            <div key={c.id} className="glass-card rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : c.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#1e3260]/20 transition-colors"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1e3a6e] to-[#e84c1a] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {c.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm">{c.name}</div>
                  <div className="text-[#7a8fb5] text-xs mt-0.5">{c.email}</div>
                </div>
                <div className="hidden sm:flex items-center gap-6 text-xs text-[#7a8fb5] flex-shrink-0">
                  <span>{c.bookings} bookings</span>
                  <span className="text-white font-bold">{formatCurrency(c.totalSpent)}</span>
                </div>
                <ChevronDown
                  size={15}
                  className={cn('text-[#7a8fb5] flex-shrink-0 transition-transform ml-2', isOpen && 'rotate-180')}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 border-t border-[#1e3260]/40 pt-4 grid sm:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="text-[#7a8fb5] text-xs uppercase tracking-wider mb-1">Contact</div>
                    <p className="flex items-center gap-2 text-[#94a3b8]">
                      <Phone size={12} className="text-[#e84c1a]" />
                      <a href={`tel:${c.phone}`} className="hover:text-white">{c.phone}</a>
                    </p>
                    <p className="flex items-center gap-2 text-[#94a3b8]">
                      <Mail size={12} className="text-[#e84c1a]" />
                      <a href={`mailto:${c.email}`} className="hover:text-white truncate">{c.email}</a>
                    </p>
                    <p className="text-[#7a8fb5] text-xs">{c.address}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[#7a8fb5] text-xs uppercase tracking-wider mb-1">Vehicles</div>
                    {c.vehicles.map((v) => (
                      <p key={v} className="flex items-center gap-2 text-[#94a3b8] text-xs">
                        <Car size={12} className="text-[#e84c1a]" />
                        {v}
                      </p>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <div className="text-[#7a8fb5] text-xs uppercase tracking-wider mb-1">History</div>
                    <p className="text-xs text-[#94a3b8]">
                      <span className="text-[#7a8fb5]">Customer since:</span> {formatDate(c.joined)}
                    </p>
                    <p className="text-xs text-[#94a3b8]">
                      <span className="text-[#7a8fb5]">Last service:</span> {formatDate(c.lastService)}
                    </p>
                    <p className="text-xs text-[#94a3b8]">
                      <span className="text-[#7a8fb5]">Total bookings:</span> {c.bookings}
                    </p>
                    <p className="text-xs text-white font-bold mt-1">
                      Lifetime: {formatCurrency(c.totalSpent)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
