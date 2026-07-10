import { NextResponse } from 'next/server';
import { requireAdmin } from '@/app/api/admin/_lib/auth';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type BookingRow = {
  id: string;
  customer_id: string | null;
  guest_name: string | null;
  service_name: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_date: string;
  scheduled_time: string;
  total_amount: number;
  estimated_price_max: number | null;
};

export async function GET() {
  const { error, supabase } = await requireAdmin();
  if (error) {
    return error;
  }

  const [bookingsRes, customersRes, invoicesRes] = await Promise.all([
    supabase
      .from('bookings')
      .select('id, customer_id, guest_name, service_name, status, scheduled_date, scheduled_time, total_amount, estimated_price_max')
      .order('scheduled_date', { ascending: false }),
    supabase.from('customers').select('id, first_name, last_name'),
    supabase.from('invoices').select('id, total, status, created_at'),
  ]);

  if (bookingsRes.error || customersRes.error || invoicesRes.error) {
    return NextResponse.json({ error: 'Failed to fetch admin dashboard data' }, { status: 500 });
  }

  const bookings = (bookingsRes.data || []) as BookingRow[];
  const customers = customersRes.data || [];
  const invoices = invoicesRes.data || [];

  const customerMap = new Map(
    customers.map((c) => [c.id, `${c.first_name} ${c.last_name}`.trim()])
  );

  const totalRevenue = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + Number(inv.total || 0), 0);

  const currentMonth = new Date().getMonth();
  const thisMonthRevenue = invoices
    .filter((inv) => inv.status === 'paid' && new Date(inv.created_at).getMonth() === currentMonth)
    .reduce((sum, inv) => sum + Number(inv.total || 0), 0);

  const activeJobs = bookings.filter((b) => ['pending', 'confirmed', 'in_progress'].includes(b.status)).length;
  const completedJobs = bookings.filter((b) => b.status === 'completed').length;

  const revenueByMonth = new Map<number, number>();
  for (let i = 0; i < 6; i += 1) {
    const monthIndex = (currentMonth - (5 - i) + 12) % 12;
    revenueByMonth.set(monthIndex, 0);
  }

  invoices.forEach((inv) => {
    if (inv.status !== 'paid') {
      return;
    }
    const month = new Date(inv.created_at).getMonth();
    if (!revenueByMonth.has(month)) {
      return;
    }
    revenueByMonth.set(month, (revenueByMonth.get(month) || 0) + Number(inv.total || 0));
  });

  const revenueData = Array.from(revenueByMonth.entries()).map(([month, revenue]) => ({
    month: MONTH_LABELS[month],
    revenue,
  }));

  const todayIso = new Date().toISOString().slice(0, 10);

  const recentJobs = bookings.slice(0, 6).map((job) => ({
    id: job.id,
    customer: (job.customer_id && customerMap.get(job.customer_id)) || job.guest_name || 'Guest Customer',
    service: job.service_name,
    status: job.status,
    date: job.scheduled_date,
    amount: job.total_amount || job.estimated_price_max || 0,
  }));

  const todayJobs = bookings
    .filter((job) => job.scheduled_date === todayIso)
    .slice(0, 6)
    .map((job) => ({
      id: job.id,
      time: job.scheduled_time,
      name: (job.customer_id && customerMap.get(job.customer_id)) || job.guest_name || 'Guest Customer',
      service: job.service_name,
      status: job.status,
    }));

  return NextResponse.json({
    stats: {
      thisMonthRevenue,
      activeJobs,
      totalCustomers: customers.length,
      completedJobs,
      totalRevenue,
    },
    revenueData,
    recentJobs,
    todayJobs,
  });
}
