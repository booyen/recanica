import { expect, test, type Page } from "@playwright/test";
import catalog from "../lib/catalog.json";
import { slugify } from "../lib/kit";

/**
 * Coverage: the demos must show everything the docs list.
 * Every component, pattern, block and web section in lib/catalog.json has to render somewhere a buyer would look:
 * the dashboard demo's UI kit (/demo/app/ui/*), its patterns gallery, or the website's section index (/site/sections).
 * Adding something to the catalog without a demo fails here.
 */
const slug = slugify;

async function kitItems(page: Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  return page.locator("[data-kit-item]").evaluateAll((els) => els.map((e) => e.getAttribute("data-kit-item")));
}

test.describe("demo coverage", () => {
  test.skip(({ isMobile }) => !!isMobile, "structure check, one viewport is enough");
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/sign-in");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/demo/app");
  });

  test("every component is live in the UI kit", async ({ page }) => {
    const seen = new Set<string>();
    for (const cat of new Set(catalog.components.map((c) => c.category))) {
      for (const s of await kitItems(page, `/demo/app/ui/${slug(cat)}`)) if (s) seen.add(s);
      await expect(page.getByText("No example yet.")).toHaveCount(0);
    }
    const missing = catalog.components.map((c) => c.slug).filter((s) => !seen.has(s));
    expect(missing, "components missing from /demo/app/ui").toEqual([]);
  });

  test("every pattern and block is in the gallery", async ({ page }) => {
    const seen = new Set(await kitItems(page, "/demo/app/ui/patterns"));
    const missing = [...catalog.patterns, ...catalog.blocks].map((p) => p.slug).filter((s) => !seen.has(s));
    expect(missing, "patterns/blocks missing from /demo/app/ui/patterns").toEqual([]);
  });

  test("every web section is on the sections page", async ({ page }) => {
    const seen = new Set(await kitItems(page, "/site/sections"));
    const missing = catalog.web.map((w) => w.slug).filter((s) => !seen.has(s));
    expect(missing, "web sections missing from /site/sections").toEqual([]);
  });
});
