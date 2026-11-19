/**
 * recanica audit — run Recanica's layout and UX audit against any running site.
 *
 *   npx recanica audit http://localhost:3000 [more urls…] [--paths /,/pricing,/dashboard] [--widths 375,900,1280] [--crawl] [--json]
 *
 * Same rules as the Recanica repo's own CI (see audit-browser.js). Needs Playwright in the project:
 *   npm i -D playwright && npx playwright install chromium
 * Exit code 1 when anything is found, so it can gate CI.
 */
import { createRequire } from "node:module";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { auditPage, auditSpec } from "./audit-browser.js";
import { COPY_RULES_SOURCE } from "./copy-rules.js";

// Resolve Playwright from the project being audited (cwd), not from this package.
async function loadPlaywright() {
  const req = createRequire(join(process.cwd(), "package.json"));
  for (const name of ["playwright", "@playwright/test"]) {
    try { return await import(pathToFileURL(req.resolve(name)).href); } catch {}
  }
  return null;
}

export async function runAudit(args, flags, log) {
  const pw = await loadPlaywright();
  if (!pw) {
    log("recanica audit needs Playwright in this project:\n  npm i -D playwright && npx playwright install chromium");
    return 2;
  }
  if (!args.length) { log("Usage: npx recanica audit <url> [--paths /,/pricing] [--widths 375,900,1280] [--crawl] [--json]"); return 2; }
  const widths = String(flags.widths ?? "375,900,1280").split(",").map(Number).filter(Boolean);
  const paths = flags.paths ? String(flags.paths).split(",") : [""];
  const crawl = !!flags.crawl;
  const chromium = pw.chromium ?? pw.default?.chromium;
  const browser = await chromium.launch();
  const results = [];
  try {
    for (const width of widths) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: width < 768, isMobile: width < 768 });
      const page = await ctx.newPage();
      const queue = args.flatMap((base) => paths.map((p) => new URL(p || "/", base).href));
      const seen = new Set();
      while (queue.length && seen.size < 200) {
        const url = queue.shift();
        if (seen.has(url)) continue;
        seen.add(url);
        const errors = [];
        page.removeAllListeners("pageerror");
        page.on("pageerror", (e) => errors.push(e.message));
        const res = await page.goto(url, { waitUntil: "networkidle" }).catch(() => null);
        const status = res ? res.status() : 0;
        // Runs the audit function inside the page (Playwright API; no string code is executed).
        const issues = status >= 400 || status === 0 ? [{ rule: "broken-page", detail: `HTTP ${status}` }] : [...(await page.evaluate(auditPage)), ...(await page.evaluate(auditSpec, COPY_RULES_SOURCE))];
        for (const e of errors) issues.push({ rule: "runtime-error", detail: e.slice(0, 160) });
        if (issues.length) results.push({ url, width, issues });
        if (crawl && status && status < 400) {
          const origin = new URL(url).origin;
          const links = await page.$$eval("a[href]", (as) => as.map((a) => a.href));
          for (const l of links) { const u = new URL(l); u.hash = ""; if (u.origin === origin && !seen.has(u.href)) queue.push(u.href); }
        }
      }
      await ctx.close();
    }
  } finally {
    await browser.close();
  }
  const total = results.reduce((n, r) => n + r.issues.length, 0);
  if (flags.json) process.stdout.write(JSON.stringify({ total, results }, null, 2) + "\n");
  else {
    for (const r of results) {
      log(`\n${r.url} @ ${r.width}px`);
      for (const i of r.issues) log(`  ✗ ${i.rule}  ${i.detail}`);
    }
    log(`\nrecanica audit: ${total} issue${total === 1 ? "" : "s"} across ${widths.join("/")}px.`);
  }
  return total ? 1 : 0;
}
