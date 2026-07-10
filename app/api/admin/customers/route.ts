import { NextResponse } from 'next/server';
import { requireAdmin } from '@/app/api/admin/_lib/auth';

type CustomerRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string | null;
  city: string | null;
  zip: string | null;
  created_at: string;
};

export async function GET() {
  const { error, supabase } = await requireAdmin();
  if (error) {
    return error;
  }

  const { data: customers, error: customersError } = await supabase
    .from('customers')
    .select('id, first_name, last_name, email, phone, address, city, zip, created_at')
    .order('created_at', { ascending: false });

  if (customersError) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }

  const { data: bookings } = await supabase
    .from('bookings')
    .select('customer_id, vehicle_year, vehicle_make, vehicle_model, scheduled_date');

  const { data: invoices } = await supabase
    .from('invoices')
    .select('customer_id, total, created_at');

  const bookingCountMap = new Map<string, number>();
  const vehicleMap = new Map<string, Set<string>>();
  const lastServiceMap = new Map<string, string>();

  (bookings || []).forEach((b) => {
    if (!b.customer_id) {
      return;
    }
    bookingCountMap.set(b.customer_id, (bookingCountMap.get(b.customer_id) || 0) + 1);
    const vehicleKey = `${b.vehicle_year} ${b.vehicle_make} ${b.vehicle_model}`;
    if (!vehicleMap.has(b.customer_id)) {
      vehicleMap.set(b.customer_id, new Set());
    }
    vehicleMap.get(b.customer_id)?.add(vehicleKey);
    if (!lastServiceMap.get(b.customer_id) || b.scheduled_date > (lastServiceMap.get(b.customer_id) || '')) {
      lastServiceMap.set(b.customer_id, b.scheduled_date);
    }
  });

  const totalSpentMap = new Map<string, number>();
  (invoices || []).forEach((i) => {
    if (!i.customer_id) {
      return;
    }
    totalSpentMap.set(i.customer_id, (totalSpentMap.get(i.customer_id) || 0) + Number(i.total || 0));
  });

  const result = (customers || []).map((c: CustomerRow) => ({
    id: c.id,
    name: `${c.first_name} ${c.last_name}`.trim(),
    email: c.email,
    phone: c.phone,
    address: [c.address, c.city, c.zip].filter(Boolean).join(', ') || 'N/A',
    vehicles: Array.from(vehicleMap.get(c.id) || []),
    bookings: bookingCountMap.get(c.id) || 0,
    totalSpent: totalSpentMap.get(c.id) || 0,
    joined: c.created_at,
    lastService: lastServiceMap.get(c.id) || c.created_at,
  }));

  return NextResponse.json({ customers: result });
}
