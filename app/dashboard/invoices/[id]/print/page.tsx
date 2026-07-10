import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { InvoiceTemplate } from '@/components/invoice/InvoiceTemplate';

async function createSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}

export default async function InvoicePrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!customer) {
    notFound();
  }

  const { data: row } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .eq('customer_id', customer.id)
    .single();

  if (!row) {
    notFound();
  }

  const mappedItems = (row.items || []).map((item: { description: string; quantity: number; unit_price: number }) => ({
    description: item.description,
    qty: item.quantity,
    unitPrice: item.unit_price,
  }));

  const invoice = {
    id: row.id,
    number: row.invoice_number,
    date: row.created_at,
    dueDate: row.due_date || row.created_at,
    status: row.status === 'cancelled' ? 'draft' : row.status,
    customer: {
      name: row.customer_name || 'Customer',
      email: row.customer_email || 'N/A',
      phone: row.customer_phone || 'N/A',
      address: 'Address on file',
    },
    vehicle: { year: '', make: '', model: '', vin: '' },
    items: mappedItems,
    tax: (row.tax_rate || 0) * 100,
    notes: row.notes || '',
  };

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
