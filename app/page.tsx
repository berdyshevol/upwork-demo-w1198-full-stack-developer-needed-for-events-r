import Link from "next/link";
import { EVENTS, STUDIOS } from "@/lib/seed";
import { formatEventDate, formatMoney } from "@/lib/pricing";
import { GradientPhoto } from "@/components/visuals";

export default function HomePage() {
  const featured = STUDIOS.slice(0, 3);

  return (
    <div className="space-y-16">
      <section className="panel relative overflow-hidden px-5 py-10 sm:px-10 sm:py-14">
        <div
          aria-hidden
          className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-neon-pink/20 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-neon-cyan/15 blur-3xl"
        />
        <div className="relative max-w-2xl">
          <p className="eyebrow">Studios · Events · After-hours</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Midnight Riviera —
            <span className="block bg-riviera-grad bg-clip-text text-transparent">
              recording rooms, bookable by the hour.
            </span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/65 sm:text-lg">
            Six vetted studios across Downtown, Marina Quarter and Harbour Arches. Pick a slot, see
            exactly what the studio takes home and what the platform keeps, and send the request —
            the owner accepts or declines from their own queue.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/studios" className="btn-primary">
              Browse studios
            </Link>
            <Link href="/events" className="btn-ghost">
              See what&apos;s on
            </Link>
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { k: "10%", v: "Platform commission, shown up front" },
              { k: "6", v: "Studios live in the catalogue" },
              { k: "< 60s", v: "Request to owner decision" },
            ].map((s) => (
              <div key={s.k}>
                <dt className="text-2xl font-semibold text-white">{s.k}</dt>
                <dd className="mt-1 text-xs leading-snug text-white/50">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Upcoming events</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">On the strip this month</h2>
          </div>
          <Link href="/events" className="text-sm text-neon-cyan hover:text-white">
            All events →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EVENTS.map((ev) => (
            <article key={ev.id} data-testid="event-card" className="panel panel-hover p-3">
              <GradientPhoto seed={ev.image} caption={ev.venue.split(",")[0]} className="h-36" />
              <div className="px-1.5 pb-1 pt-4">
                <p className="text-xs text-neon-pink">{formatEventDate(ev.date)}</p>
                <h3 className="mt-1.5 text-base font-semibold text-white">{ev.title}</h3>
                <p className="mt-1 text-xs text-white/50">{ev.venue}</p>
                <p className="mt-3 text-sm text-white/70">
                  From <span className="font-semibold text-white">{formatMoney(ev.priceFrom)}</span>
                  <span className="ml-2 text-[11px] text-white/40">display only in this demo</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Featured studios</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Rooms people rebook</h2>
          </div>
          <Link href="/studios" className="text-sm text-neon-cyan hover:text-white">
            All six studios →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((studio) => (
            <Link
              key={studio.id}
              href={`/studios/${studio.slug}`}
              data-testid="featured-studio"
              className="panel panel-hover block p-3"
            >
              <GradientPhoto seed={studio.slug} caption={studio.area} className="h-40" />
              <div className="px-1.5 pb-1 pt-4">
                <h3 className="text-base font-semibold text-white">{studio.name}</h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/50">
                  {studio.description}
                </p>
                <p className="mt-3 text-sm font-semibold text-white">
                  {formatMoney(studio.hourlyRate)}
                  <span className="ml-1 text-xs font-normal text-white/45">/ hour</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
