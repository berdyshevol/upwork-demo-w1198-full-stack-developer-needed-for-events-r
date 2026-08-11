import Link from "next/link";

const NAV = [
  { href: "/studios", label: "Studios" },
  { href: "/events", label: "Events" },
  { href: "/studio-admin", label: "Studio admin" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-900/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="h-6 w-6 rounded-full bg-riviera-grad shadow-glow" aria-hidden />
          <span className="text-sm font-semibold tracking-[0.16em] text-white">
            MIDNIGHT RIVIERA
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-ink-900/60">
      <div className="mx-auto max-w-6xl px-4 py-8 text-xs leading-relaxed text-white/45 sm:px-6">
        <p className="font-medium text-white/70">Midnight Riviera — booking slice demo</p>
        <p className="mt-2 max-w-3xl">
          Vertical slice of the marketplace loop: discovery → slot request → owner decision →
          receipt with commission split. Bookings live in an ephemeral in-memory store and reset on
          redeploy. All payment amounts are simulated — no Stripe call is made and no card details
          are collected anywhere in this demo.
        </p>
      </div>
    </footer>
  );
}

export function SimulatedPaymentNotice({ className = "" }: { className?: string }) {
  return (
    <p
      data-testid="simulated-payment-notice"
      className={`rounded-xl border border-neon-cyan/25 bg-neon-cyan/[0.07] px-3.5 py-2.5 text-xs leading-relaxed text-neon-cyan/90 ${className}`}
    >
      <span className="font-semibold">Simulated payment.</span> No card is collected and no charge
      is made. In the MVP this line is a Stripe Connect PaymentIntent with a 10%{" "}
      <code className="text-neon-cyan">application_fee_amount</code>.
    </p>
  );
}
