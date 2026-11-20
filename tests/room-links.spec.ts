// Step (c): room objects as links: tab order, focus ring, labels.
import { test, expect, type Page } from '@playwright/test';
import { built } from './helpers';

const TAB_ORDER = [
  'Projects', 'About', 'Resume', 'Contact',
  'Resume: view and download', 'Contact details', 'About Akid', 'Quick links',
  'Project: KABO', 'Project: KIDPOS', 'Project: Bartr', 'All projects',
];

/** Accessible-ish name of the focused element: aria-label, else text. */
const focusedName = (page: Page) =>
  page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return '(body)';
    return (el.getAttribute('aria-label') ?? el.textContent ?? '').trim().replace(/\s+/g, ' ');
  });

test.describe('step c: room links', () => {
  test.fixme(!built('c'), 'step (c) not built yet');

  test('tab order: nav, then objects left to right, then books and sign', async ({ page }) => {
    await page.goto('/');
    const seen: string[] = [];
    for (let i = 0; i < TAB_ORDER.length; i++) {
      await page.keyboard.press('Tab');
      seen.push(await focusedName(page));
    }
    expect(seen).toEqual(TAB_ORDER);
  });

  test('every room link shows a visible focus ring', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Project: KABO' }).focus();
    // Focus by keyboard so :focus-visible applies.
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    const ring = await page.evaluate(() => {
      const hit = document.activeElement?.querySelector('.room-hit');
      if (!hit) return null;
      const cs = getComputedStyle(hit);
      return { stroke: cs.stroke, strokeOpacity: cs.strokeOpacity, outline: cs.outlineStyle };
    });
    expect(ring, 'focused link has a .room-hit').not.toBeNull();
    const visible = (ring!.stroke !== 'none' && ring!.strokeOpacity !== '0') || ring!.outline !== 'none';
    expect(visible, `focus ring style ${JSON.stringify(ring)}`).toBe(true);
  });

  test('"Quick links" moves focus to the corner nav (until step e)', async ({ page }) => {
    test.skip(built('e'), 'replaced by the computer dialog in step (e)');
    await page.goto('/');
    await page.getByRole('link', { name: 'Quick links', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-nav')).toBeFocused();
  });

  test('desktop labels show on load, then hide after ~3 s', async ({ page }) => {
    await page.goto('/');
    const label = page.locator('.room-desktop .room-label[data-intro="true"]').first();
    await expect(label).toHaveCSS('opacity', '1');
    await expect(page.locator('main#room')).toHaveClass(/labels-done/, { timeout: 6000 });
    await expect(label).toHaveCSS('opacity', '0');
  });

  test('labels stay visible under reduced motion', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1366, height: 768 } });
    const page = await ctx.newPage();
    await page.goto('/');
    await page.waitForTimeout(4000);
    const ops = await page.locator('.room-desktop .room-label[data-intro="true"]').evaluateAll((els) =>
      els.map((e) => getComputedStyle(e).opacity));
    expect(ops.length).toBeGreaterThan(0);
    expect(ops.every((o) => o === '1'), `opacities ${ops}`).toBe(true);
    await ctx.close();
  });

  test('labels stay visible on touch (portrait) @portrait', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(4000);
    const ops = await page.locator('.room-portrait .room-label[data-intro="true"]').evaluateAll((els) =>
      els.map((e) => getComputedStyle(e).opacity));
    expect(ops.length).toBeGreaterThan(0);
    expect(ops.every((o) => o === '1'), `opacities ${ops}`).toBe(true);
  });
});
