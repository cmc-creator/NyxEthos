# NyxEthos (Auto-Docs)

NyxEthos is a Next.js 16 customer and admin portal for a mobile mechanic business.

Core features include:
- Customer registration and login with Supabase Auth
- Booking creation and booking history
- Admin-restricted dashboard and management views
- Invoice and Stripe payment integration (payment intent + webhook)
- Contact intake API with rate limiting and anti-spam tracking
- Admin audit logging for status-changing operations

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Supabase (Auth + Postgres + RLS)
- Stripe
- Tailwind CSS

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Fill in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `CONTACT_RATE_LIMIT_SALT`

4. Apply database migrations:
- Run [supabase/migrations/0001_initial_schema.sql](supabase/migrations/0001_initial_schema.sql)
- Run [supabase/migrations/0002_commercial_hardening.sql](supabase/migrations/0002_commercial_hardening.sql)

If you are bootstrapping manually in the SQL editor, [supabase/schema.sql](supabase/schema.sql) is the canonical full schema snapshot.

5. Start development server:

```bash
npm run dev
```

## Quality Commands

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## CI

GitHub Actions workflow is defined at [.github/workflows/ci.yml](.github/workflows/ci.yml) and runs:
- Lint
- Typecheck
- Test
- Build

## Production Notes

- Route protection is enforced via [proxy.ts](proxy.ts) for customer/admin pages.
- Stripe webhook processing is idempotent via `stripe_webhook_events`.
- Stripe reconciliation endpoint: `POST /api/admin/stripe/reconcile` (admin only).
- Contact form endpoint: `POST /api/contact` with per-IP hourly throttling.
- Admin status updates write audit records to `admin_audit_logs`.
- Ensure Stripe webhook is configured to call `/api/stripe/webhook`.
- Use HTTPS and secure environment variable management in production.
