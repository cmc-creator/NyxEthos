-- Commercial hardening migration: audit trail, contact intake, and Stripe reconciliation fields.

alter table public.invoices
  add column if not exists stripe_payment_id text;

alter table public.payments
  add column if not exists currency text not null default 'usd';

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.admin_audit_logs enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_audit_logs'
      and policyname = 'Admins can insert audit logs'
  ) then
    create policy "Admins can insert audit logs"
      on public.admin_audit_logs for insert
      with check (
        exists (select 1 from public.admins where user_id = auth.uid())
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_audit_logs'
      and policyname = 'Admins can view audit logs'
  ) then
    create policy "Admins can view audit logs"
      on public.admin_audit_logs for select
      using (
        exists (select 1 from public.admins where user_id = auth.uid())
      );
  end if;
end $$;

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  service_type text not null,
  vehicle text not null,
  message text not null,
  ip_hash text not null,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_submissions_created_at
  on public.contact_submissions(created_at desc);
create index if not exists idx_contact_submissions_ip_hash_created_at
  on public.contact_submissions(ip_hash, created_at desc);

alter table public.contact_submissions enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'contact_submissions'
      and policyname = 'Admins can view contact submissions'
  ) then
    create policy "Admins can view contact submissions"
      on public.contact_submissions for select
      using (
        exists (select 1 from public.admins where user_id = auth.uid())
      );
  end if;
end $$;

create table if not exists public.contact_rate_limits (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_rate_limits_ip_hash_created_at
  on public.contact_rate_limits(ip_hash, created_at desc);

alter table public.contact_rate_limits enable row level security;
