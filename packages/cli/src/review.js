/**
 * recanica review — turn adoption into a rework, not a reskin.
 *
 *   npx recanica review http://localhost:3000 [--paths /,/dashboard] [--crawl] [--out recanica-review.md] [--json]
 *
 * Visits each page, measures what makes it busy (competing primary actions, too many sizes/colours/borders,
 * nested cards, crowded first screen, wide tables, long unsectioned forms, long nav), matches the page to the
 * closest Recanica page type / pattern, and writes a rework plan per page: findings with the Recanica fix,
 * the pattern to rebuild it as, and a keep / change / remove table for the user to fill in BEFORE any code changes.
 * Needs Playwright in the project (same as `recanica audit`).
 */
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { auditBusyness, auditPage, auditQuality, auditSpec, levelOf } from "./audit-browser.js";
import { classify, loadConfig } from "./config.js";
import { COPY_RULES_SOURCE } from "./copy-rules.js";

async function loadPlaywright() {
  const req = createRequire(join(process.cwd(), "package.json"));
  for (const name of ["playwright", "@playwright/test"]) {
    try { return await import(pathToFileURL(req.resolve(name)).href); } catch {}
  }
  return null;
}

/**
 * What makes a good Recanica page: eight dimensions, each scored 0–100 from measured findings
 * (100 minus 15 per finding, floor 0). The overall score is the average. Target: 85+ on every page.
 */
export const DIMENSIONS = {
  clarity: "Clarity: a title, one dominant element, the main action visible without scrolling",
  hierarchy: "Hierarchy: a clear step from title to body; one focal point",
  calm: "Calm: one primary action, few sizes/colours/borders, no nested cards, short lists",
  consistency: "Consistency: Recanica tokens, shapes and weights; same component looks the same",
  readability: "Readability: AA contrast, 45–90 character lines, nothing under 12px",
  layout: "Layout: few alignment edges, 4px spacing rhythm, no overlap, sensible width",
  usability: "Usability: verb labels, current nav marked, errors tied to fields, visible focus, named controls, real links",
  responsiveness: "Responsiveness: works at phone width without overflow, wrapping labels or overlap",
};
const BUSY_TO_DIM = { "no-title": "clarity", "tiny-text": "readability" };
// Every finding says why and what to do (the page audit reports rule + element only).
const FIXES = {
  "page-overflow": "The page scrolls sideways: find the element wider than the screen (a table, a long word, a fixed width) and let it wrap, scroll inside its own box, or shrink.",
  "text-overflow": "Text runs out of its box: let it wrap, or give the box room; don't fix widths on text.",
  "clipped-text": "Text is cut off without an ellipsis: let it wrap, or add text-overflow: ellipsis with the full text in a title.",
  "wrapped-label": "A short label breaks onto two lines: keep labels on one line (shorter words, white-space: nowrap, or more room).",
  "overlap": "One item paints into the next: give the row room, let items wrap, or truncate the long one.",
  "table-edges": "The first and last cells sit at different distances from the table edge: use equal padding on both ends.",
  "surface-padding": "A card has different left and right padding: use one inset on both sides.",
  "stretched-rows": "Rows in a one-column grid are far apart: the grid stretches to fill height; align to the top or use a flex column.",
  "unnamed-control": "A button or link has no name for screen readers: give it visible text, or aria-label for icon-only controls.",
  "small-target": "A touch target is under 24×24px: make the control bigger or space it from its neighbours.",
  "dead-link": "A link goes nowhere (href=\"#\" or empty): link to the real page, or use a button for an action.",
  "unlabelled-field": "A field has no label: add a <label for> (or aria-label), not just a placeholder.",
  "duplicate-id": "Two elements share an id: ids must be unique, or labels and links point at the wrong one.",
};
const LAYOUT_RULES = new Set(["overlap", "table-edges", "surface-padding", "stretched-rows", "text-overflow", "clipped-text", "page-overflow", "wrapped-label"]);

