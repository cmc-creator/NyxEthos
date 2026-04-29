'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, ChevronDown, CreditCard, Check } from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import { InvoiceTemplate, type InvoiceData } from '@/components/invoice/InvoiceTemplate';

const mockInvoices: InvoiceData[] = [
  {
    id: '1',
    number: 'AD-029847',
    date: '2026-04-15',
    dueDate: '2026-04-29',
    status: 'paid',
    customer: {
      name: 'John Smith',
      email: 'john@example.com',
      phone: '(602) 555-0101',
      address: '1234 W McDowell Rd, Phoenix, AZ 85007',
    },
    vehicle: { year: '2020', make: 'Honda', model: 'CR-V', vin: '2HKRW2H56LH123456' },
    items: [
      { description: 'Brake Pad Replacement (Front) — OEM Parts', qty: 1, unitPrice: 99 },
      { description: 'Labor — 2hrs', qty: 2, unitPrice: 60 },
    ],
    tax: 8.6,
    notes: 'Rear pads are at ~40% — recommend replacement within 6 months.',
  },
  {
    id: '2',
    number: 'AD-028130',
    date: '2026-03-10',
    dueDate: '2026-03-24',
    status: 'paid',
    customer: {
      name: 'John Smith',
      email: 'john@example.com',
      phone: '(602) 555-0101',
      address: '1234 W McDowell Rd, Phoenix, AZ 85007',
    },
    vehicle: { year: '2020', make: 'Honda', model: 'CR-V', vin: '2HKRW2H56LH123456' },
    items: [
      { description: 'Full Synthetic Oil Change (5W-30, 6qt)', qty: 1, unitPrice: 65 },
      { description: 'Oil Filter', qty: 1, unitPrice: 10 },
    ],
    tax: 8.6,
    notes: '',
  },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: 'text-[#94a3b8]', bg: 'bg-[#94a3b8]/10' },
  sent: { label: 'Sent', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  paid: { label: 'Paid', color: 'text-green-400', bg: 'bg-green-400/10' },
  overdue: { label: 'Overdue', color: 'text-red-400', bg: 'bg-red-400/10' },
};

async function printInvoice(invoiceId: string) {
  // Open the printable invoice in a new tab
  window.open(`/dashboard/invoices/${invoiceId}/print`, '_blank');
}

export default function InvoicesPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="min-h-screen hex-pattern">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">My Invoices</h1>
          <p className="text-[#7a8fb5] mt-1">Download or pay your service invoices here.</p>
        </div>

        {/* Invoices list */}
        <div className="space-y-3">
          {mockInvoices.map((inv) => {
            const cfg = statusConfig[inv.status];
            const isOpen = expanded === inv.id;
            const subtotal = inv.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
            const total = subtotal * (1 + inv.tax / 100);

            return (
              <motion.div key={inv.id} layout className="glass-card rounded-2xl overflow-hidden">
                {/* Row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : inv.id)}
                  className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-[#1e3260]/20 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#1e3260]/60 flex items-center justify-center flex-shrink-0">
                    <FileText size={18} className="text-[#94a3b8]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-bold text-sm font-mono">{inv.number}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold', cfg.bg, cfg.color)}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="text-[#7a8fb5] text-xs mt-0.5">
                      {inv.items.map((i) => i.description).join(', ')}
                    </div>
                    <div className="text-[#7a8fb5] text-xs mt-0.5">{formatDate(inv.date)}</div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-white font-bold">{formatCurrency(total)}</span>
                    <ChevronDown
                      size={16}
                      className={cn('text-[#7a8fb5] transition-transform', isOpen && 'rotate-180')}
                    />
                  </div>
                </button>

                {/* Expanded invoice preview */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-[#1e3260]/50">
                        {/* Action buttons */}
                        <div className="flex items-center gap-3 px-6 py-3 bg-[#080f24]/40">
                          <button
                            onClick={() => printInvoice(inv.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#1e3260] text-[#94a3b8] text-xs font-semibold hover:text-white hover:border-[#e84c1a]/40 transition-colors"
                          >
                            <Download size={13} />
                            Download PDF
                          </button>
                          {inv.status !== 'paid' && (
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#e84c1a] text-white text-xs font-bold hover:bg-[#ff6b35] transition-colors">
                              <CreditCard size={13} />
                              Pay Now
                            </button>
                          )}
                          {inv.status === 'paid' && (
                            <span className="flex items-center gap-1.5 text-green-400 text-xs font-semibold">
                              <Check size={13} />
                              Paid in full
                            </span>
                          )}
                        </div>

                        {/* Invoice preview (light-themed) */}
                        <div className="overflow-auto">
                          <div className="origin-top scale-75 sm:scale-90 lg:scale-100 transform-gpu">
                            <InvoiceTemplate invoice={inv} />
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
