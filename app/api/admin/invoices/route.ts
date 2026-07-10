import { NextResponse } from 'next/server';
import { requireAdmin } from '@/app/api/admin/_lib/auth';

export async function GET() {
  const { error, supabase } = await requireAdmin();
  if (error) {
    return error;
  }

  const { data: invoices, error: invoicesError } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });

  if (invoicesError) {
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }

  const mapped = (invoices || []).map((inv) => ({
    id: inv.id,
    number: inv.invoice_number,
    date: inv.created_at,
    dueDate: inv.due_date || inv.created_at,
    status: inv.status === 'cancelled' ? 'draft' : inv.status,
    customer: {
      name: inv.customer_name || 'Customer',
      email: inv.customer_email || 'N/A',
      phone: inv.customer_phone || 'N/A',
      address: 'Address on file',
    },
    vehicle: { year: '', make: '', model: '', vin: '' },
    items: (inv.items || []).map((item: { description: string; quantity: number; unit_price: number }) => ({
      description: item.description,
      qty: item.quantity,
      unitPrice: item.unit_price,
    })),
    tax: Number(inv.tax_rate || 0) * 100,
    notes: inv.notes || '',
  }));

  return NextResponse.json({ invoices: mapped });
}
