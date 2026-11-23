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
      // Includes a table's label column (first body cell), except code (mono) cells, which may break.
      const labelCell = el.matches("td:first-child") && !/mono/i.test(getComputedStyle(el).fontFamily) && (el.textContent ?? "").trim().split(/\s+/).length <= 4;
      // Rows (ListRow, NavItem, ChoiceCard) hold content, not a short label, so their text may wrap.
      if ((el.matches("button, [data-slot=badge], [role=tab], th, [data-slot=button]") && !el.matches("[data-slot=list-row], [data-slot=nav-item], [data-slot=choice-card]")) || labelCell) {
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
    // A closed <details> hides its content (not clickable, not in the tab order); only its <summary> counts.
    const skip = (el) => !!el.closest("[data-audit-ignore], nextjs-portal, [aria-hidden=true], iframe") || (!!el.closest("details:not([open])") && !el.closest("summary"));
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
      const name = (forLabel?.innerText || el.closest("label")?.innerText || el.getAttribute("aria-label") || el.getAttribute("title") || el.innerText || el.textContent || el.getAttribute("aria-labelledby") || el.querySelector("img[alt]")?.getAttribute("alt") || "").trim();
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

/**
 * Busyness audit: what makes a page feel crowded, measured, with the Recanica way to fix each one.
 * Used by `recanica review` to turn "make it less busy" into a concrete rework plan per page.
 * Measures the first screen of the main content (header, nav and sidebars excluded) and the whole page.
 * Returns { metrics, findings: [{ rule, detail, fix }], signals } — signals help pick a Recanica pattern.
 */
export function auditBusyness(limits = {}) {
  const T = { primaryActions: 1, actions: 18, textSizes: 6, textSizesWithHero: 7, backgrounds: 5, borders: 70, nesting: 3, badges: 8, icons: 24, textChars: 1800, tableColumns: 6, formFields: 10, navRun: 15, ...limits };
  const vh = window.innerHeight;
  const root = getComputedStyle(document.documentElement);
  const main = document.querySelector("main") ?? document.body;
  // Chrome (header/nav/sidebars) and illustrations (product previews drawn inside a hero, marked data-preview) don't count.
  const chrome = (el) => !!el.closest("header, nav, aside, footer, [data-slot=sidebar], [role=navigation], [data-audit-ignore], [data-preview], [role=img], nextjs-portal");
  const visible = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && parseFloat(s.opacity) > 0; };
  const firstScreen = (el) => { const r = el.getBoundingClientRect(); return r.top < vh && r.bottom > 0; };
  const all = [...main.querySelectorAll("*")].filter((el) => visible(el) && !chrome(el));
  const above = all.filter(firstScreen);
  const ctx = document.createElement("canvas").getContext("2d");
  const rgb = (c) => { ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = "#000"; ctx.fillStyle = c; ctx.fillRect(0, 0, 1, 1); const d = ctx.getImageData(0, 0, 1, 1).data; return d[3] < 250 ? null : `${d[0]},${d[1]},${d[2]}`; };
  const primary = rgb(root.getPropertyValue("--primary").trim() || "#000");
  const ownText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());

  const actions = above.filter((el) => el.matches("button, a[href], [role=button], input[type=submit]") && !el.closest("table"));
  const primaries = above.filter((el) => el.matches("button, a[href], [role=button]") && (el.getAttribute("data-variant") === "default" || el.getAttribute("data-variant") === "brand" || (primary && rgb(getComputedStyle(el).backgroundColor) === primary)));
  const fontSizes = new Set(above.filter((el) => ownText(el) && !el.closest("pre, code, kbd")).map((el) => getComputedStyle(el).fontSize)); // what you see at once; code is its own register
  const tinyText = all.filter((el) => ownText(el) && parseFloat(getComputedStyle(el).fontSize) < 12);
  const bgs = new Set(above.map((el) => rgb(getComputedStyle(el).backgroundColor)).filter(Boolean));
  const lines = above.filter((el) => { const s = getComputedStyle(el); return ["Top", "Right", "Bottom", "Left"].some((k) => parseFloat(s[`border${k}Width`]) > 0); });
  const badges = above.filter((el) => el.matches("[data-slot=badge]") || (getComputedStyle(el).borderRadius.includes("9999") && ownText(el) && el.getBoundingClientRect().height < 26 && !el.matches("button, a")));
  const icons = above.filter((el) => el.matches("svg") && el.getBoundingClientRect().width <= 24);
  const textChars = above.filter(ownText).reduce((n, el) => n + [...el.childNodes].filter((c) => c.nodeType === 3).map((c) => c.textContent.trim()).join("").length, 0);
  const isSurface = (el) => { const s = getComputedStyle(el); return (parseFloat(s.borderTopWidth) > 0 && parseFloat(s.borderBottomWidth) > 0 && parseFloat(s.borderTopLeftRadius) >= 6) || (s.boxShadow !== "none" && parseFloat(s.borderTopLeftRadius) >= 6); };
  let depth = 0, deepest = null;
  for (const el of all) {
    if (!isSurface(el) || el.getBoundingClientRect().width < 80) continue;
    let d = 1;
    for (let p = el.parentElement; p && p !== main.parentElement; p = p.parentElement) if (isSurface(p)) d++;
    if (d > depth) { depth = d; deepest = el; }
  }
  const tables = [...main.querySelectorAll("table")].filter(visible);
  const maxCols = Math.max(0, ...tables.map((t) => [...(t.querySelector("tr")?.children ?? [])].filter(visible).length));
  const forms = [...main.querySelectorAll("form")].filter(visible);
  const fieldsIn = (f) => [...f.querySelectorAll("input:not([type=hidden]), select, textarea, [role=combobox], [role=switch], [role=checkbox]")].filter(visible).length;
  const groupsIn = (f) => f.querySelectorAll("fieldset, section, [data-slot=field-set], h2, h3").length;
  const longForm = forms.map((f) => ({ f, n: fieldsIn(f), g: groupsIn(f) })).sort((a, b) => b.n - a.n)[0];
  // Longest single list of links in a navigation (grouped navs are measured per group, not in total).
  let maxNav = 0;
  for (const n of [...document.querySelectorAll("nav, aside, [data-slot=sidebar]")].filter(visible)) {
    for (const box of [n, ...n.querySelectorAll("*")]) {
      const links = [...box.children].filter((c) => visible(c) && (c.matches("a[href], button") || (c.matches("li, div") && c.children.length === 1 && c.firstElementChild.matches("a[href], button"))));
      maxNav = Math.max(maxNav, links.length);
    }
  }
  const h1 = [...document.querySelectorAll("h1")].some(visible);
  const bigNumbers = all.filter((el) => ownText(el) && parseFloat(getComputedStyle(el).fontSize) >= 24 && /[\d]/.test(el.textContent) && el.textContent.trim().length <= 16).length;

  const metrics = {
    primaryActionsFirstScreen: primaries.length, actionsFirstScreen: actions.length, fontSizes: fontSizes.size, backgroundsFirstScreen: bgs.size,
    linesFirstScreen: lines.length, badgesFirstScreen: badges.length, iconsFirstScreen: icons.length, textCharsFirstScreen: textChars,
    surfaceDepth: depth, maxTableColumns: maxCols, longestFormFields: longForm?.n ?? 0, navItems: maxNav, hasTitle: h1,
  };
  const findings = [];
  const add = (rule, detail, fix) => findings.push({ rule, detail, fix });
  if (primaries.length > T.primaryActions) add("busy-primary", `${primaries.length} primary buttons on the first screen`, "Keep one primary action per view. Make the rest outline/ghost, or move them into a ••• menu (DropdownMenu).");
  if (actions.length > T.actions) add("busy-actions", `${actions.length} buttons and links on the first screen`, "Show the 3–5 actions people use most; put the rest in a ••• menu, a row menu, or the page's secondary nav.");
  // Marketing pages with a display-size hero use one more step of the scale; app pages stay at 6.
  const typeLimit = above.some((el) => ownText(el) && parseFloat(getComputedStyle(el).fontSize) >= 44) ? T.textSizesWithHero : T.textSizes;
  if (fontSizes.size > typeLimit) add("busy-type", `${fontSizes.size} different text sizes on the first screen (limit ${typeLimit})`, "Use the type scale: one title, one body size, one small/muted size, one metric size. Hierarchy comes from muted vs foreground, not more sizes.");
  if (bgs.size > T.backgrounds) add("busy-surfaces", `${bgs.size} different background colours on the first screen`, "Use the layer order only: background → panel → card → accent for hover. Remove tinted boxes that don't mean status.");
  if (lines.length > T.borders) add("busy-lines", `${lines.length} bordered elements on the first screen`, "Group related things in one bordered container with hairline dividers (StatGroup, divide-y lists) instead of a border around each item.");
  if (depth >= T.nesting) add("busy-nesting", `boxes nested ${depth} deep (card in card in card)`, "One bordered surface per group. Inner groups use spacing and a heading, not another card.");
  if (badges.length > T.badges) add("busy-badges", `${badges.length} badges/pills on the first screen`, "Use a badge only for status that changes. Plain muted text for categories and metadata.");
  if (icons.length > T.icons) add("busy-icons", `${icons.length} small icons on the first screen`, "Icons only where they speed up scanning (nav, primary actions). Drop decorative icons next to every label.");
  if (textChars > T.textChars) add("busy-text", `${textChars} characters of text on the first screen`, "Lead with the one thing people came for. Move explanations into descriptions, tooltips or a details page.");
  if (maxCols > T.tableColumns) add("busy-table", `a table with ${maxCols} visible columns`, "Keep 4–6 columns; hide secondary ones below md, or use the List / detail pattern with a side panel.");
  if (longForm && longForm.n > T.formFields && longForm.g < 2) add("busy-form", `a form with ${longForm.n} fields and no sections`, "Split into titled sections (Settings page pattern) or steps (Onboarding steps / wizard). Optional fields go behind 'More options'.");
  if (maxNav > T.navRun) add("busy-nav", `a navigation list with ${maxNav} items in one run`, "Top level holds 5–8 items. Group the rest as sub-items (App Sidebar) or move them into a More menu (App Top Nav).");
  if (tinyText.length) add("tiny-text", `${tinyText.length} text elements below 12px`, "Nothing below text-xs (12px). Make the element bigger or drop the text.");
  if (!h1) add("no-title", "no visible page title (h1)", "Every page starts with a Page Header: title, one-line description, actions.");

  const signals = { tables: tables.length, maxTableColumns: maxCols, formFields: longForm?.n ?? 0, bigNumbers, path: location.pathname, title: document.querySelector("h1")?.textContent?.trim() ?? document.title };
  return { metrics, findings, signals, deepest: deepest ? deepest.outerHTML.slice(0, 120) : null };
}

