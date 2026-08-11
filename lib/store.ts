import type { Booking, BookingDecision } from "./types";
import { priceBreakdown } from "./pricing";
import { slotById, studioById } from "./seed";

/**
 * Ephemeral in-memory store (PRD data model): a module singleton pinned to
 * globalThis so it survives dev-server hot reloads. It resets on redeploy or
 * cold start — the UI says so out loud.
 */

type StoreShape = {
  bookings: Map<string, Booking>;
  nextRef: number;
};

const GLOBAL_KEY = Symbol.for("midnight-riviera.store");

type GlobalWithStore = typeof globalThis & { [GLOBAL_KEY]?: StoreShape };

/** Two pre-seeded bookings so /studio-admin is never empty on a cold start. */
function seededBookings(): Booking[] {
  const marina = studioById("st-marina")!;
  const sable = studioById("st-sable")!;
  const marinaSlot = slotById("sl-marina-3")!;
  const sableSlot = slotById("sl-sable-4")!;
  const a = priceBreakdown(marina.hourlyRate, marinaSlot.hours);
  const b = priceBreakdown(sable.hourlyRate, sableSlot.hours);

  return [
    {
      id: "MR-4008",
      studioId: marina.id,
      slotId: marinaSlot.id,
      customerName: "Ines Kovač",
      customerEmail: "ines@lowtidecollective.example",
      hours: marinaSlot.hours,
      subtotal: a.subtotal,
      platformFee: a.platformFee,
      studioPayout: a.studioPayout,
      createdAt: "2026-08-09T11:20:00Z",
      status: "pending",
    },
    {
      id: "MR-4012",
      studioId: sable.id,
      slotId: sableSlot.id,
      customerName: "Odell Bright",
      customerEmail: "odell@brightandsons.example",
      hours: sableSlot.hours,
      subtotal: b.subtotal,
      platformFee: b.platformFee,
      studioPayout: b.studioPayout,
      createdAt: "2026-08-10T08:05:00Z",
      status: "confirmed",
      decidedAt: "2026-08-10T09:41:00Z",
    },
  ];
}

function store(): StoreShape {
  const g = globalThis as GlobalWithStore;
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = {
      bookings: new Map(seededBookings().map((b) => [b.id, b])),
      nextRef: 4021,
    };
  }
  return g[GLOBAL_KEY];
}

/** FR12 — callers can request the degraded path; we then serve seed data only. */
export function listBookings(degraded = false): Booking[] {
  const source = degraded ? seededBookings() : [...store().bookings.values()];
  return source.sort((x, y) => (x.createdAt < y.createdAt ? 1 : -1));
}

export function getBooking(id: string): Booking | undefined {
  return store().bookings.get(id) ?? seededBookings().find((b) => b.id === id);
}

/** FR10 — a slot is taken while a booking for it is pending or confirmed. */
export function takenSlotIds(): Set<string> {
  const taken = new Set<string>();
  for (const b of store().bookings.values()) {
    if (b.status === "pending" || b.status === "confirmed") taken.add(b.slotId);
  }
  return taken;
}

export function isSlotTaken(slotId: string): boolean {
  return takenSlotIds().has(slotId);
}

export type CreateBookingInput = {
  studioId: string;
  slotId: string;
  customerName: string;
  customerEmail: string;
};

export function createBooking(input: CreateBookingInput): Booking {
  const s = store();
  const studio = studioById(input.studioId);
  const slot = slotById(input.slotId);
  if (!studio || !slot || slot.studioId !== studio.id) {
    throw new Error("Unknown studio or slot");
  }
  const price = priceBreakdown(studio.hourlyRate, slot.hours);
  const id = `MR-${s.nextRef++}`;
  const booking: Booking = {
    id,
    studioId: studio.id,
    slotId: slot.id,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    hours: slot.hours,
    subtotal: price.subtotal,
    platformFee: price.platformFee,
    studioPayout: price.studioPayout,
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  s.bookings.set(id, booking);
  return booking;
}

/** FR8 — the only legal transitions are pending → confirmed | declined. */
export function decideBooking(id: string, decision: BookingDecision): Booking | undefined {
  const s = store();
  const current = s.bookings.get(id);
  if (!current || current.status !== "pending") return current;
  const decidedAt = new Date().toISOString();
  const next: Booking =
    decision === "confirmed"
      ? { ...current, status: "confirmed", decidedAt }
      : { ...current, status: "declined", decidedAt };
  s.bookings.set(id, next);
  return next;
}
