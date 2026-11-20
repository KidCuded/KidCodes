import { expect, type Locator, type Page } from '@playwright/test';

/**
 * The build step the builder has reported as ready (§10 of docs/room-build-plan.md).
 * The tester bumps this after each "step X ready" message. '' = nothing built yet.
 * Can be overridden for a run with ROOM_STEP=c npx playwright test
 */
export const CURRENT_STEP: string = process.env.ROOM_STEP ?? 'd';

const ORDER = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

/** True once `step` has been built. */
export function built(step: string): boolean {
  if (!CURRENT_STEP) return false;
  return ORDER.indexOf(CURRENT_STEP) >= ORDER.indexOf(step);
}

export const PROJECTS = [
  { slug: 'kabo', book: /^Project: KABO/i, heading: /KABO/ },
  { slug: 'bartr', book: /^Project: Bartr/i, heading: /Bartr/ },
  { slug: 'kidpos', book: /^Project: KIDPOS/i, heading: /KIDPOS/ },
] as const;

export const EMAIL = 'akidsyazwan@gmail.com';

/** Room object accessible names (§7 of the build plan). */
export const OBJECTS = {
  resume: 'Resume: view and download',
  contact: 'Contact details',
  about: 'About Akid',
  computer: 'Quick links',
} as const;

/** A room object by accessible name: a <button> once dialogs exist (step e), a link before that. */
export function roomObject(page: Page, name: string): Locator {
  return page
    .getByRole('button', { name, exact: true })
    .or(page.getByRole('link', { name, exact: true }))
    .first();
}

/** Presses Tab until `target` has focus. Fails after `max` presses. */
export async function tabTo(page: Page, target: Locator, max = 40): Promise<void> {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press('Tab');
    if (await target.evaluate((el) => el === document.activeElement).catch(() => false)) return;
  }
  throw new Error(`Could not reach ${target} with ${max} Tab presses`);
}

/** Checks that `href` serves a PDF with status 200. */
export async function expectPdf(page: Page, href: string): Promise<void> {
  const res = await page.request.get(href);
  expect(res.status(), `${href} status`).toBe(200);
  expect(res.headers()['content-type'] ?? '', `${href} content-type`).toContain('application/pdf');
  const body = await res.body();
  expect(body.subarray(0, 5).toString(), `${href} starts with %PDF-`).toBe('%PDF-');
}
