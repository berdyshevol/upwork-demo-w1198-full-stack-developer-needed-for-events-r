"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { requestBookingAction, type BookingFormState } from "@/app/actions";
import { PLATFORM_COMMISSION_RATE, formatMoney, priceBreakdown } from "@/lib/pricing";
import { SimulatedPaymentNotice } from "@/components/site-chrome";

export type SlotView = { id: string; label: string; hours: number; taken: boolean };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full" disabled={pending}>
      {pending ? "Sending request…" : "Request this slot"}
    </button>
  );
}

function Row({
  label,
  value,
  testId,
  hint,
  emphasis = false,
}: {
  label: string;
  value: string;
  testId: string;
  hint?: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <span className={emphasis ? "text-sm font-semibold text-white" : "text-sm text-white/60"}>
        {label}
        {hint ? <span className="ml-1.5 text-[11px] text-white/35">{hint}</span> : null}
      </span>
      <span
        data-testid={testId}
        className={emphasis ? "text-base font-semibold text-white" : "text-sm text-white/85"}
      >
        {value}
      </span>
    </div>
  );
}

/** FR5 + FR6 — slot picker with a live commission breakdown. */
export function BookingForm({
  studioId,
  studioName,
  hourlyRate,
  slots,
}: {
  studioId: string;
  studioName: string;
  hourlyRate: number;
  slots: SlotView[];
}) {
  const available = slots.filter((s) => !s.taken);
  const [selectedId, setSelectedId] = useState<string>("");
  const [state, formAction] = useActionState<BookingFormState, FormData>(requestBookingAction, {});

  const selected = available.find((s) => s.id === selectedId);
  const price = selected ? priceBreakdown(hourlyRate, selected.hours) : null;
  const dash = "—";

  return (
    <form action={formAction} className="panel space-y-5 p-5" data-testid="booking-form">
      <input type="hidden" name="studioId" value={studioId} />
      <input type="hidden" name="slotId" value={selectedId} />

      <div>
        <h2 className="text-lg font-semibold text-white">Request a slot</h2>
        <p className="mt-1 text-xs text-white/50">
          {studioName} · {formatMoney(hourlyRate)} per hour
        </p>
      </div>

      <div data-testid="slots-panel" className="space-y-2">
        <p className="eyebrow">Available slots</p>
        {available.length === 0 ? (
          <p className="text-sm text-white/55">
            Every seeded slot for this room is currently held by a pending or confirmed booking.
          </p>
        ) : (
          <div className="grid gap-2">
            {available.map((slot) => {
              const active = slot.id === selectedId;
              return (
                <button
                  key={slot.id}
                  type="button"
                  data-testid="slot-option"
                  data-slot-id={slot.id}
                  data-hours={slot.hours}
                  aria-pressed={active}
                  onClick={() => setSelectedId(slot.id)}
                  className={`rounded-xl border px-3.5 py-2.5 text-left text-sm transition ${
                    active
                      ? "border-neon-pink/60 bg-neon-pink/10 text-white shadow-glow"
                      : "border-white/10 bg-white/[0.03] text-white/75 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {slot.label}
                </button>
              );
            })}
          </div>
        )}

        {slots.some((s) => s.taken) ? (
          <ul className="space-y-1.5 pt-2">
            {slots
              .filter((s) => s.taken)
              .map((slot) => (
                <li
                  key={slot.id}
                  data-testid="slot-taken"
                  className="rounded-xl border border-white/[0.06] bg-white/[0.015] px-3.5 py-2.5 text-sm text-white/30 line-through decoration-white/25"
                >
                  {slot.label}
                  <span className="ml-2 text-[11px] uppercase tracking-wider text-rose-300/60 no-underline">
                    Booked
                  </span>
                </li>
              ))}
          </ul>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="customerName" className="eyebrow block">
            Your name
          </label>
          <input
            id="customerName"
            name="customerName"
            className="field mt-2"
            placeholder="Elena Marsh"
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="customerEmail" className="eyebrow block">
            Email address
          </label>
          <input
            id="customerEmail"
            name="customerEmail"
            type="email"
            className="field mt-2"
            placeholder="you@label.com"
            autoComplete="email"
          />
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-ink-900/50 p-4">
        <p className="eyebrow">Price breakdown</p>
        <div className="mt-2 divide-y divide-white/[0.06]">
          <Row
            label="Studio time"
            hint={selected ? `${selected.hours} hrs × ${formatMoney(hourlyRate)}` : "select a slot"}
            testId="subtotal"
            value={price ? formatMoney(price.subtotal) : dash}
          />
          <Row
            label="Platform commission"
            hint={`${PLATFORM_COMMISSION_RATE * 100}%`}
            testId="platform-fee"
            value={price ? `− ${formatMoney(price.platformFee)}` : dash}
          />
          <Row
            label="Studio payout"
            testId="studio-payout"
            value={price ? formatMoney(price.studioPayout) : dash}
          />
          <Row
            label="You pay"
            testId="customer-total"
            emphasis
            value={price ? formatMoney(price.customerTotal) : dash}
          />
        </div>
      </div>

      <SimulatedPaymentNotice />

      {state.error ? (
        <p
          data-testid="form-error"
          role="alert"
          className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-3.5 py-2.5 text-sm text-rose-200"
        >
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
      <p className="text-center text-[11px] text-white/35">
        Requests land as <span className="text-white/60">pending</span> until the studio owner
        accepts them in the studio admin queue.
      </p>
    </form>
  );
}
