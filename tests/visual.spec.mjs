import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'mobile-320', width: 320, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 1000 }
];

async function unlockPreview(context) {
  await context.addInitScript(() => localStorage.setItem('hm_preview_ok', '1'));
}

async function prepareFullPage(page) {
  await page.evaluate(async () => document.fonts.ready);
  for (const locator of await page.locator('section, footer').all()) {
    await locator.scrollIntoViewIfNeeded();
  }
  await page.waitForFunction(() => [...document.images].every((image) => image.complete));
  await page.evaluate(() => scrollTo(0, 0));
}

for (const viewport of viewports) {
  test(`home page visual baseline at ${viewport.name}`, async ({ context, page }) => {
    await unlockPreview(context);
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');
    await prepareFullPage(page);

    await expect(page).toHaveScreenshot(`home-${viewport.name}.png`, {
      fullPage: true,
      mask: [page.locator('#year')],
      maskColor: '#050505'
    });
  });
}

test('preview gate visual baseline', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(async () => document.fonts.ready);
  await expect(page).toHaveScreenshot('preview-gate-mobile-390.png');
});

test('legal page visual baseline', async ({ context, page }) => {
  await unlockPreview(context);
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/impressum.html');
  await page.evaluate(async () => document.fonts.ready);
  await expect(page).toHaveScreenshot('impressum-tablet.png', { fullPage: true });
});

test('privacy page visual baseline', async ({ context, page }) => {
  await unlockPreview(context);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/datenschutz.html');
  await page.evaluate(async () => document.fonts.ready);
  await expect(page).toHaveScreenshot('datenschutz-mobile-390.png', { fullPage: true });
});

test('404 page visual baseline', async ({ context, page }) => {
  await unlockPreview(context);
  await page.setViewportSize({ width: 1440, height: 900 });
  const response = await page.goto('/missing-for-visual-test');
  expect(response.status()).toBe(404);
  await page.evaluate(async () => document.fonts.ready);
  await expect(page).toHaveScreenshot('404-desktop.png', { fullPage: true });
});