export const BUSY_RULES = ["busy-primary", "busy-actions", "busy-type", "busy-surfaces", "busy-lines", "busy-nesting", "busy-badges", "busy-icons", "busy-text", "busy-table", "busy-form", "busy-nav", "tiny-text", "no-title"];

/**
 * Quality audit: UI, layout, readability and usability measures that define a good Recanica page.
 * Returns { measures, findings: [{ dimension, rule, detail, fix }] }. Feeds the scorecard in `recanica review`.
 */
export function auditQuality() {
  const vh = window.innerHeight;
  const main = document.querySelector("main") ?? document.body;
  const skip = (el) => !!el.closest("[data-audit-ignore], [data-preview], [role=img], nextjs-portal, svg, pre, code");
  const visible = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && parseFloat(s.opacity) > 0.1; };
  const ownText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
  const textEls = [...main.querySelectorAll("*")].filter((el) => !skip(el) && ownText(el) && visible(el));
  const findings = [];
  const add = (dimension, rule, detail, fix) => findings.push({ dimension, rule, detail, fix });

  // --- Readability: contrast (WCAG 2.2 AA), line length, minimum size
  const ctx = document.createElement("canvas").getContext("2d");
  const rgba = (c) => { ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = "rgba(0,0,0,0)"; ctx.fillStyle = c; ctx.fillRect(0, 0, 1, 1); const d = ctx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const bgOf = (el) => {
    const layers = [];
    for (let p = el; p; p = p.parentElement) { const c = rgba(getComputedStyle(p).backgroundColor); if (c[3] > 0) { layers.push(c); if (c[3] >= 0.99) break; } }
    let out = rgba(getComputedStyle(document.body).backgroundColor); if (out[3] < 0.99) out = [255, 255, 255, 1];
    for (const c of layers.reverse()) out = [0, 1, 2].map((i) => c[i] * c[3] + out[i] * (1 - c[3])).concat(1);
    return out;
  };
  let lowContrast = 0, worst = null;
  for (const el of textEls) {
    const cs = getComputedStyle(el);
    if (el.closest("button:disabled, [aria-disabled=true], [data-disabled]")) continue;
    const fg = rgba(cs.color), bg = bgOf(el);
    const mixed = [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3]));
    const L1 = lum(mixed), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const large = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && parseInt(cs.fontWeight) >= 700);
    if (ratio < (large ? 3 : 4.5)) { lowContrast++; if (!worst || ratio < worst.ratio) worst = { ratio, el }; }
  }
  if (lowContrast) add("readability", "contrast", `${lowContrast} text elements below WCAG AA contrast (worst ${worst.ratio.toFixed(2)}:1, "${worst.el.textContent.trim().slice(0, 30)}")`, "Body text needs 4.5:1, large text 3:1. Use foreground or muted-foreground on background/card; don't fade text with opacity.");
  const paras = textEls.filter((el) => el.matches("p, li, dd, blockquote") && el.textContent.trim().length > 120);
  const longLines = paras.filter((el) => { const cs = getComputedStyle(el); const chars = el.getBoundingClientRect().width / (parseFloat(cs.fontSize) * 0.5); return chars > 95; });
  if (longLines.length) add("readability", "line-length", `${longLines.length} paragraphs run past ~90 characters per line`, "Cap reading width at max-w-copy (about 65ch). Long lines are hard to track back.");

  // --- Hierarchy: one clear largest element near the top; a real step between title and body
  const sizes = textEls.map((el) => ({ el, s: parseFloat(getComputedStyle(el).fontSize), top: el.getBoundingClientRect().top + scrollY }));
  const firstScreen = sizes.filter((x) => x.top < vh);
  const maxS = Math.max(0, ...firstScreen.map((x) => x.s));
  const atMax = firstScreen.filter((x) => x.s === maxS).length;
  const bodyS = (() => { const c = {}; for (const x of sizes) c[x.s] = (c[x.s] ?? 0) + x.el.textContent.length; return Number(Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 14); })();
  // Pages that are mostly an embedded frame (previews, viewers) can't be judged on hierarchy from outside the frame.
  const framed = [...document.querySelectorAll("iframe")].some((f) => visible(f) && f.getBoundingClientRect().height > vh * 0.5);
  if (!framed && atMax > 2) add("hierarchy", "no-focal-point", `${atMax} elements share the largest text size on the first screen`, "One element leads (the page title or hero). Section titles step down.");
  if (!framed && maxS && maxS / bodyS < 1.4) add("hierarchy", "flat-hierarchy", `largest text is only ${(maxS / bodyS).toFixed(2)}× the body size`, "Give the title a real step up (title or display size) and keep body at one size.");

  // --- Clarity: title + the main action visible without scrolling (on pages that have actions)
  const h1 = [...document.querySelectorAll("h1")].find(visible);
  if (h1 && h1.getBoundingClientRect().top > vh) add("clarity", "title-below-fold", "the page title is below the first screen", "Start the page with its title (Page Header).");
  const mainActions = [...main.querySelectorAll("button, a[data-slot=button], [role=button]")].filter((el) => visible(el) && !skip(el) && (el.getAttribute("data-variant") === "default" || el.getAttribute("data-variant") === "brand"));
  // Task pages (forms, tables) need their action up front; story pages may end with a call to action.
  const taskPage = !!main.querySelector("table") || [...main.querySelectorAll("form")].some((f) => f.querySelectorAll("input:not([type=hidden]), select, textarea").length >= 3);
  if (taskPage && mainActions.length && !mainActions.some((el) => el.getBoundingClientRect().top < vh)) add("clarity", "action-below-fold", "the main action only appears after scrolling", "Put the primary action in the Page Header or the first screen.");

  // --- Layout: alignment edges, spacing rhythm, content width
  // Centred text starts at a different x on every line by design, so only left-aligned blocks count.
  const blocks = textEls.filter((el) => { const cs = getComputedStyle(el); return cs.display !== "inline" && cs.textAlign !== "center" && !el.closest("[class*=text-center], [class*=items-center][class*=flex-col]") && el.getBoundingClientRect().top < vh * 1.5 && el.getBoundingClientRect().width > 120; });
  const lefts = new Set(blocks.map((el) => Math.round(el.getBoundingClientRect().left / 4) * 4));
  if (lefts.size > 8) add("layout", "alignment", `text starts at ${lefts.size} different left edges on the first screen`, "Align to a few columns: page gutter, card padding, one inner indent.");
  const offScale = [];
  for (const el of main.querySelectorAll("*")) {
    if (skip(el) || !visible(el)) continue;
    const cs = getComputedStyle(el);
    // Odd whole pixels (7px, 13px) are off the grid; fractional values come from fluid clamp() tokens and 1px is a hairline.
      for (const v of [cs.rowGap, cs.columnGap, cs.paddingTop, cs.paddingLeft, cs.marginTop]) { const n = parseFloat(v); if (n > 1 && Number.isInteger(n) && n % 2 !== 0) offScale.push(`${n}px`); }
  }
  if (offScale.length > 6) add("layout", "spacing-rhythm", `${offScale.length} spacings off the 4px grid (e.g. ${[...new Set(offScale)].slice(0, 4).join(", ")})`, "Use the spacing scale (4px steps) and layout tokens (p-panel, px-gutter, gap-6).");
  // Two right edges: paragraphs capped narrower than full-width siblings in the same column (decide width per column, not per element).
  let ragged = 0;
  for (const col of main.querySelectorAll("*")) {
    if (skip(col) || !visible(col)) continue;
    const kids = [...col.children].filter((k) => visible(k) && getComputedStyle(k).display !== "inline" && getComputedStyle(k).position !== "absolute");
    if (kids.length < 3) continue;
    const full = col.getBoundingClientRect().width - parseFloat(getComputedStyle(col).paddingLeft) - parseFloat(getComputedStyle(col).paddingRight);
    if (full < 600 || getComputedStyle(col).display.includes("flex") && !getComputedStyle(col).flexDirection.startsWith("column") || getComputedStyle(col).display === "grid" && getComputedStyle(col).gridTemplateColumns.split(" ").length > 1) continue;
    const wide = kids.some((k) => !k.matches("p, h1, h2, h3, h4, li, ul, ol") && k.getBoundingClientRect().width >= full * 0.98);
    const capped = kids.filter((k) => k.matches("p") && k.textContent.trim().length > 120 && k.getBoundingClientRect().width < full * 0.8);
    if (wide && capped.length) ragged += capped.length;
  }
  if (ragged) add("layout", "two-right-edges", `${ragged} paragraphs stop well short of the full-width blocks beside them`, "Decide width per column, not per element: give the whole column a reading width (max-w-3xl) so text, tables and cards share one right edge.");
  // Ragged sections: a page section whose content is narrower than the page column and sits
  // against the left edge, leaving an empty strip on the right next to full-width sections.
  // A narrow block is fine when it is centred (title, content and note together) or fills the column.
  const sections = [...main.querySelectorAll(":scope > section, :scope > [data-slot=web-section], :scope > .rc-web-section, :scope > * > section")].filter((el) => visible(el) && !skip(el));
  const contentBox = (sec) => {
    const kids = [...sec.querySelectorAll(":scope > *, :scope > * > *")].filter((k) => visible(k) && getComputedStyle(k).position !== "absolute" && getComputedStyle(k).position !== "fixed" && k.getBoundingClientRect().width > 40);
    if (!kids.length) return null;
    const rs = kids.map((k) => k.getBoundingClientRect());
    return { left: Math.min(...rs.map((r) => r.left)), right: Math.max(...rs.map((r) => r.right)) };
  };
  const boxes = sections.map((sec) => ({ sec, box: contentBox(sec) })).filter((b) => b.box);
  if (boxes.length >= 3 && window.innerWidth >= 1024) {
    const colLeft = Math.min(...boxes.map((b) => b.box.left));
    const colRight = Math.max(...boxes.map((b) => b.box.right));
    const colW = colRight - colLeft;
    const ragged = boxes.filter(({ box }) => {
      const w = box.right - box.left;
      const leftAligned = Math.abs(box.left - colLeft) < 8;
      const centred = Math.abs((box.left + box.right) / 2 - (colLeft + colRight) / 2) < 12;
      return colW > 700 && leftAligned && !centred && w < colW * 0.85;
    });
    if (ragged.length) {
      const name = (sec) => (sec.querySelector("h2, h3")?.textContent ?? sec.id ?? "section").trim().slice(0, 40);
      add("layout", "ragged-section", `${ragged.length > 1 ? `${ragged.length} sections stop` : "1 section stops"} short of the page column and hugs the left edge (${ragged.map((b) => `"${name(b.sec)}"`).slice(0, 3).join(", ")})`, "Centre the narrow block as one unit (title, content and note) or let it fill the column, so the page keeps one right edge or one centre line.");
    }
  }
  // Lone words: a heading whose last line holds a single word (a widow) looks unfinished.
  let lone = 0; const loneEx = [];
  for (const h of main.querySelectorAll("h1, h2, h3")) {
    if (skip(h) || !visible(h)) continue;
    const words = [];
    const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const text = n.textContent ?? "";
      for (const m of text.matchAll(/\S+/g)) {
        const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length);
        const b = r.getClientRects()[0]; if (b && b.width > 0) words.push(Math.round(b.top));
      }
    }
    const lines = [...new Set(words)].sort((a, b) => a - b);
    if (lines.length > 1 && words.filter((t) => t === lines[lines.length - 1]).length === 1) { lone++; loneEx.push(h.textContent.trim().slice(0, 40)); }
  }
  if (lone) add("hierarchy", "lone-word", `${lone} heading${lone > 1 ? "s end" : " ends"} on a single word ("${loneEx[0]}")`, "Balance heading lines (text-wrap: balance; Recanica's base styles do this) or shorten the heading.");
  // Uneven columns: side-by-side columns where one runs far longer than another, leaving large empty holes.
  let uneven = 0;
  for (const row of main.querySelectorAll("*")) {
    if (skip(row) || !visible(row)) continue;
    const cs = getComputedStyle(row);
    const cols = cs.display === "grid" ? cs.gridTemplateColumns.split(" ").length : 0;
    if (cols < 2 || cols > 4) continue;
    const kids = [...row.children].filter(visible);
    if (kids.length !== cols) continue; // one row of columns, not a card grid
    const hs = kids.map((k) => { const kids2 = [...k.children].filter(visible); if (!kids2.length) return 0; const r0 = k.getBoundingClientRect(); return Math.max(...kids2.map((c) => c.getBoundingClientRect().bottom)) - r0.top; });
    const tall = Math.max(...hs), short = Math.min(...hs);
    // "Label left, content right" (a heading column beside its content) is a deliberate pattern, not a hole.
    const labelColumn = hs.indexOf(short) === 0 && kids[0].querySelector("h1, h2, h3") && kids[0].children.length <= 3;
    // A pinned (sticky) short column follows the reader, so it isn't a hole (list / detail).
    const pinned = getComputedStyle(kids[hs.indexOf(short)]).position === "sticky" || [...kids[hs.indexOf(short)].children].some((c) => getComputedStyle(c).position === "sticky");
    if (tall > 160 && short > 0 && tall / short > 2.5 && !labelColumn && !pinned) uneven++;
  }
  if (uneven) add("layout", "uneven-columns", `${uneven} rows of side-by-side columns where one column is over 2.5× longer than another`, "Put the main content in one column and move short supporting details to a footer line, or balance what goes in each column.");
  // Rhythm: in a column of stacked blocks, the gaps between blocks come from one or two values (block gap, section gap),
  // and a text block never sits cramped against a bordered surface. Catches spacing decided per element instead of by the container.
  let cramped = 0, irregular = 0;
  for (const col of main.querySelectorAll("*")) {
    if (skip(col) || !visible(col)) continue;
    const cs = getComputedStyle(col);
    if (cs.display.includes("grid") || (cs.display.includes("flex") && !cs.flexDirection.startsWith("column"))) continue;
    const kids = [...col.children].filter((k) => visible(k) && !["absolute", "fixed"].includes(getComputedStyle(k).position) && getComputedStyle(k).display !== "inline");
    if (kids.length < 4) continue;
    const gaps = [];
    for (let i = 1; i < kids.length; i++) {
      const a = kids[i - 1].getBoundingClientRect(), b = kids[i].getBoundingClientRect();
      if (Math.abs(a.left - b.left) > 2) continue; // not stacked in the same column
      const g = Math.round(b.top - a.bottom);
      gaps.push(g);
      const surface = (el) => parseFloat(getComputedStyle(el).borderTopWidth) > 0 && parseFloat(getComputedStyle(el).borderTopLeftRadius) >= 8;
      if (g < 10 && (surface(kids[i]) || surface(kids[i - 1])) && !(surface(kids[i]) && surface(kids[i - 1]))) cramped++;
    }
    const distinct = [...new Set(gaps.filter((g) => g >= 0).map((g) => Math.round(g / 4) * 4))];
    if (gaps.length >= 4 && distinct.length > 3) irregular++;
  }
  if (cramped) add("layout", "cramped", `${cramped} places where text sits almost touching a bordered block`, "Let the container own spacing: put blocks in a .flow column (or gap-*) instead of margins on each block.");
  if (irregular) add("layout", "rhythm", `${irregular} columns with more than three different gaps between blocks`, "One rhythm per column: --spacing-flow between blocks, --spacing-stack before a heading (.flow does both).");
  const mainW = main.getBoundingClientRect().width;
  if (window.innerWidth >= 1280 && mainW > 1600) add("layout", "content-width", `content spans ${Math.round(mainW)}px`, "Constrain content to max-w-content; very wide layouts scatter attention.");

  // --- Eyebrows: small muted labels right above a heading. Fine once or twice when they add information
  // (a date, a status, where you are); slop when every section has one or it repeats the heading.
  const isHeading = (el) => el && (el.matches("h1, h2, h3, [data-slot=heading], [data-slot=web-section-title], [data-slot=web-hero-title]"));
  const eyebrows = [];
  for (const el of main.querySelectorAll("p, span, div")) {
    if (skip(el) || !visible(el) || !ownText(el) || el.children.length) continue;
    const next = el.nextElementSibling;
    const cs = getComputedStyle(el);
    if (!isHeading(next) || parseFloat(cs.fontSize) > 14 || parseFloat(getComputedStyle(next).fontSize) < parseFloat(cs.fontSize) * 1.3) continue;
    eyebrows.push({ text: el.textContent.trim(), heading: next.textContent.trim() });
  }
  const words = (t) => new Set(t.toLowerCase().match(/[a-z]{4,}/g) ?? []);
  const redundant = eyebrows.filter((e) => { const a = words(e.text), b = words(e.heading); const shared = [...a].filter((w) => b.has(w) || [...b].some((x) => x.startsWith(w.slice(0, 5)))); return a.size && shared.length / a.size >= 0.5; });
  if (eyebrows.length > 2) add("calm", "eyebrows", `${eyebrows.length} small labels above headings ("${eyebrows.slice(0, 3).map((e) => e.text).join('", "')}")`, "Use an eyebrow only when it adds information the heading doesn't (a date, a status, where you are), and at most once or twice per page.");
  if (redundant.length) add("calm", "redundant-eyebrow", `eyebrow repeats its heading ("${redundant[0].text}" above "${redundant[0].heading.slice(0, 40)}")`, "Remove it, or replace it with information the heading doesn't give.");

  // --- Usability: verbs on buttons, descriptive links, current nav state, error wiring, focus styles
  const vague = /^(submit|ok|okay|click here|here|go|yes|no|continue|next|more|read more|learn more|details|link)$/i;
  const vagueBtns = [...document.querySelectorAll("button, [role=button], a[data-slot=button]")].filter((el) => visible(el) && !skip(el) && vague.test((el.innerText || "").trim()));
  if (vagueBtns.length) add("usability", "vague-labels", `${vagueBtns.length} actions with vague labels (${[...new Set(vagueBtns.map((b) => b.innerText.trim()))].slice(0, 3).join(", ")})`, "Buttons and links say what happens: 'Send invoice', 'View all orders', not 'Submit' or 'Learn more'.");
  const navs = [...document.querySelectorAll("nav, aside, [data-slot=sidebar]")].filter(visible);
  // Only navs that contain the current page have something to mark.
  const here = location.pathname.replace(/\/$/, "") || "/";
  const navWithLinks = navs.filter((n) => [...n.querySelectorAll("a[href]")].some((a) => { try { return (new URL(a.href).pathname.replace(/\/$/, "") || "/") === here; } catch { return false; } }));
  const hasCurrent = navWithLinks.some((n) => n.querySelector("[aria-current], [data-active=true], [data-state=active]"));
  if (navWithLinks.length && !hasCurrent) add("usability", "no-current-nav", "navigation doesn't mark the current page", "Mark the active item (aria-current=\"page\" plus the accent background) so people know where they are.");
  const invalid = [...document.querySelectorAll("[aria-invalid=true]")].filter(visible);
  const unwired = invalid.filter((el) => !el.getAttribute("aria-describedby") && !el.closest("[data-slot=field], [data-slot=form-item]"));
  if (unwired.length) add("usability", "error-wiring", `${unwired.length} invalid fields without a linked message`, "Show the error under the field (FieldError) and link it with aria-describedby.");

  const measures = {
    lowContrast, longLines: longLines.length, focalElements: atMax, titleToBody: maxS && bodyS ? +(maxS / bodyS).toFixed(2) : 0,
    leftEdges: lefts.size, offScaleSpacing: offScale.length, vagueLabels: vagueBtns.length, navMarksCurrent: navWithLinks.length ? hasCurrent : null,
  };
  return { measures, findings };
}

