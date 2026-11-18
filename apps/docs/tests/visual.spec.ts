import { expect, test } from "@playwright/test";

/** Key compositions. Baselines are per platform; regenerate with --update-snapshots after intended changes. */
const pages = [
  ["home", "/"],
  ["docs-ai", "/docs/ai"],
  ["foundations-colors", "/docs/foundations/colors"],
  ["component-button", "/docs/components/button"],
  ["pattern-data-table", "/view/patterns/data-table"],
  ["pattern-settings", "/view/patterns/settings-page"],
  ["block-pricing", "/view/blocks/pricing-01"],
  ["block-invoice", "/view/blocks/invoice-01"],
  ["demo-pay-invoice", "/demo/pay/inv_2"],
  ["stress", "/demo/stress"],
] as const;

test.describe("visual", () => {
  for (const [name, path] of pages) {
    test(name, async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });
      await page.addStyleTag({ content: "nextjs-portal{display:none!important} *{caret-color:transparent!important}" });
      await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
    });
  }
});
