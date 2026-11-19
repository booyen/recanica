import { expect, test } from "@playwright/test";
import catalog from "../lib/catalog.json";
import { auditRecanicaSpec } from "./audit";
import { appPages, publicPages } from "./pages";

/**
 * Recanica spec + consistency on every page: semantic token colours only, no weight above medium,
 * pill buttons at the allowed heights, radius from the scale, the same component looking the same
 * everywhere on a page, and no AI-jargon / placeholder copy in what's rendered.
 */
const qaPages = catalog.components.map((c) => `/qa/${c.slug}`);

// Spec is about values, not widths: desktop and mobile are enough (tablet is covered by the layout audit).
test.beforeEach(({}, info) => test.skip(info.project.name === "tablet", "spec checked at desktop and mobile"));

test.describe("recanica spec · public", () => {
  for (const path of [...publicPages, ...qaPages]) test(path, async ({ page }) => {
    await page.goto(path, { waitUntil: "networkidle" });
    expect.soft(await auditRecanicaSpec(page), path).toEqual([]);
  });
});

test.describe("recanica spec · demo app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/sign-in");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/demo/app");
  });
  for (const path of appPages) test(path, async ({ page }) => {
    await page.goto(path, { waitUntil: "networkidle" });
    expect.soft(await auditRecanicaSpec(page), path).toEqual([]);
  });
});