/**
 * How strict each rule is.
 *  must    — never broken: accessibility, broken layout, token use, honest copy. Fails `recanica audit`.
 *  should  — the strong default. A project may deviate when the content needs it, with a written reason
 *            (recanica.config.json "allow" entry or a recanica-ignore comment). Reported and scored, never fails the build.
 * Everything else (brand colour, font, locale, density, thresholds) is a project choice, set in tokens or config.
 */
export const RULE_LEVELS = {
  must: ["page-overflow", "text-overflow", "clipped-text", "overlap", "wrapped-label", "contrast", "unnamed-control", "unlabelled-field",
    "small-target", "dead-link", "duplicate-id", "focus-visible", "spec-copy", "tiny-text", "no-title", "error-wiring", "broken-page", "runtime-error"],
  should: ["spec-color", "spec-weight", "spec-font", "spec-button", "spec-radius", "inconsistent", "table-edges", "surface-padding", "stretched-rows",
    "busy-primary", "busy-actions", "busy-type", "busy-surfaces", "busy-lines", "busy-nesting", "busy-badges", "busy-icons", "busy-text",
    "busy-table", "busy-form", "busy-nav", "no-focal-point", "flat-hierarchy", "title-below-fold", "action-below-fold", "alignment",
    "spacing-rhythm", "content-width", "two-right-edges", "ragged-section", "lone-word", "uneven-columns", "cramped", "rhythm", "line-length", "vague-labels", "no-current-nav", "eyebrows", "redundant-eyebrow"],
};
export const levelOf = (rule) => (RULE_LEVELS.must.includes(rule) ? "must" : "should");

/** Default thresholds for the busyness rules. A project can change any of them in recanica.config.json "thresholds". */
export const DEFAULT_THRESHOLDS = { primaryActions: 1, actions: 18, textSizes: 6, textSizesWithHero: 7, backgrounds: 5, borders: 70, nesting: 3, badges: 8, icons: 24, textChars: 1800, tableColumns: 6, formFields: 10, navRun: 15 };
