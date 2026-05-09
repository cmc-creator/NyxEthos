# NyxEthos

**Premium modular HR software — built by [NyxCollective LLC](https://nyxcollectivellc.com)**

NyxEthos is a high-end HR platform that delivers exactly the tools your team needs, nothing more. Onboarding, payroll, time tracking, compliance, benefits, performance reviews, document management, and PTO — all as independent modules you activate à la carte.

---

## What It Is

NyxEthos is a Next.js 15 marketing and onboarding site for the NyxEthos HR platform. It features:

- **Landing page** — hero, feature modules grid, how-it-works, pricing, and CTA
- **Waitlist / free trial** — modal with API endpoint for lead capture
- **Dashboard setup wizard** — interactive module selection flow
- **Dark luxury design** — deep violet-cast backgrounds, jewel-tone accents (sapphire, amethyst, emerald, gold, ruby), glass morphism, layered glows, and animated gradients

---

## Tech Stack

| Layer       | Choice                              |
|-------------|-------------------------------------|
| Framework   | Next.js 15 (App Router)             |
| Language    | TypeScript                          |
| Styling     | Tailwind CSS 3 + custom utilities   |
| Icons       | Lucide React                        |
| Fonts       | Sora (headings) + Inter (body)      |
| Deploy      | Vercel                              |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.example` to `.env.local` and fill in values as needed:

```bash
cp .env.example .env.local
```

No secrets are required for local development. The waitlist API stores leads in memory by default; connect an email provider (Resend, Loops, etc.) when ready to persist leads.

---

## Project Structure

```
app/
  layout.tsx          Root layout + metadata
  page.tsx            Landing page
  globals.css         Global styles + jewel-tone utility classes
  api/waitlist/       POST endpoint for waitlist sign-ups
  dashboard/          Setup wizard (module selection flow)

components/
  Navbar.tsx
  Hero.tsx
  Modules.tsx
  HowItWorks.tsx
  Pricing.tsx
  CTA.tsx
  Footer.tsx
  Logo.tsx
  WaitlistModal.tsx

context/
  WaitlistContext.tsx  Modal open/close + selected plan state
```

---

## Scripts

| Command         | Description              |
|-----------------|--------------------------|
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

---

## Design System

The design uses a jewel-tone dark palette defined in `tailwind.config.ts`:

| Token                   | Color    | Usage                     |
|-------------------------|----------|---------------------------|
| `nyx-bg`                | `#06070f` | Page background           |
| `nyx-surface`           | `#0a0b1a` | Cards, surfaces           |
| `nyx-blue`              | `#1e5fe8` | Sapphire primary          |
| `nyx-violet`            | `#7c3aed` | Amethyst accent           |
| `nyx-emerald`           | `#047857` | Emerald accent            |
| `nyx-gold`              | `#c9a44a` | Gold highlights           |
| `nyx-ruby`              | `#be123c` | Ruby badges               |

Global utility classes (in `globals.css`):

- `.glass` — frosted glass panel
- `.glass-card` — deep glass card with jewel-tone tint
- `.shine-border` — gradient border via pseudo-element
- `.text-gradient` — sapphire → amethyst text gradient
- `.text-gradient-gold` — gold text gradient
- `.shimmer-text` — animated shimmer across jewel tones
- `.glow-sapphire / .glow-amethyst / .glow-emerald / .glow-gold / .glow-ruby` — drop-shadow glow utilities

---

## License

© 2025 NyxCollective LLC. All rights reserved.
