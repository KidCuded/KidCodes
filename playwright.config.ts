import { defineConfig, devices } from '@playwright/test';

// Tests run against a LOCAL dev server on port 3100 only.
// Never point this at production (https://kid-codes.vercel.app): that is the live old site.
const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  timeout: 60_000, // the dev server compiles routes on first hit
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  // Starts `next dev -p 3100` if nothing is listening there yet, and stops it when the run ends.
  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 180_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 768 } },
      grepInvert: /@portrait/,
    },
    {
      // Portrait phone size (390×844) with touch, for the tap checks.
      name: 'portrait',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: true,
      },
      grep: /@portrait/,
    },
  ],
});
