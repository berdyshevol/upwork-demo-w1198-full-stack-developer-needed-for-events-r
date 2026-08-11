export type Studio = {
  id: string;
  slug: string;
  name: string;
  area: string;
  hourlyRate: number;
  description: string;
  amenities: string[];
  equipment: string[];
  images: string[];
};

export type Slot = {
  id: string;
  studioId: string;
  /** ISO instant, always rendered in UTC so the demo is deterministic. */
  startsAt: string;
  hours: number;
};

export type EventItem = {
  id: string;
  title: string;
  date: string;
  venue: string;
  image: string;
  priceFrom: number;
};

/** FR8 — booking lifecycle as a discriminated union on `status`. */
export type PendingBooking = BookingBase & { status: "pending" };
export type ConfirmedBooking = BookingBase & { status: "confirmed"; decidedAt: string };
export type DeclinedBooking = BookingBase & { status: "declined"; decidedAt: string };

export type BookingBase = {
  id: string;
  studioId: string;
  slotId: string;
  customerName: string;
  customerEmail: string;
  hours: number;
  subtotal: number;
  platformFee: number;
  studioPayout: number;
  createdAt: string;
};

export type Booking = PendingBooking | ConfirmedBooking | DeclinedBooking;
export type BookingStatus = Booking["status"];

export type BookingDecision = Extract<Booking, { decidedAt: string }>["status"];
