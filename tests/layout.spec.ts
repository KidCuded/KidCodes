// Step (b): static room layout checks (§12 sizes), plus a gzip size check of `/`.
import { test, expect, type Page } from '@playwright/test';
import { gzipSync } from 'zlib';
import { built } from './helpers';

const SIZES: { w: number; h: number; expect: 'desktop' | 'portrait' }[] = [
  { w: 1366, h: 768, expect: 'desktop' },
  { w: 1920, h: 1080, expect: 'desktop' },
  { w: 2560, h: 1080, expect: 'desktop' },
  { w: 768, h: 1024, expect: 'portrait' },
  { w: 390, h: 844, expect: 'portrait' },
  { w: 844, h: 390, expect: 'desktop' },
];

type Box = { x: number; y: number; w: number; h: number };

/** Union of the on-screen boxes of every [data-room] element in the visible layout. */
async function roomBox(page: Page, layout: string): Promise<Box | null> {
  return page.evaluate((sel) => {
    const els = Array.from(document.querySelectorAll(`${sel} [data-room]`));
    let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      x1 = Math.min(x1, r.left); y1 = Math.min(y1, r.top);
      x2 = Math.max(x2, r.right); y2 = Math.max(y2, r.bottom);
    }
    return x1 === Infinity ? null : { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
  }, `.room-${layout}`);
}

/** Which individual objects the nav box overlaps (for the report). */
async function overlappedObjects(page: Page, layout: string, nav: Box): Promise<string[]> {
  return page.evaluate(([sel, n]) => {
    const hits: string[] = [];
    for (const el of Array.from(document.querySelectorAll(`${sel} [data-room]`))) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (r.left < n.x + n.w && n.x < r.right && r.top < n.y + n.h && n.y < r.bottom) {
        const slug = el.getAttribute('data-slug');
        hits.push(el.getAttribute('data-room') + (slug ? `:${slug}` : ''));
      }
    }
    return hits;
  }, [`.room-${layout}`, nav] as const);
}

test.describe('step b: static room layouts', () => {
  test.fixme(!built('b'), 'step (b) not built yet');

  for (const s of SIZES) {
    test(`${s.w}x${s.h}: one ${s.expect} room, no scroll, nav clear`, async ({ page }, info) => {
      await page.setViewportSize({ width: s.w, height: s.h });
      await page.goto('/');

      const desktop = page.locator('.room-desktop').first();
      const portrait = page.locator('.room-portrait').first();
      await expect(s.expect === 'desktop' ? desktop : portrait).toBeVisible();
      await expect(s.expect === 'desktop' ? portrait : desktop).toBeHidden();

      const d = await page.evaluate(() => ({
        sh: document.documentElement.scrollHeight,
        sw: document.documentElement.scrollWidth,
        ih: window.innerHeight,
        iw: window.innerWidth,
      }));
      expect(d.sh, 'no vertical scroll').toBeLessThanOrEqual(d.ih);
      expect(d.sw, 'no horizontal scroll').toBeLessThanOrEqual(d.iw);

      await page.screenshot({ path: `${info.project.outputDir}/room-step-b/room-${s.w}x${s.h}.png` });

      const nav = await page.getByRole('navigation', { name: 'Main' }).first().boundingBox();
      expect(nav, 'corner nav is rendered').not.toBeNull();
      const navBox = { x: nav!.x, y: nav!.y, w: nav!.width, h: nav!.height };
      const room = await roomBox(page, s.expect);
      expect(room, 'room objects are rendered').not.toBeNull();
      const hits = await overlappedObjects(page, s.expect, navBox);
      console.log(`[boxes ${s.w}x${s.h}] nav=${JSON.stringify(navBox)} room=${JSON.stringify(room)} overlaps=${JSON.stringify(hits)}`);
      expect(hits, 'room objects under the corner nav').toEqual([]);
    });
  }

  for (const layout of ['desktop', 'portrait']) {
    test(`${layout} layout has books kabo, kidpos, bartr`, async ({ page }) => {
      await page.goto('/');
      const slugs = await page.locator(`.room-${layout} [data-room="book"]`).evaluateAll((els) =>
        els.map((e) => e.getAttribute('data-slug')).sort(),
      );
      expect(slugs).toEqual(['bartr', 'kabo', 'kidpos']);
    });
  }

  test('HTML of / is <= 150 KB gzipped', async ({ page }) => {
    const body = await (await page.request.get('/')).body();
    const kb = gzipSync(body).length / 1024;
    console.log(`[size] / HTML: ${kb.toFixed(1)} KB gzipped, ${(body.length / 1024).toFixed(1)} KB raw`);
    expect(kb).toBeLessThanOrEqual(150);
  });
});
