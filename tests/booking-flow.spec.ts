import { test, expect } from "@playwright/test";
import { bookFirstAvailableSlot, readMoney } from "./helpers";

/**
 * Acceptance criteria from the Midnight Riviera PRD.
 * One test() block per criterion, plus PRD edge cases.
 */

test("AC1 — filtering /studios by area and price ceiling narrows the grid, clearing restores all six studios (FR3)", async ({
  page,
}) => {
  await page.goto("/studios");

  const cards = page.getByTestId("studio-card");
  await expect(cards).toHaveCount(6);

  await page.getByLabel("Area").selectOption("Downtown");
  await expect(cards).toHaveCount(4);

  await page.getByLabel("Max hourly price").selectOption("120");
  await expect(cards).toHaveCount(3);
  await expect(page.getByText("Neon Room Studio A")).toBeVisible();

  // No navigation happened — filtering is client-side.
  expect(new URL(page.url()).pathname).toBe("/studios");

  await page.getByTestId("clear-filters").click();
  await expect(cards).toHaveCount(6);
});

test("AC2 — submitting a booking produces a receipt whose subtotal, 10% fee and payout are arithmetically consistent (FR6, FR7)", async ({
  page,
}) => {
  await page.goto("/studios/neon-room-studio-a");

  const rate = await readMoney(page, "hourly-rate");
  expect(rate).toBe(110);

  const firstSlot = page.getByTestId("slot-option").first();
  await firstSlot.click();

  const hours = Number(await firstSlot.getAttribute("data-hours"));
  expect(hours).toBeGreaterThan(0);

  // Live breakdown on the profile, before submission.
  expect(await readMoney(page, "subtotal")).toBeCloseTo(rate * hours, 2);
  expect(await readMoney(page, "platform-fee")).toBeCloseTo(rate * hours * 0.1, 2);
  expect(await readMoney(page, "studio-payout")).toBeCloseTo(rate * hours * 0.9, 2);

  await page.getByLabel("Your name").fill("Elena Marsh");
  await page.getByLabel("Email address").fill("elena@example.com");
  await page.getByRole("button", { name: /request this slot/i }).click();

  await page.waitForURL(/\/bookings\/MR-\d+/);

  await expect(page.getByTestId("booking-status")).toContainText(/pending/i);
  await expect(page.getByTestId("booking-ref")).toContainText(/MR-\d+/);

  const subtotal = await readMoney(page, "subtotal");
  const fee = await readMoney(page, "platform-fee");
  const payout = await readMoney(page, "studio-payout");
  const total = await readMoney(page, "customer-total");

  expect(subtotal).toBeCloseTo(rate * hours, 2);
  expect(fee).toBeCloseTo(subtotal * 0.1, 2);
  expect(payout).toBeCloseTo(subtotal - fee, 2);
  expect(total).toBeCloseTo(subtotal, 2);
});

test("AC3 — a request appears in /studio-admin and after Accept reads Confirmed on the receipt with both notification emails (FR8, FR9)", async ({
  page,
}) => {
  const { ref } = await bookFirstAvailableSlot(page, "velvet-basement", {
    name: "Marcus Reyes",
    email: "marcus@example.com",
  });

  await page.goto("/studio-admin");
  const row = page.getByTestId(`admin-row-${ref}`);
  await expect(row).toBeVisible();
  await expect(row).toContainText(/pending/i);

  await page.getByTestId(`accept-${ref}`).click();
  await expect(page.getByTestId(`status-${ref}`)).toContainText(/confirmed/i);

  await page.goto(`/bookings/${ref}`);
  await expect(page.getByTestId("booking-status")).toContainText(/confirmed/i);
  await expect(page.getByTestId("notification-customer")).toContainText(/marcus@example.com/i);
  await expect(page.getByTestId("notification-studio")).toContainText(/confirmed/i);
});

test("AC4 — a booked slot no longer offers itself for selection on the studio profile (FR10)", async ({
  page,
}) => {
  await page.goto("/studios/aurora-penthouse-suite");
  const before = await page.getByTestId("slot-option").count();
  expect(before).toBeGreaterThan(1);

  const { slotLabel } = await bookFirstAvailableSlot(page, "aurora-penthouse-suite", {
    name: "Dana Okoye",
    email: "dana@example.com",
  });

  await page.goto("/studios/aurora-penthouse-suite");
  await expect(page.getByTestId("slot-option")).toHaveCount(before - 1);
  await expect(page.getByTestId("slot-option").filter({ hasText: slotLabel })).toHaveCount(0);
  await expect(page.getByTestId("slots-panel")).toContainText(slotLabel);
  await expect(page.getByTestId("slots-panel")).toContainText(/booked/i);
});

