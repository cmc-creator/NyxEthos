-- Auto-Docs Mobile Mechanic — Supabase Database Schema
-- Run this in the Supabase SQL editor to set up the database.

-- ─────────────────────────────────────────────
-- ADMINS (must be created before customers so policies can reference it)
-- ─────────────────────────────────────────────
create table if not exists public.admins (
  id       uuid primary key default gen_random_uuid(),
  user_id  uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

alter table public.admins enable row level security;

-- ─────────────────────────────────────────────
-- CUSTOMERS (linked to auth.users)
-- ─────────────────────────────────────────────
create table if not exists public.customers (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  first_name   text not null,
  last_name    text not null,
  phone        text not null,
  address      text,
  city         text,
  zip          text,
  created_at   timestamptz default now() not null
);

alter table public.customers enable row level security;

create policy "Customers can view own profile"
  on public.customers for select
  using (auth.uid() = id);

create policy "Customers can update own profile"
  on public.customers for update
  using (auth.uid() = id);

-- Admins bypass RLS
create policy "Admins can view all customers"
  on public.customers for all
  using (exists (
    select 1 from public.admins where user_id = auth.uid()
  ));

-- ─────────────────────────────────────────────
-- SERVICES
-- ─────────────────────────────────────────────
create table if not exists public.services (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  category         text not null,
  description      text,
  base_price       numeric(10,2) not null,
  duration_minutes int not null default 60,
  is_active        boolean not null default true,
  created_at       timestamptz default now()
);

alter table public.services enable row level security;

create policy "Anyone can view active services"
  on public.services for select
  using (is_active = true);

-- Seed services
insert into public.services (name, category, base_price, duration_minutes, description) values
  ('Conventional Oil Change', 'oil_change', 39, 30, 'Up to 5 qts conventional oil + filter'),
  ('Synthetic Blend Oil Change', 'oil_change', 55, 30, 'Synthetic blend + filter'),
  ('Full Synthetic Oil Change', 'oil_change', 75, 30, 'Full synthetic + filter'),
  ('Front Brake Pad Replacement', 'brakes', 120, 60, 'Pads + hardware, rotors checked'),
  ('Rear Brake Pad Replacement', 'brakes', 110, 60, 'Pads + hardware, rotors checked'),
  ('Front & Rear Brake Pads', 'brakes', 210, 90, 'Both axles'),
  ('Brake Fluid Flush', 'brakes', 90, 30, 'Full system bleed'),
  ('Check Engine Light Scan', 'diagnostics', 65, 30, 'OBD-II scan + code pull'),
  ('Full Vehicle Diagnostic', 'diagnostics', 120, 75, 'All systems'),
  ('Pre-Purchase Inspection', 'diagnostics', 150, 90, 'Full inspection'),
  ('Battery Test', 'battery', 0, 10, 'Load test + CCA check (FREE)'),
  ('Battery Replacement', 'battery', 95, 20, 'New battery installed'),
  ('AC Recharge', 'ac_heating', 85, 45, 'Vacuum, charge to spec'),
  ('AC Performance Check', 'ac_heating', 65, 30, 'Temp, pressure, full inspection'),
  ('Alternator Replacement', 'electrical', 220, 90, 'New alternator + belt check'),
  ('Starter Replacement', 'electrical', 200, 90, 'New starter motor');

-- ─────────────────────────────────────────────
-- BOOKINGS
-- ─────────────────────────────────────────────
create table if not exists public.bookings (
  id               uuid primary key default gen_random_uuid(),
  customer_id      uuid references public.customers(id) on delete set null,
  service_id       uuid references public.services(id),
  status           text not null default 'pending'
                     check (status in ('pending','confirmed','in_progress','completed','cancelled')),
  scheduled_date   date not null,
  scheduled_time   text not null,
  address          text not null,
  city             text not null,
  zip              text not null,
  vehicle_year     text not null,
  vehicle_make     text not null,
  vehicle_model    text not null,
  vehicle_vin      text,
  notes            text,
  total_amount     numeric(10,2) not null default 0,
  -- Guest booking support (no account required)
  guest_name       text,
  guest_email      text,
  guest_phone      text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

alter table public.bookings enable row level security;

create policy "Customers can view own bookings"
  on public.bookings for select
  using (auth.uid() = customer_id);

create policy "Customers can create bookings"
  on public.bookings for insert
  with check (true);

create policy "Admins full access to bookings"
  on public.bookings for all
  using (exists (
    select 1 from public.admins where user_id = auth.uid()
  ));

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bookings_updated_at
  before update on public.bookings
  for each row execute procedure public.update_updated_at();

-- ─────────────────────────────────────────────
-- INVOICES
-- ─────────────────────────────────────────────
create table if not exists public.invoices (
  id              uuid primary key default gen_random_uuid(),
  invoice_number  text not null unique,
  booking_id      uuid references public.bookings(id) on delete set null,
  customer_id     uuid references public.customers(id) on delete set null,
  items           jsonb not null default '[]',
  subtotal        numeric(10,2) not null default 0,
  tax_rate        numeric(5,4) not null default 0.0875, -- 8.75% AZ avg
  tax_amount      numeric(10,2) not null default 0,
  total           numeric(10,2) not null default 0,
  status          text not null default 'draft'
                    check (status in ('draft','sent','paid','overdue','cancelled')),
  due_date        date,
  paid_at         timestamptz,
  notes           text,
  customer_name   text,
  customer_email  text,
  customer_phone  text,
  created_at      timestamptz default now()
);

alter table public.invoices enable row level security;

create policy "Customers can view own invoices"
  on public.invoices for select
  using (auth.uid() = customer_id);

create policy "Admins full access to invoices"
  on public.invoices for all
  using (exists (
    select 1 from public.admins where user_id = auth.uid()
  ));

-- ─────────────────────────────────────────────
-- PAYMENTS
-- ─────────────────────────────────────────────
create table if not exists public.payments (
  id                 uuid primary key default gen_random_uuid(),
  invoice_id         uuid references public.invoices(id) on delete cascade,
  amount             numeric(10,2) not null,
  method             text not null default 'stripe'
                       check (method in ('stripe','cash','venmo','zelle','check')),
  stripe_payment_id  text,
  status             text not null default 'pending'
                       check (status in ('pending','succeeded','failed','refunded')),
  created_at         timestamptz default now()
);

alter table public.payments enable row level security;
