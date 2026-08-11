"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createBooking, decideBooking, isSlotTaken } from "@/lib/store";
import { slotById, studioById } from "@/lib/seed";
import type { BookingDecision } from "@/lib/types";

export type BookingFormState = { error?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** FR5/FR7 — validate, create as `pending`, then send the customer to the receipt. */
export async function requestBookingAction(
  _prev: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  const studioId = String(formData.get("studioId") ?? "");
  const slotId = String(formData.get("slotId") ?? "");
  const customerName = String(formData.get("customerName") ?? "").trim();
  const customerEmail = String(formData.get("customerEmail") ?? "").trim();

  const studio = studioById(studioId);
  if (!studio) return { error: "That studio is no longer listed." };

  if (!slotId) return { error: "Pick an available slot before sending the request." };

  const slot = slotById(slotId);
  if (!slot || slot.studioId !== studio.id) {
    return { error: "That slot is not offered by this studio." };
  }
  if (isSlotTaken(slotId)) {
    return { error: "That slot was just requested by someone else. Pick another one." };
  }
  if (!customerName) return { error: "Add your name so the studio knows who is asking." };
  if (!EMAIL.test(customerEmail)) return { error: "Add a valid email address for the confirmation." };

  const booking = createBooking({ studioId, slotId, customerName, customerEmail });

  revalidatePath(`/studios/${studio.slug}`);
  revalidatePath("/studio-admin");
  redirect(`/bookings/${booking.id}`);
}

/** FR8 — owner decision: pending → confirmed | declined. */
export async function decideBookingAction(formData: FormData): Promise<void> {
  const id = String(formData.get("bookingId") ?? "");
  const decision = String(formData.get("decision") ?? "") as BookingDecision;
  if (decision !== "confirmed" && decision !== "declined") return;

  const booking = decideBooking(id, decision);

  revalidatePath("/studio-admin");
  revalidatePath(`/bookings/${id}`);
  if (booking) {
    const studio = studioById(booking.studioId);
    if (studio) revalidatePath(`/studios/${studio.slug}`);
  }
}
