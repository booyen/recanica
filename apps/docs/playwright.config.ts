import { defineConfig, devices } from "@playwright/test";

/**
 * Two suites:
 *   pnpm test:layout   automatic layout audit on every page (overflow, clipped text, stretched rows, runtime errors)
 *   pnpm test:visual   screenshot diffs for key pages (update with: pnpm test:visual --update-snapshots)
 *
 * By default the tests start a production server on :3101 (run `pnpm build` first).
 * Point at a running server instead with BASE_URL=http://localhost:3100.
 */
const PORT = 3101;
const baseURL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  timeout: 120_000,
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" } },
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}-{projectName}-{platform}{ext}",
  use: { baseURL, colorScheme: "dark" },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 375, height: 812 } } },
    { name: "tablet", use: { ...devices["Desktop Chrome"], viewport: { width: 900, height: 1100 } } },
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } } },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : { command: `pnpm start --port ${PORT}`, url: baseURL, reuseExistingServer: !!process.env.REUSE_SERVER, timeout: 120_000 }, // never silently reuse a server that may serve an older build
});
