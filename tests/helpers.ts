import { expect, type Page } from "@playwright/test";

export function money(text: string): number {
  const cleaned = text.replace(/[^0-9.]/g, "");
  return Number.parseFloat(cleaned);
}

/** Reads a labelled money row from a price-breakdown block. */
export async function readMoney(page: Page, testId: string): Promise<number> {
  const raw = await page.getByTestId(testId).innerText();
  return money(raw);
}

/**
 * Books the first available slot on a studio profile.
 * Returns the booking reference shown on the receipt page.
 */
export async function bookFirstAvailableSlot(
  page: Page,
  slug: string,
  customer: { name: string; email: string }
): Promise<{ ref: string; slotLabel: string }> {
  await page.goto(`/studios/${slug}`);

  const firstSlot = page.getByTestId("slot-option").first();
  await expect(firstSlot).toBeVisible();
  const slotLabel = (await firstSlot.innerText()).trim();
  await firstSlot.click();

  await page.getByLabel("Your name").fill(customer.name);
  await page.getByLabel("Email address").fill(customer.email);
  await page.getByRole("button", { name: /request this slot/i }).click();

  await page.waitForURL(/\/bookings\/MR-\d+/);
  const ref = (await page.getByTestId("booking-ref").innerText()).trim();
  return { ref, slotLabel };
}
