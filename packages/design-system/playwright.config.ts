import { defineConfig, devices } from '@playwright/test';

/**
 * E2E tests against Storybook. Run `yarn storybook` locally or let Playwright start it via webServer.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:6006',
    trace: 'on-first-retry',
    // Real Chromium either way; headless = no window. CI stays headless; locally you see the browser.
    headless: !!process.env.CI,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'yarn storybook',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
