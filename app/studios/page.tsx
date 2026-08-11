import { AREAS, PRICE_CEILINGS, STUDIOS } from "@/lib/seed";
import { StudioBrowser } from "./studio-browser";

export const metadata = { title: "Studios — Midnight Riviera" };

export default function StudiosPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-2xl">
        <p className="eyebrow">The catalogue</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Six rooms, three areas, one hourly rate each
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          Every rate below is what the customer pays per hour. The 10% platform commission comes out
          of the studio&apos;s side and is shown in full before you send a request.
        </p>
      </header>

      <StudioBrowser studios={STUDIOS} areas={AREAS} priceCeilings={PRICE_CEILINGS} />
    </div>
  );
}
