# Midnight Riviera — Studio Booking Slice

A deployable demo prototype of the Midnight Riviera marketplace loop: browse recording studios →
open a profile → request a date/time slot → the studio owner accepts or declines → the booking is
recorded and confirmed with the platform commission split shown on the receipt.

This is a vertical slice of the highest-risk path (discovery + booking state machine + commission
math), dressed in the premium dark nightlife theme. It is a credibility artifact, not the MVP.

## What it demonstrates

- **Discovery** — homepage hero, a display-only "Upcoming Events" strip, and a featured-studio grid.
- **Filtering** — `/studios` lists 6 seeded studios across 3 areas, filterable by area and by max
  hourly price entirely client-side (no reload, no refetch).
- **Studio profile** — `/studios/[slug]` with gallery, description, area, amenities, equipment,
  hourly rate and the studio's own slot list.
- **Commission math** — selecting a slot shows the breakdown live before submission: hours ×
  hourly rate = subtotal, 10% platform commission, studio payout, customer total. The rate lives in
  one exported constant, `PLATFORM_COMMISSION_RATE` in `lib/pricing.ts`.
- **Booking state machine** — a Server Action creates the booking as `pending` with a reference ID
  (`MR-4021`, …) and redirects to `/bookings/[id]`. Status is a TypeScript discriminated union with
  exactly two legal transitions: `pending → confirmed | declined`.
- **Owner queue** — `/studio-admin` lists incoming requests with Accept / Reject, which persist and
  are reflected on the customer's receipt.
- **Simulated notifications** — the receipt renders the two emails (customer + studio) the real MVP
  would dispatch for the current status.
- **No double-booking** — a slot held by a `pending` or `confirmed` booking is struck through and
  no longer selectable.
- **Honest payments** — every amount is labelled simulated. No card entry, no Stripe call. The
  receipt states which Stripe Connect objects would back each line (`PaymentIntent`,
  `application_fee_amount`, `transfer_data.destination`).
- **Degraded-store path** — `/studio-admin?store=down` shows the inline banner and keeps working on
  seeded data instead of erroring or rendering blank.

## Not built (deliberately)

Real Stripe/Connect calls, card entry, payouts, refunds. Auth, sessions, roles. Real email/SMS. Any
database — bookings live in an ephemeral in-memory module singleton and reset on redeploy or cold
start (the UI says so). Studio onboarding, individual event pages, ticketing, uploads, calendar
sync, analytics, AI.

## Stack

Next.js (App Router, latest) with React Server Components for every listing/detail route and Server
Actions for booking creation and the accept/reject decision. TypeScript throughout. Tailwind CSS for
the dark nightlife theme. No database, no external API, no runtime API keys.

## Run locally

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

Production build:

```bash
pnpm build && pnpm start
```

## Tests

Playwright acceptance tests, one `test()` block per PRD acceptance criterion, driving the real UI.

```bash
pnpm exec playwright install --with-deps chromium   # once
pnpm test
```

The suite starts its own dev server. If port 3000 is busy, set `PORT`:

```bash
PORT=3100 pnpm test
```

## Layout

```
app/
  page.tsx                    hero, events strip, featured studios
  studios/page.tsx            grid + client-side area/price filters
  studios/[slug]/page.tsx     profile, gallery, slot picker, live breakdown
  bookings/[id]/page.tsx      receipt, status, simulated notifications, Stripe mapping
  studio-admin/page.tsx       owner queue with Accept / Reject
  actions.ts                  Server Actions: request booking, decide booking
lib/
  seed.ts                     6 studios, ~5 slots each, 3 events (read-only)
  pricing.ts                  PLATFORM_COMMISSION_RATE + breakdown and formatting
  store.ts                    ephemeral in-memory booking store (2 pre-seeded)
  types.ts                    Booking status as a discriminated union
tests/                        Playwright acceptance specs
```
