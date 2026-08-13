import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const previewFlag = { key: 'hm_preview_ok', value: '1' };

async function unlockPreview(context) {
  await context.addInitScript(({ key, value }) => localStorage.setItem(key, value), previewFlag);
}

async function expectNoAccessibilityViolations(page) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
}

test.describe('preview boundary', () => {
  for (const path of ['/', '/impressum.html', '/datenschutz.html', '/404.html']) {
    test(`keeps ${path} locked and non-indexable`, async ({ page }) => {
      await page.goto(path);

      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
      await expect(page.getByRole('dialog', { name: 'Noch nicht live.' })).toBeVisible();
      await expect(page.locator('main')).toBeHidden();
      await expect(page.getByLabel('PIN')).toBeFocused();

      await page.getByLabel('PIN').fill('invalid');
      await page.getByRole('button', { name: 'Weiter' }).click();
      await expect(page.getByRole('alert')).toBeVisible();
      await expect(page.getByLabel('PIN')).toHaveAttribute('aria-invalid', 'true');
      await expectNoAccessibilityViolations(page);
    });
  }

  test('remains visually locked when JavaScript is disabled', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');

    await expect(page.getByRole('dialog', { name: 'Noch nicht live.' })).toBeVisible();
    await expect(page.locator('main')).toBeHidden();
    await context.close();
  });
});

test.describe('unlocked static site', () => {
  test.beforeEach(async ({ context }) => unlockPreview(context));

  test('loads no third party before explicit map consent', async ({ page }) => {
    const thirdPartyRequests = [];
    page.on('request', (request) => {
      const url = new URL(request.url());
      if (url.hostname !== '127.0.0.1') thirdPartyRequests.push(request.url());
    });
    await page.route('https://www.google.com/**', (route) => {
      route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Map test</title>' });
    });

    await page.goto('/');
    await expect(page.locator('.preview-gate')).toHaveCount(0);
    await expect(page.locator('[data-map-embed] iframe')).toHaveCount(0);
    expect(thirdPartyRequests).toEqual([]);

    await page.getByRole('button', { name: /Karte laden/ }).click();
    await expect(page.locator('[data-map-embed] iframe')).toHaveAttribute('title', 'Anfahrt zu Die Hautmaler');
    await expect.poll(() => thirdPartyRequests.some((url) => url.startsWith('https://www.google.com/maps'))).toBe(true);
  });

  for (const width of [320, 390]) {
    test(`mobile navigation works without horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');

      const toggle = page.getByRole('button', { name: 'Menü' });
      await expect(toggle).toBeVisible();
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(page.getByRole('navigation', { name: 'Hauptnavigation' })).toBeVisible();

      await page.keyboard.press('Escape');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(toggle).toBeFocused();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });
  }

  for (const width of [768, 1440]) {
    test(`desktop header fits at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');

      await expect(page.getByRole('navigation', { name: 'Hauptnavigation' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Menü' })).toBeHidden();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });
  }

  test('portfolio remains semantic and captions remain available without hover', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const gallery = page.getByRole('list', { name: 'Tattoo-Arbeiten' });
    await gallery.scrollIntoViewIfNeeded();

    await expect(gallery.getByRole('listitem')).toHaveCount(10);
    await expect(page.getByText('Realistic · Color Realism').first()).toBeVisible();
    const imageStates = await gallery.locator('img').evaluateAll((images) => images.map((image) => ({
      complete: image.complete,
      naturalWidth: image.naturalWidth,
      width: image.getBoundingClientRect().width
    })));
    expect(imageStates.every((image) => image.complete && image.naturalWidth > 0 && image.width > 0)).toBe(true);
  });

  test('year, legal links, 404 status, and reduced motion remain correct', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    await expect(page.locator('#year')).toHaveText(String(new Date().getFullYear()));
    await expect(page.getByRole('link', { name: 'Impressum' })).toHaveAttribute('href', 'impressum.html');
    await expect(page.getByRole('link', { name: 'Datenschutz' })).toHaveAttribute('href', 'datenschutz.html');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');

    const response = await page.goto('/definitely-not-a-page');
    expect(response.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Seite nicht gefunden.');
  });

  for (const path of ['/', '/impressum.html', '/datenschutz.html', '/404.html']) {
    test(`has no axe violations on ${path}`, async ({ page }) => {
      await page.setViewportSize({ width: path === '/' ? 390 : 768, height: 900 });
      await page.goto(path);
      await expectNoAccessibilityViolations(page);
    });
  }
});
