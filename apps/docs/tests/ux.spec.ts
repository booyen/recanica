import { expect, test, type Page } from "@playwright/test";
import { appPages, publicPages } from "./pages";

/**
 * UX audit: usability problems a layout check can't see.
 *  - controls with no accessible name (icon buttons screen readers announce as "button")
 *  - tap targets under 24×24px on touch screens (WCAG 2.5.8)
 *  - form fields with no label
 *  - duplicate ids (break label/aria wiring)
 *  - links that open nothing ("#", empty href)
 */
async function audit(page: Page) {
  return page.evaluate(() => {
    const out: string[] = [];
    const vis = (el: Element) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none"; };
    const desc = (el: Element) => `<${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}> "${(el.textContent ?? "").trim().slice(0, 30)}"`;
    const skip = (el: Element) => !!el.closest("[data-audit-ignore], nextjs-portal, [aria-hidden=true], iframe");
    const targets = [...document.querySelectorAll("button, a[href], [role=button], [role=tab], [role=menuitem]")].filter((el) => vis(el) && !skip(el) && el.getAttribute("tabindex") !== "-1");
    const rects = targets.map((t) => t.getBoundingClientRect());
    // WCAG 2.5.8 spacing exception: a target under 24px passes if a 24px circle centred on it touches no other target.
    const spaced = (i: number) => {
      const r = rects[i]; const cx = r.x + r.width / 2; const cy = r.y + r.height / 2;
      return rects.every((o, j) => {
        if (j === i || targets[j].contains(targets[i]) || targets[i].contains(targets[j])) return true;
        const dx = Math.max(o.left - cx, 0, cx - o.right); const dy = Math.max(o.top - cy, 0, cy - o.bottom);
        return Math.hypot(dx, dy) >= 12;
      });
    };
    for (const [i, el] of targets.entries()) {
      const forLabel = el.id ? document.querySelector(`label[for="${CSS.escape(el.id)}"]`) : null;
      const name = ((forLabel as HTMLElement | null)?.innerText || el.closest("label")?.innerText || el.getAttribute("aria-label") || el.getAttribute("title") || (el as HTMLElement).innerText || el.getAttribute("aria-labelledby") || el.querySelector("img[alt]")?.getAttribute("alt") || "").trim();
      if (!name) out.push(`unnamed-control ${desc(el)} ${el.outerHTML.slice(0, 80)}`);
      if (matchMedia("(pointer: coarse)").matches) {
        const r = el.getBoundingClientRect();
        const inline = getComputedStyle(el).display === "inline"; // links inside a sentence are exempt (WCAG 2.5.8)
        // A small control with a clickable label (checkbox, radio) is fine: the label is the target.
        if (!inline && !forLabel && !el.closest("label") && (r.width < 24 || r.height < 24) && !spaced(i)) out.push(`small-target ${Math.round(r.width)}×${Math.round(r.height)} ${desc(el)}`);
      }
      const href = el.getAttribute("href");
      if (el.tagName === "A" && (href === "#" || href === "")) out.push(`dead-link ${desc(el)}`);
    }
    for (const el of document.querySelectorAll("input:not([type=hidden]), select, textarea")) {
      if (!vis(el) || skip(el)) continue;
      const id = el.id;
      const labelled = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby") || (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) || el.closest("label") || el.getAttribute("title");
      if (!labelled) out.push(`unlabelled-field ${desc(el)} placeholder="${el.getAttribute("placeholder") ?? ""}"`);
    }
    const ids = new Map<string, number>();
    for (const el of document.querySelectorAll("[id]")) if (!skip(el)) ids.set(el.id, (ids.get(el.id) ?? 0) + 1);
    for (const [id, n] of ids) if (n > 1 && id) out.push(`duplicate-id #${id} ×${n}`);
    return out;
  });
}

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
