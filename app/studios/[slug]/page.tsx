import Link from "next/link";
import { notFound } from "next/navigation";
import { STUDIOS, slotsForStudio, studioBySlug } from "@/lib/seed";
import { formatMoney, formatSlotLabel } from "@/lib/pricing";
import { takenSlotIds } from "@/lib/store";
import { GradientPhoto } from "@/components/visuals";
import { BookingForm, type SlotView } from "./booking-form";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return STUDIOS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const studio = studioBySlug(slug);
  return { title: studio ? `${studio.name} — Midnight Riviera` : "Studio — Midnight Riviera" };
}

export default async function StudioProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const studio = studioBySlug(slug);
  if (!studio) notFound();

  const taken = takenSlotIds();
  const slots: SlotView[] = slotsForStudio(studio.id).map((slot) => ({
    id: slot.id,
    hours: slot.hours,
    label: formatSlotLabel(slot.startsAt, slot.hours),
    taken: taken.has(slot.id),
  }));

  return (
    <div className="space-y-8">
      <nav className="text-xs text-white/45">
        <Link href="/studios" className="hover:text-white">
          Studios
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white/70">{studio.name}</span>
      </nav>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p data-testid="studio-area" className="eyebrow">
            {studio.area}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {studio.name}
          </h1>
        </div>
        <p className="text-right">
          <span data-testid="hourly-rate" className="text-3xl font-semibold text-white">
            {formatMoney(studio.hourlyRate)}
          </span>
          <span className="block text-xs text-white/45">per hour, customer price</span>
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {studio.images.map((caption) => (
          <GradientPhoto
            key={caption}
            testId="gallery-image"
            seed={`${studio.slug}-${caption}`}
            caption={caption}
            className="h-40 sm:h-48"
          />
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6">
          <section className="panel p-5">
            <h2 className="text-lg font-semibold text-white">About this room</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/65">{studio.description}</p>
            <p className="mt-4 text-xs text-white/45">
              Location: {studio.area} — exact address is shared with the customer once a request is
              confirmed.
            </p>
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <div className="panel p-5">
              <h2 className="text-sm font-semibold text-white">Amenities</h2>
              <ul data-testid="amenity-list" className="mt-3 space-y-2">
                {studio.amenities.map((a) => (
                  <li key={a} className="flex gap-2 text-sm text-white/65">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-pink" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel p-5">
              <h2 className="text-sm font-semibold text-white">Equipment</h2>
              <ul data-testid="equipment-list" className="mt-3 space-y-2">
                {studio.equipment.map((e) => (
                  <li key={e} className="flex gap-2 text-sm text-white/65">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-cyan" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <BookingForm
            studioId={studio.id}
            studioName={studio.name}
            hourlyRate={studio.hourlyRate}
            slots={slots}
          />
        </div>
      </div>
    </div>
  );
}
