import { NextResponse } from 'next/server';
import { requireAdmin } from '@/app/api/admin/_lib/auth';

type BookingRow = {
  id: string;
  customer_id: string | null;
  guest_name: string | null;
  guest_phone: string | null;
  service_name: string;
  vehicle_year: string;
  vehicle_make: string;
  vehicle_model: string;
  address: string;
  city: string;
  zip: string;
  scheduled_date: string;
  scheduled_time: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  total_amount: number;
  estimated_price_max: number | null;
  notes: string | null;
};

export async function GET() {
  const { error, supabase } = await requireAdmin();
  if (error) {
    return error;
  }

  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('id, customer_id, guest_name, guest_phone, service_name, vehicle_year, vehicle_make, vehicle_model, address, city, zip, scheduled_date, scheduled_time, status, total_amount, estimated_price_max, notes')
    .order('scheduled_date', { ascending: false });

  if (bookingsError) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }

  const customerIds = Array.from(
    new Set((bookings || []).map((b: BookingRow) => b.customer_id).filter(Boolean))
  ) as string[];

  let customerMap = new Map<string, { name: string; phone: string }>();
  if (customerIds.length > 0) {
    const { data: customers } = await supabase
      .from('customers')
      .select('id, first_name, last_name, phone')
      .in('id', customerIds);

    customerMap = new Map(
      (customers || []).map((c) => [c.id, { name: `${c.first_name} ${c.last_name}`.trim(), phone: c.phone }])
    );
  }

  const jobs = (bookings || []).map((b: BookingRow) => {
    const linkedCustomer = b.customer_id ? customerMap.get(b.customer_id) : undefined;
    return {
      id: b.id,
      customer: linkedCustomer?.name || b.guest_name || 'Guest Customer',
      phone: linkedCustomer?.phone || b.guest_phone || 'N/A',
      service: b.service_name,
      vehicle: `${b.vehicle_year} ${b.vehicle_make} ${b.vehicle_model}`,
      address: `${b.address}, ${b.city}, ${b.zip}`,
      date: b.scheduled_date,
      time: b.scheduled_time,
      status: b.status,
      amount: b.total_amount || b.estimated_price_max || 0,
      notes: b.notes || '',
    };
  });

  return NextResponse.json({ jobs });
}
