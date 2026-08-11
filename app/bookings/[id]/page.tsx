import Link from "next/link";
import { notFound } from "next/navigation";
import { getBooking } from "@/lib/store";
import { slotById, studioById } from "@/lib/seed";
import { PLATFORM_COMMISSION_RATE, formatMoney, formatSlotLabel } from "@/lib/pricing";
import { SimulatedPaymentNotice } from "@/components/site-chrome";
import { StatusBadge } from "@/components/visuals";
import type { Booking } from "@/lib/types";

export const dynamic = "force-dynamic";

const HEADLINE: Record<Booking["status"], string> = {
  pending: "Pending studio approval",
  confirmed: "Confirmed — the room is yours",
  declined: "Declined by the studio",
};

const SUBLINE: Record<Booking["status"], string> = {
  pending:
    "The studio owner sees this request in their queue right now. You will be emailed the moment they accept or decline.",
  confirmed:
    "The studio accepted the request and the slot is held. The address and door code are in your confirmation email.",
  declined:
    "The studio could not take this slot. Nothing was charged and the slot has been released back to the calendar.",
};

function notifications(booking: Booking, studioName: string, slotLabel: string) {
  const customer = {
    pending: {
      subject: `We sent your request to ${studioName} — ${booking.id}`,
      body: `Hi ${booking.customerName}, your request for ${slotLabel} at ${studioName} is pending studio approval. Nothing has been charged. We will email you as soon as the studio responds.`,
    },
    confirmed: {
      subject: `Confirmed: ${studioName}, ${slotLabel} — ${booking.id}`,
      body: `Hi ${booking.customerName}, ${studioName} confirmed your booking ${booking.id}. Total ${formatMoney(
        booking.subtotal
      )}, simulated in this demo. Show reference ${booking.id} at the door.`,
    },
    declined: {
      subject: `Declined: ${studioName}, ${slotLabel} — ${booking.id}`,
      body: `Hi ${booking.customerName}, ${studioName} declined booking ${booking.id} for ${slotLabel}. No payment was taken. Three similar rooms are still open for that night.`,
    },
  }[booking.status];

  const studio = {
    pending: {
      subject: `New request — ${slotLabel} (${booking.id})`,
      body: `${booking.customerName} requested ${slotLabel}. Your payout would be ${formatMoney(
        booking.studioPayout
      )} after the ${PLATFORM_COMMISSION_RATE * 100}% platform commission. Accept or decline from your queue.`,
    },
    confirmed: {
      subject: `You confirmed ${booking.id} — ${slotLabel}`,
      body: `Booking ${booking.id} is confirmed. ${booking.customerName} is booked for ${slotLabel}. Payout ${formatMoney(
        booking.studioPayout
      )} would be transferred to your connected account after the session.`,
    },
    declined: {
      subject: `You declined ${booking.id} — ${slotLabel}`,
      body: `Booking ${booking.id} was declined and the slot is available again in your calendar. No payout is scheduled.`,
    },
  }[booking.status];

  return { customer, studio };
}

