import Link from "next/link";
import { listBookings } from "@/lib/store";
import { slotById, studioById } from "@/lib/seed";
import { formatMoney, formatSlotLabel } from "@/lib/pricing";
import { decideBookingAction } from "@/app/actions";
import { SimulatedPaymentNotice } from "@/components/site-chrome";
import { StatusBadge } from "@/components/visuals";

export const dynamic = "force-dynamic";
export const metadata = { title: "Studio admin — Midnight Riviera" };

export default async function StudioAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ store?: string }>;
}) {
  const { store } = await searchParams;
  // FR12 — `?store=down` exercises the degraded path the deployed demo would hit
  // if the ephemeral store were lost: seeded data, a banner, no blank screen.
  const degraded = store === "down";
  const bookings = listBookings(degraded);

  const pending = bookings.filter((b) => b.status === "pending");
  const decided = bookings.filter((b) => b.status !== "pending");
  const payout = pending.reduce((sum, b) => sum + b.studioPayout, 0);

  return (
    <div className="space-y-8">
      <header className="max-w-2xl">
        <p className="eyebrow">Studio owner view</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Incoming booking requests
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          Accept to hold the room and release the confirmation email; decline to put the slot back
          on the calendar. No login in this slice — the MVP puts this queue behind studio-owner
          auth.
        </p>
      </header>

      {degraded ? (
        <p
          data-testid="store-banner"
          className="rounded-xl border border-amber-300/30 bg-amber-300/[0.08] px-4 py-3 text-sm text-amber-100"
        >
          <span className="font-semibold">Live store unavailable.</span> Showing the seeded demo
          queue so the page keeps working; accept and decline are paused until the store is back.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="panel p-4">
          <p className="eyebrow">Awaiting decision</p>
          <p className="mt-2 text-2xl font-semibold text-white">{pending.length}</p>
        </div>
        <div className="panel p-4">
          <p className="eyebrow">Payout at stake</p>
          <p className="mt-2 text-2xl font-semibold text-white">{formatMoney(payout)}</p>
        </div>
        <div className="panel p-4">
          <p className="eyebrow">Commission rate</p>
          <p className="mt-2 text-2xl font-semibold text-white">10%</p>
        </div>
      </div>

      <p
        data-testid="ephemeral-notice"
        className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-relaxed text-white/50"
      >
        Bookings live in an ephemeral in-memory store on the server. Two requests are pre-seeded so
        this queue is never empty, and everything resets on redeploy or cold start.
      </p>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Pending queue</h2>
        {pending.length === 0 ? (
          <p className="panel p-6 text-sm text-white/55">
            Nothing waiting. New requests from a studio profile appear here immediately.
          </p>
        ) : (
          <ul className="space-y-3">
            {pending.map((booking) => {
              const studio = studioById(booking.studioId);
              const slot = slotById(booking.slotId);
              return (
                <li key={booking.id} data-testid="admin-row">
                  <div
                    data-testid={`admin-row-${booking.id}`}
                    className="panel flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-semibold text-white">{booking.id}</span>
                        <span data-testid={`status-${booking.id}`}>
                          <StatusBadge status={booking.status} />
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-white/75">
                        {studio?.name} ·{" "}
                        {slot ? formatSlotLabel(slot.startsAt, slot.hours) : "slot removed"}
                      </p>
                      <p className="mt-1 text-xs text-white/45">
                        {booking.customerName} · {booking.customerEmail}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                      <div className="text-sm lg:text-right">
                        <p className="text-white/50">
                          Customer pays{" "}
                          <span className="text-white">{formatMoney(booking.subtotal)}</span>
                        </p>
                        <p className="text-white/50">
                          Your payout{" "}
                          <span className="font-semibold text-emerald-200">
                            {formatMoney(booking.studioPayout)}
                          </span>{" "}
                          <span className="text-[11px] text-white/35">
                            after {formatMoney(booking.platformFee)} commission
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <form action={decideBookingAction}>
                          <input type="hidden" name="bookingId" value={booking.id} />
                          <input type="hidden" name="decision" value="confirmed" />
                          <button
                            type="submit"
                            data-testid={`accept-${booking.id}`}
                            disabled={degraded}
                            className="btn-primary"
                          >
                            Accept
                          </button>
                        </form>
                        <form action={decideBookingAction}>
                          <input type="hidden" name="bookingId" value={booking.id} />
                          <input type="hidden" name="decision" value="declined" />
                          <button
                            type="submit"
                            data-testid={`reject-${booking.id}`}
                            disabled={degraded}
                            className="btn-ghost"
                          >
                            Reject
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Decided</h2>
        {decided.length === 0 ? (
          <p className="panel p-6 text-sm text-white/55">No decisions yet in this session.</p>
        ) : (
          <ul className="space-y-3">
            {decided.map((booking) => {
              const studio = studioById(booking.studioId);
              const slot = slotById(booking.slotId);
              return (
                <li key={booking.id} data-testid="admin-row">
                  <div
                    data-testid={`admin-row-${booking.id}`}
                    className="panel flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-semibold text-white">{booking.id}</span>
                        <span data-testid={`status-${booking.id}`}>
                          <StatusBadge status={booking.status} />
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-white/70">
                        {studio?.name} ·{" "}
                        {slot ? formatSlotLabel(slot.startsAt, slot.hours) : "slot removed"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/50">
                      <span>
                        Payout{" "}
                        <span className="text-white/80">{formatMoney(booking.studioPayout)}</span>
                      </span>
                      <Link href={`/bookings/${booking.id}`} className="text-neon-cyan hover:text-white">
                        Receipt →
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <SimulatedPaymentNotice />
    </div>
  );
}
