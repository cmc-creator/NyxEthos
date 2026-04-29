'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Invoice } from '@/types';

// Extend the basic Invoice type for display
export interface InvoiceData {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  vehicle: {
    year: string;
    make: string;
    model: string;
    vin: string;
  };
  items: {
    description: string;
    qty: number;
    unitPrice: number;
  }[];
  tax: number; // percentage, e.g. 8.6
  notes?: string;
}

export function InvoiceTemplate({ invoice }: { invoice: InvoiceData }) {
  const subtotal = invoice.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const taxAmount = subtotal * (invoice.tax / 100);
  const total = subtotal + taxAmount;

  const statusColors: Record<string, string> = {
    draft: '#94a3b8',
    sent: '#3b82f6',
    paid: '#10b981',
    overdue: '#ef4444',
  };

  return (
    <div
      id="invoice-print"
      className="bg-white text-gray-800 p-10 max-w-[800px] mx-auto font-sans"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl"
              style={{ background: 'linear-gradient(135deg, #1e3a6e, #0f1e3d)' }}
            >
              AD
            </div>
            <div>
              <div className="font-black text-xl text-gray-900">AUTO-DOCS</div>
              <div className="text-xs text-gray-500 font-medium">Mobile Mechanic</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 leading-relaxed mt-3">
            <div>Arizona Mobile Auto Repair</div>
            <div>Phone: (602) 999-9999</div>
            <div>Email: service@auto-docs.com</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-gray-900 mb-1">INVOICE</div>
          <div className="text-sm font-semibold text-gray-600">{invoice.number}</div>
          <div
            className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ background: statusColors[invoice.status] || '#94a3b8' }}
          >
            {invoice.status.toUpperCase()}
          </div>
          <div className="mt-3 text-xs text-gray-500 space-y-0.5">
            <div><span className="font-medium text-gray-700">Date:</span> {formatDate(invoice.date)}</div>
            <div><span className="font-medium text-gray-700">Due:</span> {formatDate(invoice.dueDate)}</div>
          </div>
        </div>
      </div>

      {/* Bill To / Vehicle */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <div
            className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b"
            style={{ color: '#e84c1a', borderColor: '#e84c1a' }}
          >
            Bill To
          </div>
          <div className="text-sm leading-relaxed text-gray-700">
            <div className="font-semibold text-gray-900">{invoice.customer.name}</div>
            <div>{invoice.customer.email}</div>
            <div>{invoice.customer.phone}</div>
            <div>{invoice.customer.address}</div>
          </div>
        </div>
        <div>
          <div
            className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b"
            style={{ color: '#1e3a6e', borderColor: '#1e3a6e' }}
          >
            Vehicle
          </div>
          <div className="text-sm leading-relaxed text-gray-700">
            <div className="font-semibold text-gray-900">
              {invoice.vehicle.year} {invoice.vehicle.make} {invoice.vehicle.model}
            </div>
            <div className="font-mono text-xs text-gray-500 mt-0.5">VIN: {invoice.vehicle.vin}</div>
          </div>
        </div>
      </div>

      {/* Line items table */}
      <table className="w-full mb-6 text-sm">
        <thead>
          <tr style={{ background: '#080f24', color: 'white' }}>
            <th className="text-left px-4 py-3 rounded-tl-lg font-semibold">Description</th>
            <th className="text-center px-4 py-3 font-semibold w-16">Qty</th>
            <th className="text-right px-4 py-3 font-semibold w-28">Unit Price</th>
            <th className="text-right px-4 py-3 rounded-tr-lg font-semibold w-28">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr
              key={i}
              className="border-b border-gray-100"
              style={{ background: i % 2 === 0 ? '#f9fafb' : 'white' }}
            >
              <td className="px-4 py-3 text-gray-800">{item.description}</td>
              <td className="px-4 py-3 text-center text-gray-600">{item.qty}</td>
              <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(item.unitPrice)}</td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">
                {formatCurrency(item.qty * item.unitPrice)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax ({invoice.tax}%)</span>
            <span>{formatCurrency(taxAmount)}</span>
          </div>
          <div
            className="flex justify-between font-black text-base pt-2 border-t-2 mt-2"
            style={{ borderColor: '#e84c1a', color: '#080f24' }}
          >
            <span>Total Due</span>
            <span style={{ color: '#e84c1a' }}>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Notes + Payment */}
      <div className="grid grid-cols-2 gap-8">
        {invoice.notes && (
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Notes</div>
            <p className="text-xs text-gray-600 leading-relaxed">{invoice.notes}</p>
          </div>
        )}
        <div className={invoice.notes ? '' : 'col-span-2'}>
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Payment</div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Online payment accepted via Stripe. Pay using the link on your customer portal or call us at (602) 999-9999.
            Make checks payable to Auto-Docs Mobile Mechanic.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        className="mt-8 pt-4 border-t text-center text-xs text-gray-400"
        style={{ borderColor: '#e5e7eb' }}
      >
        Thank you for choosing Auto-Docs Mobile Mechanic — Arizona&apos;s Premier Mobile Auto Repair
      </div>
    </div>
  );
}
