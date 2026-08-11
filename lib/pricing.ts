/** FR6 — the single source of truth for the commission split. */
export const PLATFORM_COMMISSION_RATE = 0.1;

export type PriceBreakdown = {
  hours: number;
  hourlyRate: number;
  subtotal: number;
  platformFee: number;
  studioPayout: number;
  customerTotal: number;
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function priceBreakdown(hourlyRate: number, hours: number): PriceBreakdown {
  const subtotal = round2(hourlyRate * hours);
  const platformFee = round2(subtotal * PLATFORM_COMMISSION_RATE);
  return {
    hours,
    hourlyRate,
    subtotal,
    platformFee,
    studioPayout: round2(subtotal - platformFee),
    // The customer pays the subtotal; the commission comes out of the studio's cut.
    customerTotal: subtotal,
  };
}

export function formatMoney(amount: number): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const SLOT_DATE = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const SLOT_TIME = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});

/** Deterministic UTC label so server and client render identical text. */
export function formatSlotLabel(startsAt: string, hours: number): string {
  const start = new Date(startsAt);
  const end = new Date(start.getTime() + hours * 3600_000);
  return `${SLOT_DATE.format(start)} · ${SLOT_TIME.format(start)}–${SLOT_TIME.format(end)} · ${hours} hrs`;
}

const EVENT_DATE = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export function formatEventDate(date: string): string {
  return EVENT_DATE.format(new Date(date));
}