export function scorePage(p, config = { rules: {}, allow: [] }) {
  const by = Object.fromEntries(Object.keys(DIMENSIONS).map((d) => [d, []]));
  const all = [];
  for (const f of p.findings) all.push({ d: BUSY_TO_DIM[f.rule] ?? "calm", ...f });
  for (const f of p.quality) all.push({ d: f.dimension, ...f });
  for (const i of p.spec) all.push({ d: i.rule === "spec-copy" ? "readability" : "consistency", ...i });
  for (const i of p.desktop) all.push({ d: LAYOUT_RULES.has(i.rule) ? "layout" : "usability", fix: FIXES[i.rule], ...i });
  for (const i of p.mobile) if (LAYOUT_RULES.has(i.rule)) all.push({ d: "responsiveness", fix: FIXES[i.rule], ...i });
  if (!p.focusVisible) all.push({ d: "usability", rule: "focus-visible", detail: "keyboard focus isn't visible on some controls", fix: "Every focusable element shows a focus ring (focus-visible:ring-[3px] ring-ring/50). Never remove outlines." });
  const path = p.url ? new URL(p.url).pathname : "/";
  const { must, should, accepted } = classify(all, path, config, levelOf);
  for (const f of must) by[f.d].push({ ...f, level: "must" });
  for (const f of should) by[f.d].push({ ...f, level: "should" });
  // A must-finding costs 20 points, a should-finding 10. Accepted deviations (with a written reason) cost nothing.
  const scores = Object.fromEntries(Object.entries(by).map(([d, f]) => [d, Math.max(0, 100 - f.reduce((n, x) => n + (x.level === "must" ? 20 : 10), 0))]));
  const overall = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length);
  return { scores, overall, by, accepted, mustCount: must.length };
}

/** Closest Recanica page types for a page, from its path, title and what's on it. */
export function suggestPatterns(signals, appLibrary) {
  const words = `${signals.path} ${signals.title}`.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(" ").filter((w) => w.length > 2);
  const scored = [];
  for (const cat of appLibrary) {
    for (const item of cat.items) {
      if (item.kind === "demo") continue;
      const hay = `${cat.category} ${item.label}`.toLowerCase();
      let score = words.filter((w) => hay.includes(w) || hay.includes(w.replace(/s$/, ""))).length * 2;
      if (signals.tables && /table|list|detail|customers|invoices|orders/.test(hay)) score += 2;
      if (signals.formFields > 6 && /settings|form|onboarding|create/.test(hay)) score += 2;
      if (signals.bigNumbers >= 3 && /overview|stat|dashboard|report/.test(hay)) score += 2;
      if (score > 0) scored.push({ score, label: `${item.label} (${cat.category})`, href: item.href, kind: item.kind });
    }
  }
  const seen = new Set();
  return scored.sort((a, b) => b.score - a.score).filter((s) => !seen.has(s.label) && seen.add(s.label)).slice(0, 3);
}

