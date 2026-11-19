import { expect, test } from "@playwright/test";
import catalog from "../lib/catalog.json";
import { auditLayout } from "./audit";

/**
 * Component QA: every component rendered at 240px, 400px and full width (/qa/<slug>).
 * Fails when a component doesn't fit its container, overlaps itself, wraps a label, or throws.
 * Also keeps a screenshot per component so any visual change shows up as a diff (update with --update-snapshots).
 */
test.describe("component qa", () => {
  for (const c of catalog.components) {
    test(c.slug, async ({ page }) => {
      test.skip(test.info().project.name !== "desktop", "boards set their own widths");
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(`/qa/${c.slug}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(300);
      // Content wider than its frame = the component can't live in that container.
      const spill = await page.$$eval("[data-qa-frame]", (frames) =>
        frames.flatMap((f) => {
          const box = f.querySelector("[data-qa-box]") as HTMLElement | null;
          if (!box) return []; // frame narrower than the component's declared minWidth
          const b = box.getBoundingClientRect();
          const out: string[] = [];
          for (const el of box.querySelectorAll("*")) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || getComputedStyle(el).position === "fixed") continue;
            // Content inside a clipping or scrolling box (carousel track, progress fill, scroll areas) is contained by design.
            let clipped = false;
            for (let a = el.parentElement; a && a !== box; a = a.parentElement) if (getComputedStyle(a).overflowX !== "visible") { clipped = true; break; }
            if (clipped || el.closest("[data-radix-popper-content-wrapper]")) continue;
            if (r.right > b.right + 1 || r.left < b.left - 1) { out.push(`${f.getAttribute("data-qa-frame")}: <${el.tagName.toLowerCase()} ${(el.getAttribute("class") ?? "").slice(0, 40)}> ${Math.round(r.right - b.right)}px past the frame`); break; }
          }
          return out;
        }),
      );
      const issues = await auditLayout(page);
      expect.soft(errors, "runtime errors").toEqual([]);
      expect.soft(spill, "content outside its container").toEqual([]);
      expect.soft(issues.filter((i) => i.rule !== "page-overflow"), "layout issues").toEqual([]);
      await expect.soft(page).toHaveScreenshot(`qa-${c.slug}.png`, { fullPage: true, maxDiffPixelRatio: 0.01 });
    });
  }
});
