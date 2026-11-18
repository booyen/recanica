import type { Page } from "@playwright/test";

export type Issue = { rule: string; detail: string };

/**
 * Runs in the page. Rules:
 *  - page-overflow     the page scrolls horizontally
 *  - text-overflow     text sticks out of its own box (long unbroken strings)
 *  - clipped-text      text is cut by overflow:hidden without an ellipsis
 *  - stretched-rows    a single-column grid spreads its rows apart (gap much larger than declared):
 *                      the bug class where a grid inherits height from a taller sibling
 */
export async function auditLayout(page: Page): Promise<Issue[]> {
  return page.evaluate(() => {
    const issues: { rule: string; detail: string }[] = [];
    const describe = (el: Element) => {
      const cls = (el.getAttribute("class") ?? "").split(/\s+/).slice(0, 4).join(".");
      const text = (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 40);
      return `<${el.tagName.toLowerCase()}${cls ? "." + cls : ""}> "${text}"`;
    };
    const visible = (el: Element) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return cs.display !== "none" && cs.visibility !== "hidden" && r.width > 0 && r.height > 0;
    };
    const insideScroller = (el: Element) => {
      for (let p = el.parentElement; p; p = p.parentElement) {
        const o = getComputedStyle(p).overflowX;
        if (o === "auto" || o === "scroll") return true;
      }
      return false;
    };

    if (document.documentElement.scrollWidth > window.innerWidth + 1) {
      issues.push({ rule: "page-overflow", detail: `${document.documentElement.scrollWidth}px wide in a ${window.innerWidth}px viewport` });
    }

    for (const el of Array.from(document.querySelectorAll("body *"))) {
      if (!visible(el) || el.closest("svg, pre, code, [data-audit-ignore], nextjs-portal, .sr-only")) continue;
      const cs = getComputedStyle(el);
      // Visually-hidden (screen-reader only) boxes are 1px on purpose.
      if (cs.clip !== "auto" && cs.clip !== "" || el.getBoundingClientRect().width <= 1) continue;
      const hasOwnText = Array.from(el.childNodes).some((n) => n.nodeType === 3 && (n.textContent ?? "").trim().length > 0);
      const isBlockish = cs.display !== "inline" && cs.display !== "contents";

      if (hasOwnText && isBlockish && el.scrollWidth > el.clientWidth + 2 && !insideScroller(el)) {
        const clipped = cs.overflowX === "hidden" || cs.overflowX === "clip";
        if (clipped && cs.textOverflow !== "ellipsis") issues.push({ rule: "clipped-text", detail: describe(el) });
        else if (!clipped) issues.push({ rule: "text-overflow", detail: `${describe(el)} (${el.scrollWidth}px in ${el.clientWidth}px)` });
      }

      if (cs.display === "grid") {
        const kids = Array.from(el.children).filter(visible).map((k) => k.getBoundingClientRect());
        const singleColumn = kids.length >= 3 && kids.every((k) => Math.abs(k.left - kids[0].left) < 2);
        if (singleColumn) {
          const declared = parseFloat(cs.rowGap) || 0;
          const gaps = kids.slice(1).map((k, i) => k.top - kids[i].bottom);
          const worst = Math.max(...gaps);
          if (worst > declared + 32) issues.push({ rule: "stretched-rows", detail: `${describe(el)} gap ${Math.round(worst)}px vs declared ${declared}px` });
        }
      }
    }
    return issues;
  });
}
