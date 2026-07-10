import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';

const bookingSchema = z.object({
  service_id: z.string().optional(),
  service_name: z.string().min(1),
  customer: z.object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(7),
  }),
  vehicle: z.object({
    year: z.string().min(4),
    make: z.string().min(1),
    model: z.string().min(1),
    vin: z.string().optional(),
  }),
  scheduled_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  scheduled_time: z.string().min(1),
  address: z.string().min(5),
  city: z.string().min(2),
  zip: z.string().regex(/^\d{5}$/),
  notes: z.string().optional(),
  estimated_price_min: z.number().optional(),
  estimated_price_max: z.number().optional(),
});

async function createSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid booking data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const supabase = await createSupabaseServer();

    // Get or create customer profile for this booking.
    let customerId: string | null = null;
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const { data: createdCustomer, error: upsertErr } = await supabase
          .from('customers')
          .insert({
            user_id: user.id,
            first_name: data.customer.first_name,
            last_name: data.customer.last_name,
            email: data.customer.email,
            phone: data.customer.phone,
          })
          .select('id')
          .single();

        if (upsertErr || !createdCustomer) {
          console.error('Customer upsert error:', upsertErr);
          return NextResponse.json({ error: 'Failed to create customer profile' }, { status: 500 });
        }

        customerId = createdCustomer.id;
      }
    }

    // Guest fallback: use existing customer by email, or create a new guest customer.
    if (!customerId) {
      const { data: byEmail } = await supabase
        .from('customers')
        .select('id')
        .eq('email', data.customer.email)
        .single();

      if (byEmail) {
        customerId = byEmail.id;
      } else {
        // Create a guest customer record
        const { data: newCustomer, error: customerErr } = await supabase
          .from('customers')
          .insert({
            first_name: data.customer.first_name,
            last_name: data.customer.last_name,
            email: data.customer.email,
            phone: data.customer.phone,
            user_id: user?.id ?? null,
          })
          .select('id')
          .single();

        if (customerErr || !newCustomer) {
          console.error('Customer create error:', customerErr);
          return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
        }
        customerId = newCustomer.id;
      }
    }

    // Insert booking
    const parsedServiceId = z.string().uuid().safeParse(data.service_id);

    const { data: booking, error: bookingErr } = await supabase
      .from('bookings')
      .insert({
        customer_id: customerId,
        service_id: parsedServiceId.success ? parsedServiceId.data : null,
        service_name: data.service_name,
        vehicle_year: data.vehicle.year,
        vehicle_make: data.vehicle.make,
        vehicle_model: data.vehicle.model,
        vehicle_vin: data.vehicle.vin ?? null,
        scheduled_date: data.scheduled_date,
        scheduled_time: data.scheduled_time,
        address: data.address,
        city: data.city,
        zip: data.zip,
        notes: data.notes ?? null,
        estimated_price_min: data.estimated_price_min ?? null,
        estimated_price_max: data.estimated_price_max ?? null,
        guest_name: `${data.customer.first_name} ${data.customer.last_name}`.trim(),
        guest_email: data.customer.email,
        guest_phone: data.customer.phone,
        status: 'pending',
      })
      .select('id')
      .single();

    if (bookingErr || !booking) {
      console.error('Booking insert error:', bookingErr);
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }

    return NextResponse.json({ success: true, booking_id: booking.id }, { status: 201 });
  } catch (err) {
    console.error('Booking API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!customer) {
    return NextResponse.json({ bookings: [] });
  }

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('customer_id', customer.id)
    .order('scheduled_date', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }

  return NextResponse.json({ bookings });
}
