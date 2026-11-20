// Akid's must-pass feature checks (§12 "Feature checks Akid asked for explicitly").
//   (a) Books and "All projects" reach the right page by mouse, keyboard and tap (portrait).
//   (b) Resume downloads (200, PDF) from the room view and /resume; "Open full PDF" works.
//   (c) The computer opens quick links by click and keyboard; each link works; Esc closes; focus returns.
import { test, expect, type Page } from '@playwright/test';
import { built, PROJECTS, OBJECTS, roomObject, tabTo, expectPdf } from './helpers';

// ---------- (a) Books ----------
test.describe('Akid check (a): books and "All projects"', () => {
  test.fixme(!built('c'), 'needs step (c): objects as links');

  for (const p of PROJECTS) {
    test(`mouse: book ${p.slug}`, async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: p.book }).click();
      await expect(page).toHaveURL(`/projects/${p.slug}`);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(p.heading);
    });

    test(`keyboard: book ${p.slug}`, async ({ page }) => {
      await page.goto('/');
      await tabTo(page, page.getByRole('link', { name: p.book }));
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(`/projects/${p.slug}`);
    });

    test(`tap (portrait): book ${p.slug} @portrait`, async ({ page }) => {
      await page.goto('/');
      const book = page.getByRole('link', { name: p.book });
      await expectTapTarget(book);
      await book.tap();
      await expect(page).toHaveURL(`/projects/${p.slug}`);
    });
  }

  test('mouse: "All projects" sign', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'All projects', exact: true }).click();
    await expect(page).toHaveURL('/projects');
  });

  test('keyboard: "All projects" sign', async ({ page }) => {
    await page.goto('/');
    await tabTo(page, page.getByRole('link', { name: 'All projects', exact: true }));
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/projects');
  });

  test('tap (portrait): "All projects" sign @portrait', async ({ page }) => {
    await page.goto('/');
    const sign = page.getByRole('link', { name: 'All projects', exact: true });
    await expectTapTarget(sign);
    await sign.tap();
    await expect(page).toHaveURL('/projects');
  });

  test('the room page does not scroll at 1366×768', async ({ page }) => {
    await page.goto('/');
    const { sh, ch } = await page.evaluate(() => ({
      sh: document.documentElement.scrollHeight,
      ch: document.documentElement.clientHeight,
    }));
    expect(sh).toBeLessThanOrEqual(ch);
  });
});

/** At least 44×44 CSS px (Round 4, Q2). */
async function expectTapTarget(loc: ReturnType<Page['locator']>) {
  const box = await loc.boundingBox();
  expect(box, 'tap target is rendered').not.toBeNull();
  expect(Math.min(box!.width, box!.height), 'tap target ≥ 44 px').toBeGreaterThanOrEqual(44);
}

// ---------- (b) Resume download ----------
async function checkResumeButtons(page: Page, scope: ReturnType<Page['locator']>) {
  // Download PDF: the file itself is a 200 PDF, and clicking triggers a download.
  const download = scope.getByRole('link', { name: /Download PDF/i });
  const href = await download.getAttribute('href');
  expect(href).toBeTruthy();
  await expectPdf(page, href!);
  const [dl] = await Promise.all([page.waitForEvent('download'), download.click()]);
  expect(dl.suggestedFilename()).toMatch(/\.pdf$/i);
  expect(await dl.failure()).toBeNull();

  // Open full PDF: opens resume.pdf in a new tab.
  const open = scope.getByRole('link', { name: /Open full PDF/i });
  await expect(open).toHaveAttribute('href', /resume\.pdf$/);
  await expect(open).toHaveAttribute('target', '_blank');
  await expectPdf(page, (await open.getAttribute('href'))!);
  // Headless Chromium turns a PDF tab into a download, so assert on the new tab + its request, not its URL.
  const [popup, req] = await Promise.all([
    page.context().waitForEvent('page'),
    page.context().waitForEvent('request', (r) => /\/resume\.pdf$/.test(r.url())),
    open.click(),
  ]);
  expect(popup, 'a new tab opened').toBeTruthy();
  const res = await req.response();
  if (res) expect(res.status()).toBe(200);
  await popup.close();
}

test.describe('Akid check (b): resume download', () => {
  test.describe('on /resume', () => {
    test.fixme(!built('a'), 'needs step (a): /resume page');
    test('Download PDF and Open full PDF work', async ({ page }) => {
      await page.goto('/resume');
      await expect(page.getByRole('img', { name: /resume/i })).toBeVisible();
      await checkResumeButtons(page, page.locator('main'));
    });
  });

  test.describe('in the room view', () => {
    test.fixme(!built('e'), 'needs step (e): resume dialog');
    test('Download PDF and Open full PDF work', async ({ page }) => {
      await page.goto('/');
      await roomObject(page, OBJECTS.resume).click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await checkResumeButtons(page, dialog);
    });
  });
});

// ---------- (c) Computer quick links ----------
test.describe('Akid check (c): computer quick links', () => {
  test.fixme(!built('e'), 'needs step (e): computer dialog');

  const computer = (page: Page) => page.getByRole('button', { name: OBJECTS.computer, exact: true });
  const quickLink = (page: Page, name: string) =>
    page.getByRole('dialog').getByRole('link', { name, exact: true })
      .or(page.getByRole('dialog').getByRole('button', { name, exact: true }))
      .first();

  test('opens by click; Esc closes; focus returns', async ({ page }) => {
    await page.goto('/');
    await computer(page).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    for (const n of ['Projects', 'About', 'Resume', 'Contact']) await expect(quickLink(page, n)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(computer(page)).toBeFocused();
  });

  test('opens by keyboard (Enter and Space); Esc closes; focus returns', async ({ page }) => {
    await page.goto('/');
    for (const key of ['Enter', ' ']) {
      await page.goto('/');
      await tabTo(page, computer(page));
      await page.keyboard.press(key);
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toBeHidden();
      await expect(computer(page)).toBeFocused();
    }
  });

  test('focus stays inside the open dialog', async ({ page }) => {
    await page.goto('/');
    await computer(page).click();
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(() => !!document.activeElement?.closest('dialog'));
      expect(inside, `focus inside dialog after ${i + 1} Tab(s)`).toBe(true);
    }
  });

  test('quick link "Projects" goes to /projects', async ({ page }) => {
    await page.goto('/');
    await computer(page).click();
    await quickLink(page, 'Projects').click();
    await expect(page).toHaveURL('/projects');
  });

  const swaps: [string, (p: Page) => ReturnType<Page['locator']>][] = [
    ['Resume', (p) => p.getByRole('dialog').getByRole('link', { name: /Download PDF/i })],
    ['Contact', (p) => p.getByRole('dialog').getByRole('button', { name: /Copy/i })],
    ['About', (p) => p.getByRole('dialog').getByRole('img', { name: /Akid/i })],
  ];
  for (const [name, marker] of swaps) {
    test(`quick link "${name}" swaps to its view; Esc returns focus to computer`, async ({ page }) => {
      await page.goto('/');
      await computer(page).click();
      await quickLink(page, name).click();
      await expect(page.getByRole('dialog')).toHaveCount(1);
      await expect(marker(page)).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toBeHidden();
      await expect(computer(page)).toBeFocused();
    });
  }
});
