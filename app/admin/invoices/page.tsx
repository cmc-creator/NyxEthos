'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Plus, Download, ChevronDown, CreditCard, Send, Check } from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import AdminLayout from '@/components/admin/AdminLayout';
import { InvoiceTemplate, type InvoiceData } from '@/components/invoice/InvoiceTemplate';

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

const mockInvoices: InvoiceData[] = [
  {
    id: '1', number: 'AD-029847', date: '2026-04-15', dueDate: '2026-04-29', status: 'paid',
    customer: { name: 'John Smith', email: 'john@example.com', phone: '(602) 555-0101', address: '1234 W McDowell Rd, Phoenix, AZ 85007' },
    vehicle: { year: '2020', make: 'Honda', model: 'CR-V', vin: '2HKRW2H56LH123456' },
    items: [
      { description: 'Brake Pad Replacement (Front)', qty: 1, unitPrice: 99 },
      { description: 'Labor (2hrs @ $60)', qty: 2, unitPrice: 60 },
    ],
    tax: 8.6,
    notes: 'Rear pads at 40% — recommend replacement in 6 months.',
  },
  {
    id: '2', number: 'AD-030002', date: '2026-05-09', dueDate: '2026-05-23', status: 'sent',
    customer: { name: 'Maria Garcia', email: 'maria@example.com', phone: '(480) 555-0202', address: '890 E Broadway Rd, Tempe, AZ 85281' },
    vehicle: { year: '2018', make: 'Toyota', model: 'Camry', vin: 'JTNB11HK8J3012345' },
    items: [
      { description: 'Brake Pad Replacement (Front + Rear)', qty: 1, unitPrice: 180 },
    ],
    tax: 8.6,
    notes: '',
  },
  {
    id: '3', number: 'AD-030010', date: '2026-05-10', dueDate: '2026-05-24', status: 'draft',
    customer: { name: 'David Lee', email: 'david@example.com', phone: '(623) 555-0303', address: '5678 W Thomas Rd, Glendale, AZ 85301' },
    vehicle: { year: '2019', make: 'Ford', model: 'F-150', vin: '1FTFW1E51KFC12345' },
    items: [
      { description: 'AC Recharge (R-134a, 1.5lb)', qty: 1, unitPrice: 75 },
      { description: 'AC Performance Check', qty: 1, unitPrice: 20 },
    ],
    tax: 8.6,
    notes: '',
  },
];

const statusConfig: Record<InvoiceStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: 'text-[#94a3b8]', bg: 'bg-[#94a3b8]/10' },
  sent: { label: 'Sent', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  paid: { label: 'Paid', color: 'text-green-400', bg: 'bg-green-400/10' },
  overdue: { label: 'Overdue', color: 'text-red-400', bg: 'bg-red-400/10' },
};

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [expanded, setExpanded] = useState<string | null>(null);

  const markAs = (id: string, newStatus: InvoiceStatus) => {
    setInvoices((prev) => prev.map((inv) => inv.id === id ? { ...inv, status: newStatus } : inv));
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Invoices</h1>
          <p className="text-[#7a8fb5] text-sm mt-0.5">Create, send, and track all customer invoices.</p>
        </div>
        <Link
          href="/admin/invoices/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#e84c1a] text-white text-sm font-bold hover:bg-[#ff6b35] transition-colors"
        >
          <Plus size={14} />
          New Invoice
        </Link>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', value: invoices.length, color: '#94a3b8' },
          { label: 'Draft', value: invoices.filter((i) => i.status === 'draft').length, color: '#94a3b8' },
          { label: 'Sent', value: invoices.filter((i) => i.status === 'sent').length, color: '#3b82f6' },
          { label: 'Paid', value: invoices.filter((i) => i.status === 'paid').length, color: '#10b981' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-black" style={{ color }}>{value}</div>
            <div className="text-[#7a8fb5] text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Invoice list */}
      <div className="space-y-2">
        {invoices.map((inv) => {
          const cfg = statusConfig[inv.status as InvoiceStatus];
          const isOpen = expanded === inv.id;
          const subtotal = inv.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
          const total = subtotal * (1 + inv.tax / 100);

          return (
            <motion.div key={inv.id} layout className="glass-card rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : inv.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#1e3260]/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1e3260]/60 flex items-center justify-center flex-shrink-0">
                  <FileText size={16} className="text-[#94a3b8]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm font-mono">{inv.number}</span>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold', cfg.bg, cfg.color)}>
                      {cfg.label}
                    </span>
                  </div>
                  <div className="text-[#7a8fb5] text-xs mt-0.5">
                    {inv.customer.name} · {inv.vehicle.year} {inv.vehicle.make} {inv.vehicle.model}
                  </div>
                  <div className="text-[#7a8fb5] text-xs">{formatDate(inv.date)} · Due {formatDate(inv.dueDate)}</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-white font-bold">{formatCurrency(total)}</span>
                  <ChevronDown size={15} className={cn('text-[#7a8fb5] transition-transform', isOpen && 'rotate-180')} />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-[#1e3260]/40">
                  {/* Action bar */}
                  <div className="flex items-center gap-2 px-5 py-3 bg-[#080f24]/40 flex-wrap">
                    {inv.status === 'draft' && (
                      <button
                        onClick={() => markAs(inv.id, 'sent')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold hover:bg-blue-500/20 transition-colors"
                      >
                        <Send size={12} /> Mark as Sent
                      </button>
                    )}
                    {(inv.status === 'sent' || inv.status === 'overdue') && (
                      <button
                        onClick={() => markAs(inv.id, 'paid')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold hover:bg-green-500/20 transition-colors"
                      >
                        <Check size={12} /> Mark Paid
                      </button>
                    )}
                    <button
                      onClick={() => window.open(`/admin/invoices/${inv.id}/print`, '_blank')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e3260] text-[#94a3b8] text-xs hover:text-white hover:border-[#e84c1a]/40 transition-colors"
                    >
                      <Download size={12} /> PDF
                    </button>
                  </div>
                  {/* Preview */}
                  <div className="overflow-auto">
                    <div className="origin-top-left scale-75 sm:scale-90 lg:scale-100">
                      <InvoiceTemplate invoice={inv} />
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