test("AC5 — every route renders at 375px and at desktop width without horizontal overflow (FR11)", async ({
  page,
}) => {
  const routes = ["/", "/studios", "/studios/neon-room-studio-a", "/events", "/studio-admin"];

  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, `horizontal overflow on ${route}`).toBeLessThanOrEqual(1);
    }
  }
});

test("AC5b — no card entry anywhere and payments are visibly labelled simulated with Stripe Connect mapping (FR11)", async ({
  page,
}) => {
  const { ref } = await bookFirstAvailableSlot(page, "sable-and-salt", {
    name: "Priya Nadar",
    email: "priya@example.com",
  });

  for (const route of ["/studios/sable-and-salt", `/bookings/${ref}`, "/studio-admin"]) {
    await page.goto(route);
    await expect(page.getByTestId("simulated-payment-notice").first()).toBeVisible();
    await expect(page.locator('input[autocomplete*="cc-"]')).toHaveCount(0);
    await expect(page.locator('input[name*="card" i]')).toHaveCount(0);
    await expect(page.locator('iframe[src*="stripe" i]')).toHaveCount(0);
  }

  await page.goto(`/bookings/${ref}`);
  await expect(page.getByTestId("stripe-mapping")).toContainText(/Stripe Connect/i);
  await expect(page.getByTestId("stripe-mapping")).toContainText(/application_fee_amount/i);
});

test("FR1/FR2/FR4 — homepage strip leads to the studio grid and a full studio profile", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Midnight Riviera/i);
  await expect(page.getByTestId("event-card")).toHaveCount(3);
  await expect(page.getByTestId("featured-studio")).toHaveCount(3);

  await page.getByRole("link", { name: /browse studios/i }).first().click();
  await page.waitForURL("**/studios");
  await expect(page.getByTestId("studio-card")).toHaveCount(6);

  await page.getByRole("link", { name: /Neon Room Studio A/i }).first().click();
  await page.waitForURL("**/studios/neon-room-studio-a");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Neon Room Studio A");
  await expect(page.getByTestId("studio-area")).toContainText("Downtown");
  await expect(page.getByTestId("gallery-image")).toHaveCount(3);
  await expect(page.getByTestId("equipment-list").getByRole("listitem").first()).toBeVisible();
  await expect(page.getByTestId("amenity-list").getByRole("listitem").first()).toBeVisible();
});

test("FR8/FR9 — rejecting a request marks it Declined for the owner and on the customer receipt", async ({
  page,
}) => {
  const { ref } = await bookFirstAvailableSlot(page, "harbour-arches-live-room", {
    name: "Tomas Vidal",
    email: "tomas@example.com",
  });

  await page.goto("/studio-admin");
  await page.getByTestId(`reject-${ref}`).click();
  await expect(page.getByTestId(`status-${ref}`)).toContainText(/declined/i);

  await page.goto(`/bookings/${ref}`);
  await expect(page.getByTestId("booking-status")).toContainText(/declined/i);
  await expect(page.getByTestId("notification-customer")).toContainText(/tomas@example.com/i);
});

test("FR12 — a degraded store shows an inline banner and still renders seeded bookings", async ({
  page,
}) => {
  await page.goto("/studio-admin?store=down");
  await expect(page.getByTestId("store-banner")).toContainText(/seeded/i);
  const rows = page.getByTestId("admin-row");
  expect(await rows.count()).toBeGreaterThan(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("FR5 — a booking request without a selected slot is rejected with an inline error", async ({
  page,
}) => {
  await page.goto("/studios/marina-quarter-tape-room");

  await page.getByLabel("Your name").fill("No Slot Person");
  await page.getByLabel("Email address").fill("noslot@example.com");
  await page.getByRole("button", { name: /request this slot/i }).click();

  await expect(page.getByTestId("form-error")).toContainText(/slot/i);
  expect(new URL(page.url()).pathname).toBe("/studios/marina-quarter-tape-room");
});

test("FR8 — the pending queue is never empty on a cold start (two pre-seeded bookings)", async ({
  page,
}) => {
  await page.goto("/studio-admin");
  const rows = page.getByTestId("admin-row");
  expect(await rows.count()).toBeGreaterThanOrEqual(2);
  await expect(page.getByTestId("ephemeral-notice")).toContainText(/in-memory/i);
});
