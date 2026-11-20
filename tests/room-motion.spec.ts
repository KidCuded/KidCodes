// Step (d): hover/focus states, shelf click area, tilt (parallax), reduced motion, layout shift.
import { test, expect, type Page, type Locator } from '@playwright/test';
import { built, tabTo } from './helpers';

const D = '.room-desktop';

/** Computed style property of the first element matching `sel` inside the desktop room. */
const css = (page: Page, sel: string, prop: string) =>
  page.evaluate(([s, p]) => {
    const el = document.querySelector(s);
    return el ? getComputedStyle(el).getPropertyValue(p) : '(missing)';
  }, [`${D} ${sel}`, prop] as const);

type Expectation = { sel: string; prop: string; check: (v: string) => boolean; want: string };

const isMoved = (v: string) => v !== 'none' && v !== 'matrix(1, 0, 0, 1, 0, 0)' && v !== '(missing)';

const STATES: { target: string; link: (p: Page) => Locator; expects: Expectation[] }[] = [
  {
    target: 'resume',
    link: (p) => p.getByRole('link', { name: 'Resume: view and download' }),
    expects: [
      { sel: '[data-room="resume"]', prop: 'transform', check: isMoved, want: 'a transform (lift)' },
      { sel: '[data-part="curl"]', prop: 'opacity', check: (v) => v === '1', want: 'opacity 1' },
    ],
  },
  {
    target: 'envelope',
    link: (p) => p.getByRole('link', { name: 'Contact details' }),
    expects: [
      { sel: '[data-room="envelope"]', prop: 'animation-name', check: (v) => v === 'room-jump', want: 'room-jump' },
      { sel: '[data-part="flap"]', prop: 'transform', check: (v) => /matrix\(1, 0, 0, -1/.test(v), want: 'scaleY(-1)' },
      { sel: '[data-part="card"]', prop: 'opacity', check: (v) => v === '1', want: 'opacity 1' },
    ],
  },
  {
    target: 'person',
    link: (p) => p.getByRole('link', { name: 'About Akid' }),
    expects: [
      { sel: '[data-part="hair"]', prop: 'transform', check: isMoved, want: 'a transform (head turn)' },
      { sel: '[data-part="ear"]', prop: 'transform', check: isMoved, want: 'a transform (head turn)' },
      { sel: '[data-part="bubble"]', prop: 'opacity', check: (v) => v === '1', want: 'opacity 1' },
    ],
  },
  {
    target: 'computer',
    link: (p) => p.getByRole('link', { name: 'Quick links' }).or(p.getByRole('button', { name: 'Quick links' })).first(),
    expects: [
      { sel: '[data-part="glow"]', prop: 'opacity', check: (v) => v === '1', want: 'opacity 1' },
      { sel: '[data-part="screen-light"]', prop: 'opacity', check: (v) => Math.abs(parseFloat(v) - 0.14) < 0.005, want: 'opacity 0.14' },
    ],
  },
  ...(['kabo', 'kidpos', 'bartr'] as const).map((slug) => ({
    target: `book ${slug}`,
    link: (p: Page) => p.getByRole('link', { name: new RegExp(`^Project: ${slug}`, 'i') }),
    expects: [
      { sel: `.book-art[data-slug="${slug}"]`, prop: 'transform', check: (v: string) => /matrix\(1, 0, 0, 1, 0, -9\)/.test(v), want: 'translateY(-9px)' },
    ],
  })),
];

async function expectStates(page: Page, expects: Expectation[], how: string) {
  for (const e of expects) {
    let last = '';
    await expect
      .poll(async () => e.check((last = await css(page, e.sel, e.prop))), {
        message: `${how}: ${e.sel} ${e.prop} should be ${e.want}`,
        timeout: 3000,
      })
      .toBe(true)
      .catch((err) => {
        throw new Error(`${err.message}\n  last value: ${last}`);
      });
  }
}

/** A point inside the shelf click area that isn't covered by a book link. */
async function shelfPoint(page: Page) {
  return page.evaluate((sel) => {
    const hit = document.querySelector(`${sel} .room-shelf-hit`);
    if (!hit) return null;
    const r = hit.getBoundingClientRect();
    for (let fy = 0.1; fy < 0.95; fy += 0.05) {
      for (let fx = 0.1; fx < 0.95; fx += 0.05) {
        const x = r.left + r.width * fx, y = r.top + r.height * fy;
        if (document.elementFromPoint(x, y)?.closest('a') === hit) return { x, y };
      }
    }
    return null;
  }, D);
}

test.describe('step d: hover and focus states', () => {
  test.fixme(!built('d'), 'step (d) not built yet');

  for (const s of STATES) {
    test(`${s.target}: mouse hover`, async ({ page }) => {
      await page.goto('/');
      await s.link(page).hover();
      await expectStates(page, s.expects, 'hover');
    });

    test(`${s.target}: keyboard focus`, async ({ page }) => {
      await page.goto('/');
      await page.mouse.move(0, 0);
      await tabTo(page, s.link(page));
      await expectStates(page, s.expects, 'focus');
    });
  }

  test('at rest: bubble hidden, curl hidden, glow 0.75', async ({ page }) => {
    await page.goto('/');
    await page.mouse.move(0, 0);
    expect(await css(page, '[data-part="bubble"]', 'opacity')).toBe('0');
    expect(await css(page, '[data-part="glow"]', 'opacity')).toBe('0.75');
  });

  test('painting tilts on hover', async ({ page }) => {
    await page.goto('/');
    const box = await page.locator(`${D} [data-room="painting"]`).boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await expect.poll(async () => isMoved(await css(page, '[data-room="painting"]', 'transform')), { timeout: 3000 }).toBe(true);
  });
});

test.describe('step d: shelf click area', () => {
  test.fixme(!built('d'), 'step (d) not built yet');

  test('clicking the shelf body goes to /projects', async ({ page }) => {
    await page.goto('/');
    const pt = await shelfPoint(page);
    expect(pt, 'found an uncovered point on the shelf').not.toBeNull();
    await page.mouse.click(pt!.x, pt!.y);
    await expect(page).toHaveURL('/projects');
  });

  test('hovering the shelf plays the hop wave', async ({ page }) => {
    await page.goto('/');
    const pt = await shelfPoint(page);
    await page.mouse.move(pt!.x, pt!.y);
    await expect.poll(() => css(page, '.book-art', 'animation-name')).toBe('room-hop');
  });

  test('shelf area is not a tab stop and not in the accessibility tree', async ({ page }) => {
    await page.goto('/');
    const shelf = page.locator(`${D} .room-shelf-hit`);
    await expect(shelf).toHaveAttribute('tabindex', '-1');
    await expect(shelf).toHaveAttribute('aria-hidden', 'true');
    const inTree = await page.getByRole('link').evaluateAll((els) => els.some((e) => e.classList.contains('room-shelf-hit')));
    expect(inTree).toBe(false);
    for (let i = 0; i < 16; i++) {
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => !!document.activeElement?.classList.contains('room-shelf-hit'))).toBe(false);
    }
  });
});

