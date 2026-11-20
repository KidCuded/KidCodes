// Smoke tests from §12 of docs/room-build-plan.md.
// Tests for steps that aren't built yet are skipped as `fixme` (see CURRENT_STEP in helpers.ts).
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { built, PROJECTS, EMAIL, OBJECTS, roomObject } from './helpers';

test.describe('step a: routes, redirects, plain pages', () => {
  test.fixme(!built('a'), 'step (a) not built yet');

  // §12 test 1
  for (const path of ['/', '/projects', '/about', '/resume', '/contact']) {
    test(`${path} loads with 200`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
    });
  }

  // §12 test 2
  for (const p of PROJECTS) {
    test(`/projects/${p.slug} loads`, async ({ page }) => {
      const res = await page.goto(`/projects/${p.slug}`);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(p.heading);
    });
  }

  // §12 test 3
  const redirects: [string, string][] = [
    ['/KABO', '/projects/kabo'],
    ['/kabo', '/projects/kabo'],
    ['/BARTR', '/projects/bartr'],
    ['/Bartr', '/projects/bartr'],
    ['/bartr', '/projects/bartr'],
    ['/POS', '/projects/kidpos'],
    ['/pos', '/projects/kidpos'],
    ['/KIDPOS', '/projects/kidpos'],
    ['/kidpos', '/projects/kidpos'],
    ['/kidprojects', '/projects'],
    ['/kidprojects/KABO', '/projects'],
    ['/kidprojects/anything/else', '/projects'],
  ];
  for (const [from, to] of redirects) {
    test(`${from} redirects 308 to ${to}`, async ({ page }) => {
      const res = await page.request.get(from, { maxRedirects: 0 });
      expect(res.status()).toBe(308);
      expect(new URL(res.headers()['location'], 'http://x').pathname).toBe(to);
    });
  }

  // §12 test 4
  test('unknown URL shows the custom 404', async ({ page }) => {
    const res = await page.goto('/this-page-does-not-exist');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('link', { name: /Back to room/i }).first()).toBeVisible();
  });

  // §12 test 5
  test('nav links work on a non-room page', async ({ page }) => {
    const targets: [RegExp | string, string][] = [
      ['Projects', '/projects'],
      ['About', '/about'],
      ['Resume', '/resume'],
      ['Contact', '/contact'],
      [/Back to room/i, '/'],
    ];
    for (const [name, path] of targets) {
      await page.goto('/projects/kabo');
      const link = page
        .getByRole('link', { name, exact: typeof name === 'string' })
        .first();
      await link.click();
      await expect(page).toHaveURL(path);
    }
  });

  test('nav marks the current page with aria-current', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('link', { name: 'About', exact: true })).toHaveAttribute('aria-current', 'page');
  });

  for (const from of ['/', '/projects']) {
    test(`project links on ${from} reach every project`, async ({ page }) => {
      for (const p of PROJECTS) {
        await page.goto(from);
        // From step (b) the links on `/` are visually hidden (sr-only) under the room, so use the keyboard.
        const link = page.locator(`main a[href="/projects/${p.slug}"]`).first();
        await link.focus();
        await page.keyboard.press('Enter');
        await expect(page).toHaveURL(`/projects/${p.slug}`);
        await expect(page.getByRole('heading', { level: 1 })).toContainText(p.heading);
      }
    });
  }

  test('room page has the H1 and the site title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Akid — Software Engineer/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Akid — Software Engineer in Kuala Lumpur');
  });

  test('contact: Copy shows "Copied" and copies the email', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/contact');
    await expect(page.getByText(EMAIL).first()).toBeVisible();
    await page.getByRole('button', { name: /Copy/i }).click();
    await expect(page.getByText(/Copied/i)).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(EMAIL);
  });

  test('axe: / (placeholder) has no serious violations', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map((v) => `${v.id}: ${v.nodes.length} node(s)`)).toEqual([]);
  });

  test('contact card: LinkedIn and GitHub open in a new tab safely', async ({ page }) => {
    await page.goto('/contact');
    for (const name of [/LinkedIn/i, /GitHub/i]) {
      const link = page.getByRole('link', { name }).first();
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
      await expect(link).toHaveAttribute('rel', /noreferrer/);
    }
    await expect(page.locator(`a[href="mailto:${EMAIL}"]`).first()).toBeVisible();
  });

  test('old header anchors are gone from plain pages', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.locator('a[href*="#featured-work"], a[href*="#contact"]')).toHaveCount(0);
  });

  // §12 test 10 (part)
  test('axe: /projects has no serious violations', async ({ page }) => {
    await page.goto('/projects');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map((v) => `${v.id}: ${v.nodes.length} node(s)`)).toEqual([]);
  });
});

test.describe('step c: room objects are links', () => {
  test.fixme(!built('c'), 'step (c) not built yet');

  // §12 test 9
  test('a project book navigates to its project', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: PROJECTS[0].book }).click();
    await expect(page).toHaveURL(`/projects/${PROJECTS[0].slug}`);
  });

  test('server HTML has links to every project and /resume', async ({ page }) => {
    const html = await (await page.request.get('/')).text();
    for (const p of PROJECTS) expect(html).toContain(`href="/projects/${p.slug}"`);
    expect(html).toMatch(/href="\/resume(\.pdf)?"/);
  });

  test('visually hidden H1 is present', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Akid.+Software Engineer/);
  });

  // §12 test 10 (part)
  test('axe: / has no serious violations', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map((v) => `${v.id}: ${v.nodes.length} node(s)`)).toEqual([]);
  });
});

test.describe('step e: room dialogs', () => {
  test.fixme(!built('e'), 'step (e) not built yet');

  // §12 test 6
  for (const [key, name] of Object.entries(OBJECTS)) {
    test(`${key}: opens its view, Esc closes it, focus returns`, async ({ page }) => {
      await page.goto('/');
      const obj = roomObject(page, name);
      await obj.click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toBeHidden();
      await expect(obj).toBeFocused();
    });
  }

  // §12 test 7
  test('computer → Resume swaps the dialog (only one open)', async ({ page }) => {
    await page.goto('/');
    await roomObject(page, OBJECTS.computer).click();
    await page.getByRole('dialog').getByRole('link', { name: 'Resume', exact: true })
      .or(page.getByRole('dialog').getByRole('button', { name: 'Resume', exact: true }))
      .first()
      .click();
    await expect(page.getByRole('dialog')).toHaveCount(1);
    await expect(page.getByRole('dialog').getByRole('link', { name: /Download PDF/i })).toBeVisible();
  });

  // §12 test 8
  test('contact Copy shows "Copied" and copies the email', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');
    await roomObject(page, OBJECTS.contact).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText(EMAIL)).toBeVisible();
    await dialog.getByRole('button', { name: /Copy/i }).click();
    await expect(dialog.getByText(/Copied/i)).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(EMAIL);
  });

  test('contact card: LinkedIn and GitHub open in a new tab safely', async ({ page }) => {
    await page.goto('/contact');
    for (const name of [/LinkedIn/i, /GitHub/i]) {
      const link = page.getByRole('link', { name }).first();
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
      await expect(link).toHaveAttribute('rel', /noreferrer/);
    }
    await expect(page.getByRole('link', { name: new RegExp(EMAIL) }).or(page.locator(`a[href="mailto:${EMAIL}"]`)).first())
      .toHaveAttribute('href', `mailto:${EMAIL}`);
  });
});