export default async function BookingReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = getBooking(id);
  if (!booking) notFound();

  const studio = studioById(booking.studioId);
  const slot = slotById(booking.slotId);
  if (!studio || !slot) notFound();

  const slotLabel = formatSlotLabel(slot.startsAt, slot.hours);
  const notes = notifications(booking, studio.name, slotLabel);

  return (
    <div className="space-y-8">
      <header className="panel p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow">Booking receipt</p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {HEADLINE[booking.status]}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
              {SUBLINE[booking.status]}
            </p>
          </div>
          <div className="text-right">
            <span data-testid="booking-status">
              <StatusBadge status={booking.status} />
            </span>
            <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-white/40">Reference</p>
            <p data-testid="booking-ref" className="text-lg font-semibold text-white">
              {booking.id}
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="panel space-y-4 p-5">
          <div>
            <h2 className="text-lg font-semibold text-white">{studio.name}</h2>
            <p className="mt-1 text-sm text-white/55">{studio.area}</p>
            <p className="mt-3 text-sm text-white/80">{slotLabel}</p>
            <p className="mt-1 text-xs text-white/45">
              Booked by {booking.customerName} · {booking.customerEmail}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-ink-900/50 p-4">
            <p className="eyebrow">Price breakdown</p>
            <dl className="mt-2 divide-y divide-white/[0.06]">
              <div className="flex items-baseline justify-between py-1.5">
                <dt className="text-sm text-white/60">
                  Studio time
                  <span className="ml-1.5 text-[11px] text-white/35">
                    {booking.hours} hrs × {formatMoney(studio.hourlyRate)}
                  </span>
                </dt>
                <dd data-testid="subtotal" className="text-sm text-white/85">
                  {formatMoney(booking.subtotal)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between py-1.5">
                <dt className="text-sm text-white/60">
                  Platform commission
                  <span className="ml-1.5 text-[11px] text-white/35">
                    {PLATFORM_COMMISSION_RATE * 100}%
                  </span>
                </dt>
                <dd data-testid="platform-fee" className="text-sm text-white/85">
                  − {formatMoney(booking.platformFee)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between py-1.5">
                <dt className="text-sm text-white/60">Studio payout</dt>
                <dd data-testid="studio-payout" className="text-sm text-white/85">
                  {formatMoney(booking.studioPayout)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between py-1.5">
                <dt className="text-sm font-semibold text-white">Customer total</dt>
                <dd data-testid="customer-total" className="text-base font-semibold text-white">
                  {formatMoney(booking.subtotal)}
                </dd>
              </div>
            </dl>
          </div>

          <SimulatedPaymentNotice />

          <div
            data-testid="stripe-mapping"
            className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs leading-relaxed text-white/55"
          >
            <p className="font-semibold text-white/80">What backs each line in the real MVP</p>
            <ul className="mt-2 space-y-1.5">
              <li>
                <span className="text-white/75">Customer total</span> → Stripe Connect{" "}
                <code className="text-neon-cyan">PaymentIntent</code> on the platform account,
                captured on confirmation.
              </li>
              <li>
                <span className="text-white/75">Platform commission</span> →{" "}
                <code className="text-neon-cyan">application_fee_amount</code> on that
                PaymentIntent.
              </li>
              <li>
                <span className="text-white/75">Studio payout</span> →{" "}
                <code className="text-neon-cyan">transfer_data.destination</code> pointing at the
                studio&apos;s connected account, paid out on Stripe&apos;s schedule.
              </li>
              <li>
                <span className="text-white/75">Decline</span> → PaymentIntent cancelled before
                capture; no charge, no refund fee.
              </li>
            </ul>
          </div>
        </section>

        <section className="panel space-y-4 p-5">
          <div>
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
            <p className="mt-1 text-xs text-white/45">
              Simulated — this demo sends no email or SMS. These are the exact two messages the MVP
              would dispatch for the current status.
            </p>
          </div>

          <article
            data-testid="notification-customer"
            className="rounded-xl border border-white/10 bg-ink-900/50 p-4"
          >
            <p className="eyebrow">To customer</p>
            <p className="mt-2 text-xs text-white/45">To: {booking.customerEmail}</p>
            <p className="mt-1 text-sm font-semibold text-white">{notes.customer.subject}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/60">{notes.customer.body}</p>
          </article>

          <article
            data-testid="notification-studio"
            className="rounded-xl border border-white/10 bg-ink-900/50 p-4"
          >
            <p className="eyebrow">To studio</p>
            <p className="mt-2 text-xs text-white/45">
              To: bookings@{studio.slug.replace(/-/g, "")}.example
            </p>
            <p className="mt-1 text-sm font-semibold text-white">{notes.studio.subject}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/60">{notes.studio.body}</p>
          </article>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link href={`/studios/${studio.slug}`} className="btn-ghost">
              Back to {studio.name}
            </Link>
            <Link href="/studio-admin" className="btn-ghost">
              Open studio admin
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
