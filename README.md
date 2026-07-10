# NyxEthos HR Platform

NyxEthos is an HR operations application built with Next.js, Prisma, and NextAuth.

## Core Modules

- Employee directory and profile management
- Time tracking and attendance
- PTO and approval workflows
- Payroll runs and pay stub views
- Benefits and compliance tracking
- Performance management and documents
- Org chart, onboarding, reports, and analytics
- Role-based access controls and audit log support

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Prisma ORM
- NextAuth
- Tailwind CSS

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env.local` (or `.env`) for:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `RESEND_API_KEY` (if email notifications are enabled)
- `BLOB_READ_WRITE_TOKEN` (if file uploads are enabled)

3. Generate Prisma client and apply schema changes:

```bash
npx prisma generate
npx prisma db push
```

4. Start the development server:

```bash
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Notes

- `main` now tracks the HR platform history (from `origin/master`).
- The prior auto-docs state is preserved on `backup/autodocs-before-hr-pivot`.