test.describe('step d: tilt, reduced motion, layout shift', () => {
  test.fixme(!built('d'), 'step (d) not built yet');

  const tilt = (page: Page) => page.evaluate(() => getComputedStyle(document.querySelector('.room-tilt')!).transform);

  test('tilt follows the pointer on desktop', async ({ page }) => {
    await page.goto('/');
    await page.mouse.move(10, 10);
    await page.waitForTimeout(500);
    const a = await tilt(page);
    await page.mouse.move(1350, 750);
    await page.waitForTimeout(500);
    const b = await tilt(page);
    expect(a).toMatch(/^matrix3d/);
    expect(b).toMatch(/^matrix3d/);
    expect(a).not.toBe(b);
  });

  test('no tilt under reduced motion; no animation or transition on room parts', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1366, height: 768 } });
    const page = await ctx.newPage();
    await page.goto('/');
    await page.mouse.move(10, 10);
    await page.mouse.move(1350, 750);
    await page.waitForTimeout(300);
    expect(await tilt(page)).toBe('none');
    const pt = await shelfPoint(page);
    await page.mouse.move(pt!.x, pt!.y);
    await page.waitForTimeout(100);
    expect(await css(page, '.book-art', 'animation-name')).toBe('none');
    const durations = await page.locator(`${D} [data-room]`).evaluateAll((els) =>
      [...new Set(els.map((e) => getComputedStyle(e).transitionDuration))]);
    expect(durations).toEqual(['0s']);
    // State changes still apply (instantly).
    await page.getByRole('link', { name: 'About Akid' }).hover();
    expect(await css(page, '[data-part="bubble"]', 'opacity')).toBe('1');
    await ctx.close();
  });

  test('no tilt with touch at 390×844 @portrait', async ({ page }) => {
    await page.goto('/');
    await page.mouse.move(10, 10);
    await page.mouse.move(380, 830);
    await page.waitForTimeout(300);
    const vars = await page.evaluate(() => {
      const el = document.querySelector('.room-tilt') as HTMLElement;
      return [el.style.getPropertyValue('--rx'), el.style.getPropertyValue('--ry')];
    });
    for (const v of vars) expect(['', '0deg', '0.00deg', '-0.00deg']).toContain(v);
  });

  test('no layout shift on load', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    const cls = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let sum = 0;
          new PerformanceObserver((list) => {
            for (const e of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
              if (!e.hadRecentInput) sum += e.value;
            }
          }).observe({ type: 'layout-shift', buffered: true });
          setTimeout(() => resolve(sum), 300);
        }),
    );
    expect(cls).toBeLessThan(0.01);
  });
});
