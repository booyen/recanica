import { expect, test, type Page } from "@playwright/test";
import { auditLayout } from "./audit";
import { appPages, publicPages } from "./pages";

async function check(page: Page, path: string) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/favicon|Download the React DevTools/.test(m.text())) errors.push(m.text()); });
  const res = await page.goto(path, { waitUntil: "networkidle" });
  expect(res?.status(), `${path} status`).toBeLessThan(400);
  await page.waitForTimeout(300);
  const issues = await auditLayout(page);
  expect.soft(errors, `${path}: runtime errors`).toEqual([]);
  expect.soft(issues, `${path}: layout issues`).toEqual([]);
}

test.describe("layout audit · public pages", () => {
  for (const path of publicPages) test(path, async ({ page }) => check(page, path));
});

test.describe("layout audit · demo app", () => {
  test.beforeEach(async ({ page }) => {
    // Sign in to the demo (fake auth, state in localStorage).
    await page.goto("/demo/sign-in");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/demo/app");
  });
  for (const path of appPages) test(path, async ({ page }) => check(page, path));
});
