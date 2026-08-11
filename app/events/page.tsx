import { EVENTS } from "@/lib/seed";
import { formatEventDate, formatMoney } from "@/lib/pricing";
import { GradientPhoto } from "@/components/visuals";

export const metadata = { title: "Events — Midnight Riviera" };

export default function EventsPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-2xl">
        <p className="eyebrow">What&apos;s on</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Upcoming nights on the Riviera
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          Display-only in this slice: ticketing, individual event pages and door lists are part of
          the full MVP, not of this booking demo.
        </p>
      </header>

      <div className="space-y-4">
        {EVENTS.map((ev) => (
          <article
            key={ev.id}
            data-testid="event-card"
            className="panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
          >
            <GradientPhoto
              seed={ev.image}
              caption={ev.venue.split(",")[0]}
              className="h-28 w-full shrink-0 sm:w-48"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-neon-pink">{formatEventDate(ev.date)}</p>
              <h2 className="mt-1.5 text-lg font-semibold text-white">{ev.title}</h2>
              <p className="mt-1 text-sm text-white/55">{ev.venue}</p>
            </div>
            <div className="shrink-0 sm:text-right">
              <p className="text-sm text-white/50">From</p>
              <p className="text-xl font-semibold text-white">{formatMoney(ev.priceFrom)}</p>
              <p className="mt-1 text-[11px] text-white/40">Tickets not sold in this demo</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
