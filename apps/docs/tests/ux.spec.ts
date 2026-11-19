import { expect, test } from "@playwright/test";
import { auditUx } from "./audit";
import { appPages, publicPages } from "./pages";

/**
 * UX audit: usability problems a layout check can't see.
 *  - controls with no accessible name (icon buttons screen readers announce as "button")
 *  - tap targets under 24×24px on touch screens (WCAG 2.5.8)
 *  - form fields with no label
 *  - duplicate ids (break label/aria wiring)
 *  - links that open nothing ("#", empty href)
 */
const audit = auditUx;

const pages = [...publicPages.filter((p) => !p.startsWith("/view/") && !p.startsWith("/docs/components/")), "/docs/components/button", "/docs/components/field"];

test.describe("ux audit · public", () => {
  for (const path of pages) test(path, async ({ page }) => {
    await page.goto(path, { waitUntil: "networkidle" });
    expect.soft(await audit(page), path).toEqual([]);
  });
});

test.describe("ux audit · demo app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/sign-in");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/demo/app");
  });
  for (const path of appPages) test(path, async ({ page }) => {
    await page.goto(path, { waitUntil: "networkidle" });
    expect.soft(await audit(page), path).toEqual([]);
  });
});
