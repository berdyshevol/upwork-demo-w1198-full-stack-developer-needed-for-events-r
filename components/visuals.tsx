/**
 * Photography stand-ins. The demo ships no binary assets: each "photo" is a
 * deterministic neon gradient derived from its caption, so the premium look
 * survives a cold clone with zero external requests.
 */

function hueFor(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return h;
}

export function GradientPhoto({
  seed,
  caption,
  className = "",
  testId,
}: {
  seed: string;
  caption?: string;
  className?: string;
  testId?: string;
}) {
  const h = hueFor(seed);
  const style = {
    backgroundImage: `linear-gradient(135deg, hsl(${h} 85% 22%) 0%, hsl(${(h + 48) % 360} 80% 14%) 45%, hsl(${
      (h + 300) % 360
    } 90% 30%) 100%)`,
  };

  return (
    <div
      data-testid={testId}
      style={style}
      className={`relative isolate overflow-hidden rounded-xl border border-white/10 ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 14px)",
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-10 -right-8 h-32 w-32 rounded-full blur-2xl"
        style={{ background: `hsl(${(h + 180) % 360} 95% 55% / 0.35)` }}
      />
      {caption ? (
        <span className="absolute bottom-2 left-2.5 z-10 text-[10px] uppercase tracking-[0.2em] text-white/70">
          {caption}
        </span>
      ) : null}
    </div>
  );
}

export function StatusBadge({ status }: { status: "pending" | "confirmed" | "declined" }) {
  const styles: Record<string, string> = {
    pending: "border-amber-300/30 bg-amber-300/10 text-amber-200",
    confirmed: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
    declined: "border-rose-300/30 bg-rose-300/10 text-rose-200",
  };
  const label = { pending: "Pending", confirmed: "Confirmed", declined: "Declined" }[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${styles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {label}
    </span>
  );
}