export async function runReview(args, flags, log, data) {
  const pw = await loadPlaywright();
  if (!pw) { log("recanica review needs Playwright in this project:\n  npm i -D playwright && npx playwright install chromium"); return 2; }
  if (!args.length) { log("Usage: npx recanica review <url> [--paths /,/dashboard] [--crawl] [--out recanica-review.md] [--json]"); return 2; }
  const paths = flags.paths ? String(flags.paths).split(",") : [""];
  const chromium = pw.chromium ?? pw.default?.chromium;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const config = loadConfig();
  const queue = args.flatMap((base) => paths.map((p) => new URL(p || "/", base).href));
  const seen = new Set();
  const pages = [];
  try {
    while (queue.length && seen.size < (flags.crawl ? 60 : 200)) {
      const url = queue.shift();
      if (seen.has(url)) continue;
      seen.add(url);
      const res = await page.goto(url, { waitUntil: "networkidle" }).catch(() => null);
      if (!res || res.status() >= 400) continue;
      // Each measurement function runs inside the page (Playwright API; no string code is executed).
      const result = await page.evaluate(auditBusyness, config.thresholds);
      const quality = await page.evaluate(auditQuality);
      const spec = await page.evaluate(auditSpec, COPY_RULES_SOURCE);
      const desktop = await page.evaluate(auditPage);
      // Keyboard: tab through the first controls and check each shows a visible focus indicator.
      const focusVisible = await (async () => {
        await page.mouse.click(1, 1).catch(() => {});
        let ok = 0, total = 0;
        for (let i = 0; i < 8; i++) {
          await page.keyboard.press("Tab");
          const r = await page.evaluate(() => {
            const el = document.activeElement;
            if (!el || el === document.body || el.tagName === "IFRAME") return null; // focus moves into the frame
            const cs = getComputedStyle(el);
            const ring = (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== "none");
            return { ring };
          });
          if (!r) continue;
          total++; if (r.ring) ok++;
        }
        return total === 0 || ok / total >= 0.75;
      })();
      await page.setViewportSize({ width: 375, height: 800 });
      await page.reload({ waitUntil: "networkidle" }).catch(() => {});
      const mobile = await page.evaluate(auditPage);
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.reload({ waitUntil: "networkidle" }).catch(() => {});
      const entry = { url, ...result, quality: quality.findings, qualityMeasures: quality.measures, spec, desktop, mobile, focusVisible, suggestions: suggestPatterns(result.signals, data.appLibrary ?? []) };
      Object.assign(entry, scorePage(entry, config));
      pages.push(entry);
      if (flags.crawl) {
        const origin = new URL(url).origin;
        for (const l of await page.$$eval("a[href]", (as) => as.map((a) => a.href))) {
          const u = new URL(l); u.hash = ""; u.search = "";
          if (u.origin === origin && !seen.has(u.href) && !/\.(png|jpe?g|gif|webp|avif|svg|ico|mp4|webm|mov|zip|pdf|json|xml|txt|css|js|woff2?)$/i.test(u.pathname)) queue.push(u.href); // pages only, not images or files
        }
      }
    }
  } finally {
    await browser.close();
  }

  pages.sort((a, b) => a.overall - b.overall);
  if (flags.json) { process.stdout.write(JSON.stringify(pages, null, 2) + "\n"); return 0; }

  const site = data.site ?? "https://recanica.aturanica.com";
  const dims = Object.keys(DIMENSIONS);
  const short = { clarity: "Clar", hierarchy: "Hier", calm: "Calm", consistency: "Cons", readability: "Read", layout: "Layout", usability: "Use", responsiveness: "Resp" };
  const avg = pages.length ? Math.round(pages.reduce((n, p) => n + p.overall, 0) / pages.length) : 0;
  const md = [
    "# Recanica rework plan",
    "",
    "Adopting Recanica is a rework, not a reskin. Each page is scored on what makes a good Recanica page (below), lowest first.",
    "For each page: answer the two questions, fill in keep / change / remove, agree it, then rebuild from the suggested pattern.",
    "Target: 85+ overall and no dimension under 70. Re-run `npx recanica review` after each page.",
    "**must** findings are always fixed (accessibility, broken layout, tokens, honest copy). **should** findings are the strong default:",
    "fix them, or keep the deviation and write the reason in recanica.config.json \"allow\", so it's a decision, not an accident.",
    "",
    `Pages: ${pages.length} · average score ${avg} · generated ${new Date().toISOString().slice(0, 10)}`,
    "",
    "## What the scores measure",
    "",
    ...dims.map((d) => `- **${DIMENSIONS[d]}**`),
    "- Scores can't tell you whether people finish their tasks or like the page. Before shipping a rework, watch 3–5 real users do the page's main task and note where they hesitate.",
    "",
    `| Page | Overall | ${dims.map((d) => short[d]).join(" | ")} |`,
    `|---|---|${dims.map(() => "---").join("|")}|`,
    ...pages.map((p) => `| ${new URL(p.url).pathname} | **${p.overall}** | ${dims.map((d) => p.scores[d]).join(" | ")} |`),
    "",
  ];
  for (const p of pages) {
    md.push(`## ${new URL(p.url).pathname}${p.signals.title ? ` · ${p.signals.title}` : ""} (${p.overall}/100)`, "");
    md.push("- **What is this page for?** _one sentence_", "- **The one action that matters most:** _…_", "");
    const issues = dims.flatMap((d) => p.by[d].map((f) => ({ d, ...f })));
    if (issues.length) {
      md.push("**What to fix**", "");
      for (const f of issues.filter((x) => x.level === "must")) md.push(`- **must** · _${f.d}_ · **${f.detail}**${f.fix ? ` → ${f.fix}` : ""}`);
      for (const f of issues.filter((x) => x.level !== "must")) md.push(`- should · _${f.d}_ · **${f.detail}**${f.fix ? ` → ${f.fix}` : ""} _(or keep it and record why in recanica.config.json "allow")_`);
      md.push("");
    } else md.push("Nothing measured. Still check by eye: one primary action, plain copy, nothing that doesn't earn its place.", "");
    if (p.accepted.length) {
      md.push("**Accepted deviations**", "");
      for (const a of p.accepted) md.push(`- ${a.rule}: ${a.reason}`);
      md.push("");
    }
    if (p.suggestions.length) {
      md.push("**Rebuild it as**", "");
      for (const s of p.suggestions) md.push(`- ${s.label}: ${s.href.startsWith("http") ? s.href : site + s.href}`);
      md.push("");
    }
    md.push("| Element | Keep / change / remove | Note |", "|---|---|---|", "| | | |", "");
  }
  const out = String(flags.out ?? "recanica-review.md");
  writeFileSync(resolve(process.cwd(), out), md.join("\n"));
  for (const p of pages.slice(0, 20)) {
    const weak = dims.filter((d) => p.scores[d] < 85).map((d) => `${d} ${p.scores[d]}`);
    log(`${p.overall >= 85 ? "✓" : "✗"} ${String(p.overall).padStart(3)}  ${new URL(p.url).pathname}  ${weak.join(", ")}`);
  }
  log(`\nrecanica review: ${pages.length} pages · average ${avg}/100 · plan written to ${out}`);
  log("Next: fill in keep / change / remove per page, agree it, then rebuild from the suggested patterns.");
  return 0;
}
