import { InvoiceTemplate } from '@/components/invoice/InvoiceTemplate';

// Minimal print page — white background, no nav  
// Usage: /dashboard/invoices/[id]/print
// Replace mockData with Supabase query using params.id

const mockInvoice = {
  id: '1',
  number: 'AD-029847',
  date: '2026-04-15',
  dueDate: '2026-04-29',
  status: 'paid' as const,
  customer: {
    name: 'John Smith',
    email: 'john@example.com',
    phone: '(602) 555-0101',
    address: '1234 W McDowell Rd, Phoenix, AZ 85007',
  },
  vehicle: { year: '2020', make: 'Honda', model: 'CR-V', vin: '2HKRW2H56LH123456' },
  items: [
    { description: 'Brake Pad Replacement (Front)', qty: 1, unitPrice: 99 },
    { description: 'Labor (2hrs @ $60)', qty: 2, unitPrice: 60 },
  ],
  tax: 8.6,
  notes: 'Rear pads at 40% — recommend replacement in 6 months.',
};

export default function InvoicePrintPage({
  params,
}: {
  params: { id: string };
}) {
  // TODO: Replace with Supabase fetch by params.id
  const invoice = mockInvoice;

  return (
    <html>
      <head>
        <title>Invoice {invoice.number} — Auto-Docs</title>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; background: white; }
          @media print {
            @page { margin: 0.5in; }
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          }
        `}</style>
      </head>
      <body>
        <InvoiceTemplate invoice={invoice} />
        <script
          dangerouslySetInnerHTML={{
            __html: 'window.onload = function() { window.print(); }',
          }}
        />
      </body>
    </html>
  );
}
