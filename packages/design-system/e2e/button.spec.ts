import { test, expect, type Page } from '@playwright/test';

/**
 * Storybook manager Brand control (`.storybook/preview.tsx` globalTypes.brand).
 * The toolbar button’s accessible name is `Brand theme for components <Star Tribune|Varsity>`,
 * which is what assistive tech and the visible label reflect for users.
 */
async function selectToolbarBrand(page: Page, target: 'Star Tribune' | 'Varsity') {
  await page.getByRole('button', { name: /Brand theme for components/i }).click();
  await page.getByRole('option', { name: target, exact: true }).click();
}

test.describe('Storybook: Button', () => {
  test('Configurable story renders the demo button', async ({ page }) => {
    await page.goto('/?path=/story/actions-button--configurable');

    const preview = page.frameLocator('#storybook-preview-iframe');
    await expect(preview.getByRole('button', { name: 'See More' })).toBeVisible({
      timeout: 60_000,
    });
  });

  test('Configurable story button is clickable', async ({ page }) => {
    await page.goto('/?path=/story/actions-button--configurable');

    const preview = page.frameLocator('#storybook-preview-iframe');
    const button = preview.getByRole('button', { name: 'See More' });
    await expect(button).toBeVisible({ timeout: 60_000 });
    await expect(button).toBeEnabled();

    // Story uses `onClick: () => alert('Hello')` — accept the dialog to prove the click reached the handler.
    await Promise.all([
      page.waitForEvent('dialog').then(async (dialog) => {
        expect(dialog.message()).toBe('Hello');
        await dialog.accept();
      }),
      button.click(),
    ]);
  });

  test('toolbar and canvas show the same brand users expect (Star Tribune ↔ Varsity)', async ({
    page,
  }) => {
    await page.goto('/?path=/story/actions-button--configurable');

    const preview = page.frameLocator('#storybook-preview-iframe');
    const button = preview.getByRole('button', { name: 'See More' });
    await expect(button).toBeVisible({ timeout: 60_000 });

    const readBackground = () => button.evaluate((el) => getComputedStyle(el).backgroundColor);

    // Manager UI: users (and AT) see which brand theme is active from the toolbar control.
    await expect(
      page.getByRole('button', { name: /Brand theme for components Star Tribune$/ })
    ).toBeVisible();

    // Canvas: DesignSystemProvider sets `data-ds-brand` on `<html>` — this is what drives
    // brand tokens/CSS so the preview matches the selected product brand.
    await expect(preview.locator('html')).toHaveAttribute('data-ds-brand', 'startribune');

    const startTribuneBg = await readBackground();

    await selectToolbarBrand(page, 'Varsity');

    await expect(
      page.getByRole('button', { name: /Brand theme for components Varsity$/ })
    ).toBeVisible();
    await expect(preview.locator('html')).toHaveAttribute('data-ds-brand', 'varsity', {
      timeout: 15_000,
    });

    const varsityBg = await readBackground();
    expect(startTribuneBg, 'filled brand button should look different per brand').not.toBe(
      varsityBg
    );

    await selectToolbarBrand(page, 'Star Tribune');

    await expect(
      page.getByRole('button', { name: /Brand theme for components Star Tribune$/ })
    ).toBeVisible();
    await expect(preview.locator('html')).toHaveAttribute('data-ds-brand', 'startribune', {
      timeout: 15_000,
    });
    await expect.poll(readBackground).toBe(startTribuneBg);
  });
});
