/**
 * Recanica browser audit — the same checks the Recanica repo runs on every page, usable in any project.
 * `auditPage` runs inside the page (pass it to Playwright's page.evaluate). It returns [{ rule, detail }].
 *
 * Layout rules:  page-overflow, text-overflow, clipped-text, wrapped-label, overlap, table-edges,
 *                surface-padding, stretched-rows
 * UX rules:      unnamed-control, small-target (WCAG 2.5.8, touch only), dead-link, unlabelled-field, duplicate-id
 * Opt out for one element (and its children) with data-audit-ignore.
 */
export function auditPage() {
  const layout = (() => {
    const issues = [];
    const describe = (el) => {
      const cls = (el.getAttribute("class") ?? "").split(/\s+/).slice(0, 4).join(".");
      const text = (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 40);
      return `<${el.tagName.toLowerCase()}${cls ? "." + cls : ""}> "${text}"`;
    };
    const visible = (el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return cs.display !== "none" && cs.visibility !== "hidden" && r.width > 0 && r.height > 0;
    };
    const insideScroller = (el) => {
      for (let p = el.parentElement; p; p = p.parentElement) {
        const o = getComputedStyle(p).overflowX;
        if (o === "auto" || o === "scroll") return true;
      }
      return false;
    };

    if (document.documentElement.scrollWidth > window.innerWidth + 1) {
      issues.push({ rule: "page-overflow", detail: `${document.documentElement.scrollWidth}px wide in a ${window.innerWidth}px viewport` });
    }

    // Tables: the first and last visible cell of each row sit the same distance from the edge.
    for (const tr of Array.from(document.querySelectorAll("tr"))) {
      if (!visible(tr) || tr.closest("[data-audit-ignore]")) continue;
      const cells = Array.from(tr.children).filter((c) => visible(c) && getComputedStyle(c).display !== "none");
      if (cells.length < 2 || cells.some((c) => c.colSpan > 1)) continue;
      const l = parseFloat(getComputedStyle(cells[0]).paddingLeft);
      const r = parseFloat(getComputedStyle(cells[cells.length - 1]).paddingRight);
      if (Math.abs(l - r) > 1) { issues.push({ rule: "table-edges", detail: `${describe(tr)} left ${l}px vs right ${r}px` }); break; }
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

      // Short control labels (buttons, badges, tabs, table headers) must never break onto two lines.
      // Counts the rendered lines of each text run, so tall buttons and multi-line cards don't trip it.
      if (el.matches("button, [data-slot=badge], [role=tab], th, [data-slot=button]")) {
        const label = (el.textContent ?? "").trim().replace(/\s+/g, " ");
        if (label && label.length <= 32) {
          const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          let wrapped = false;
          for (let n = walker.nextNode(); n && !wrapped; n = walker.nextNode()) {
            if (!(n.textContent ?? "").trim()) continue;
            const r = document.createRange();
            r.selectNodeContents(n);
            const tops = new Set(Array.from(r.getClientRects()).filter((b) => b.width > 0).map((b) => Math.round(b.top)));
            if (tops.size > 1) wrapped = true;
          }
          if (wrapped) issues.push({ rule: "wrapped-label", detail: describe(el) });
        }
      }

      // Content that paints past its own box into the next item in a row (e.g. a long label over a progress bar).
      if (/flex|grid/.test(cs.display) && !(cs.display.includes("flex") && cs.flexDirection.startsWith("column"))) {
        const kids = Array.from(el.children).filter((k) => visible(k) && getComputedStyle(k).position !== "absolute" && getComputedStyle(k).position !== "fixed");
        const boxes = kids.map((k) => {
          const r = k.getBoundingClientRect();
          const ov = getComputedStyle(k).overflowX;
          const painted = ov === "visible" ? Math.max(r.right, r.left + k.scrollWidth) : r.right;
          return { k, r, painted };
        }).sort((a, b) => a.r.left - b.r.left);
        for (let i = 0; i < boxes.length - 1; i++) {
          const a = boxes[i], b = boxes[i + 1];
          const sameLine = a.r.top < b.r.bottom - 1 && b.r.top < a.r.bottom - 1;
          const grip = (x) => x.matches("[role=separator], [data-slot=resizable-handle], [data-slot=separator]");
          if (sameLine && !grip(a.k) && a.painted > b.r.left + 2 && a.r.right <= b.r.left + 2) {
            issues.push({ rule: "overlap", detail: `${describe(a.k)} runs ${Math.round(a.painted - b.r.left)}px into ${describe(b.k)}` });
          }
        }
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

  })();
  const ux = (() => {
    const out = [];
    const vis = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none"; };
    const desc = (el) => `<${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}> "${(el.textContent ?? "").trim().slice(0, 30)}"`;
    const skip = (el) => !!el.closest("[data-audit-ignore], nextjs-portal, [aria-hidden=true], iframe");
    const targets = [...document.querySelectorAll("button, a[href], [role=button], [role=tab], [role=menuitem]")].filter((el) => vis(el) && !skip(el) && el.getAttribute("tabindex") !== "-1");
    const rects = targets.map((t) => t.getBoundingClientRect());
    // WCAG 2.5.8 spacing exception: a target under 24px passes if a 24px circle centred on it touches no other target.
    const spaced = (i) => {
      const r = rects[i]; const cx = r.x + r.width / 2; const cy = r.y + r.height / 2;
      return rects.every((o, j) => {
        if (j === i || targets[j].contains(targets[i]) || targets[i].contains(targets[j])) return true;
        const dx = Math.max(o.left - cx, 0, cx - o.right); const dy = Math.max(o.top - cy, 0, cy - o.bottom);
        return Math.hypot(dx, dy) >= 12;
      });
    };
    for (const [i, el] of targets.entries()) {
      const forLabel = el.id ? document.querySelector(`label[for="${CSS.escape(el.id)}"]`) : null;
      const name = (forLabel?.innerText || el.closest("label")?.innerText || el.getAttribute("aria-label") || el.getAttribute("title") || el.innerText || el.getAttribute("aria-labelledby") || el.querySelector("img[alt]")?.getAttribute("alt") || "").trim();
      if (!name) out.push({ rule: "unnamed-control", detail: `${desc(el)} ${el.outerHTML.slice(0, 80)}` });
      if (matchMedia("(pointer: coarse)").matches) {
        const r = el.getBoundingClientRect();
        const inline = getComputedStyle(el).display === "inline"; // links inside a sentence are exempt (WCAG 2.5.8)
        // A small control with a clickable label (checkbox, radio) is fine: the label is the target.
        if (!inline && !forLabel && !el.closest("label") && (r.width < 24 || r.height < 24) && !spaced(i)) out.push({ rule: "small-target", detail: `${Math.round(r.width)}×${Math.round(r.height)} ${desc(el)}` });
      }
      const href = el.getAttribute("href");
      if (el.tagName === "A" && (href === "#" || href === "")) out.push({ rule: "dead-link", detail: `${desc(el)}` });
    }
    for (const el of document.querySelectorAll("input:not([type=hidden]), select, textarea")) {
      if (!vis(el) || skip(el)) continue;
      const id = el.id;
      const labelled = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby") || (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) || el.closest("label") || el.getAttribute("title");
      if (!labelled) out.push({ rule: "unlabelled-field", detail: `${desc(el)} placeholder="${el.getAttribute("placeholder") ?? ""}"` });
    }
    const ids = new Map();
    for (const el of document.querySelectorAll("[id]")) if (!skip(el)) ids.set(el.id, (ids.get(el.id) ?? 0) + 1);
    for (const [id, n] of ids) if (n > 1 && id) out.push({ rule: "duplicate-id", detail: `#${id} ×${n}` });
    return out;
  })();
  // Surfaces (bordered, rounded containers) keep equal left/right padding.
  const surfaces = [];
  for (const el of document.querySelectorAll("body *")) {
    if (el.closest("[data-audit-ignore], svg")) continue;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.width < 120 || cs.display === "none" || parseFloat(cs.borderLeftWidth) === 0 || parseFloat(cs.borderTopLeftRadius) < 12) continue;
    const l = parseFloat(cs.paddingLeft), rt = parseFloat(cs.paddingRight);
    if (Math.abs(l - rt) > 1) surfaces.push({ rule: "surface-padding", detail: `<${el.tagName.toLowerCase()}.${(el.getAttribute("class") ?? "").split(/\s+/).slice(0, 3).join(".")}> left ${l}px vs right ${rt}px` });
  }
  return [...layout, ...ux, ...surfaces];
}

export const LAYOUT_RULES = ["page-overflow", "text-overflow", "clipped-text", "wrapped-label", "overlap", "table-edges", "surface-padding", "stretched-rows"];
export const UX_RULES = ["unnamed-control", "small-target", "dead-link", "unlabelled-field", "duplicate-id"];

/**
 * Recanica spec + consistency audit. Runs inside the page; reads the design tokens from the page itself,
 * so it checks the rendered result against Recanica's spec, not generic "good practice".
 * Pass COPY_RULES_SOURCE (from copy-rules.js) to also check the text people actually see.
 *
 * Spec rules:
 *  - spec-color        an opaque text/background/border colour that isn't one of Recanica's semantic tokens
 *  - spec-weight       font weight above 500 (Recanica type is light/regular, medium at most)
 *  - spec-font         text not set in the --font-sans family
 *  - spec-button       a button that isn't a pill, or not one of the button heights (24/32/36/40/44)
 *  - spec-radius       a bordered surface with a radius outside the radius scale
 *  - spec-copy         AI jargon, filler or placeholder text in rendered copy
 * Consistency rules:
 *  - inconsistent      instances of the same component (data-slot + variant + size) rendered differently
 *                      on one page: radius, padding, height, font size or weight
 */
export function auditSpec(copyRules = []) {
  const issues = [];
  const root = getComputedStyle(document.documentElement);
  const skip = (el) => !!el.closest("svg, pre, code, img, video, canvas, iframe, [data-audit-ignore], nextjs-portal, .sr-only, [aria-hidden=true]");
  const visible = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && parseFloat(s.opacity) > 0; };
  const describe = (el) => `<${el.tagName.toLowerCase()}${el.getAttribute("data-slot") ? "[" + el.getAttribute("data-slot") + "]" : ""}.${(el.getAttribute("class") ?? "").split(/\s+/).slice(0, 3).join(".")}> "${(el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 30)}"`;

  // Palette: resolve every semantic colour token to rgb via a canvas, so oklch/hex/named all compare equal.
  const ctx = document.createElement("canvas").getContext("2d");
  const toRgb = (c) => {
    if (!c || c === "transparent") return null;
    ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = "#000"; ctx.fillStyle = c; ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return d[3] < 250 ? null : [d[0], d[1], d[2]]; // only opaque colours are compared
  };
  const TOKENS = ["background", "foreground", "surface", "panel", "card", "card-foreground", "popover", "popover-foreground", "primary", "primary-foreground",
    "secondary", "secondary-foreground", "muted", "muted-foreground", "accent", "accent-foreground", "brand", "brand-foreground", "destructive",
    "destructive-foreground", "success", "warning", "border", "input", "ring", "sidebar", "sidebar-foreground", "sidebar-accent", "sidebar-border",
    "sidebar-primary", "sidebar-primary-foreground", "sidebar-accent-foreground", "chart-1", "chart-2", "chart-3", "chart-4", "chart-5"];
  const palette = TOKENS.map((t) => root.getPropertyValue(`--${t}`).trim()).filter(Boolean).map(toRgb).filter(Boolean);
  const inPalette = (rgb) => palette.some((p) => Math.abs(p[0] - rgb[0]) <= 3 && Math.abs(p[1] - rgb[1]) <= 3 && Math.abs(p[2] - rgb[2]) <= 3);
  const radiusBase = parseFloat(root.getPropertyValue("--radius")) * (root.getPropertyValue("--radius").includes("rem") ? 16 : 1) || 12;
  const RADII = [0, radiusBase - 4, radiusBase - 2, radiusBase, radiusBase + 4, radiusBase + 8, radiusBase + 12];
  const fontFamily = (root.getPropertyValue("--font-sans").split(",")[0] || "").trim().replace(/["']/g, "");
  const BUTTON_HEIGHTS = [24, 32, 36, 40, 44];

  const once = new Set();
  const report = (rule, detail) => { const k = rule + detail; if (!once.has(k)) { once.add(k); issues.push({ rule, detail }); } };
  const groups = new Map();

  for (const el of document.querySelectorAll("body *")) {
    if (skip(el) || !visible(el)) continue;
    const cs = getComputedStyle(el);
    if (el.getAnimations?.().length) continue; // mid-transition colours aren't the real ones
    const hasText = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim());

    if (hasText) {
      const c = toRgb(cs.color);
      if (c && palette.length && !inPalette(c)) report("spec-color", `${describe(el)} text ${cs.color}`);
      if (parseInt(cs.fontWeight, 10) > 500) report("spec-weight", `${describe(el)} weight ${cs.fontWeight}`);
      if (fontFamily && !/mono/i.test(cs.fontFamily) && !cs.fontFamily.includes(fontFamily) && !cs.fontFamily.includes(root.getPropertyValue("--font-geist-sans").split(",")[0].trim().replace(/["']/g, ""))) report("spec-font", `${describe(el)} font ${cs.fontFamily.slice(0, 40)}`);
    }
    const bg = toRgb(cs.backgroundColor);
    if (bg && palette.length && !inPalette(bg) && !cs.backgroundImage.includes("url(")) report("spec-color", `${describe(el)} background ${cs.backgroundColor}`);
    if (parseFloat(cs.borderTopWidth) > 0) {
      const b = toRgb(cs.borderTopColor);
      if (b && palette.length && !inPalette(b)) report("spec-color", `${describe(el)} border ${cs.borderTopColor}`);
    }
    if (cs.backgroundImage.includes("gradient")) report("spec-color", `${describe(el)} gradient (brand is flat)`);

    const slot = el.getAttribute("data-slot");
    const r = el.getBoundingClientRect();
    if (slot === "button" && el.getAttribute("data-variant") !== "link" && !el.closest("[data-slot=button-group], [data-slot=input-group]")) {
      const radius = parseFloat(cs.borderTopLeftRadius);
      if (radius < r.height / 2 - 1) report("spec-button", `${describe(el)} radius ${radius}px on ${Math.round(r.height)}px: buttons are pills`);
      if (!BUTTON_HEIGHTS.some((h) => Math.abs(h - r.height) <= 1)) report("spec-button", `${describe(el)} height ${Math.round(r.height)}px (allowed ${BUTTON_HEIGHTS.join("/")})`);
    }
    if (parseFloat(cs.borderTopWidth) > 0 && r.width >= 160 && r.height >= 48) {
      const radius = parseFloat(cs.borderTopLeftRadius);
      if (radius < r.height / 2 - 1 && !RADII.some((x) => Math.abs(x - radius) <= 0.5)) report("spec-radius", `${describe(el)} radius ${radius}px (scale ${RADII.join("/")})`);
    }

    // Consistency: same component, same look. Compared like with like: same variant, size, state and icon use.
    // Limited to parts where sameness is the point (controls, surfaces, messages); content cells vary by design.
    const CONSISTENT = /^(button|badge|input|textarea|select-trigger|native-select|tabs-list|tabs-trigger|toggle|card|alert|field-message|form-message|stat|kbd|dialog-content|sheet-content)$/;
    if (slot && CONSISTENT.test(slot) && !el.closest("[data-slot=button-group], [data-slot=input-group], [data-slot=toggle-group]")) {
      const state = ["data-active", "aria-current", "data-state", "aria-invalid", "aria-pressed"].map((a) => el.getAttribute(a) ?? "").join(",");
      const key = [slot, el.getAttribute("data-variant") ?? "", el.getAttribute("data-size") ?? "", el.querySelector(":scope > svg") ? "icon" : "", state].join("|");
      const isControl = /^(button|input|select-trigger|native-select|badge|tabs-trigger|toggle)$/.test(slot);
      const sig = [cs.borderTopLeftRadius, cs.paddingLeft, cs.fontSize, cs.fontWeight, isControl ? Math.round(r.height) : ""].join(" ").trim();
      if (!groups.has(key)) groups.set(key, new Map());
      const g = groups.get(key);
      if (!g.has(sig)) g.set(sig, []);
      g.get(sig).push(el);
    }
  }
  for (const [key, sigs] of groups) {
    if (sigs.size < 2) continue;
    const sorted = [...sigs.entries()].sort((a, b) => b[1].length - a[1].length);
    const [norm, normEls] = sorted[0];
    if (normEls.length < 2) continue; // no clear majority to compare against
    for (const [sig, els] of sorted.slice(1)) report("inconsistent", `${key.split("|").filter(Boolean).join(" ")}: ${els.length}× "${sig}" vs usual "${norm}" e.g. ${describe(els[0])}`);
  }

  // Copy: check the text people actually see.
  if (copyRules.length) {
    const rules = copyRules.filter((r) => r[3] === "error").map(([src, flags, msg]) => [new RegExp(src, flags), msg]);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const p = n.parentElement;
      if (!p || skip(p) || !visible(p)) continue;
      const t = n.textContent;
      for (const [re, msg] of rules) { const m = t.match(re); if (m) report("spec-copy", `"${m[0]}" ${msg} in ${describe(p)}`); }
    }
  }
  return issues;
}

export const SPEC_RULES = ["spec-color", "spec-weight", "spec-font", "spec-button", "spec-radius", "spec-copy", "inconsistent"];
