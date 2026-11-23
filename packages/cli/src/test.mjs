// Runs `recanica init` against throwaway fixture projects for each stack and checks the result.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";
import { createRequire as _cr } from "node:module";
const data = JSON.parse(readFileSync(_cr(import.meta.url).resolve("@recanica/mcp/data"), "utf8"));

const cli = join(import.meta.dirname, "index.js");
const run = (dir, ...args) => execFileSync(process.execPath, [cli, ...args], { cwd: dir, encoding: "utf8", env: { ...process.env, NO_COLOR: "1" } });
const fixture = (files) => {
  const dir = mkdtempSync(join(tmpdir(), "recanica-"));
  for (const [f, c] of Object.entries(files)) { mkdirSync(join(dir, f, ".."), { recursive: true }); writeFileSync(join(dir, f), c); }
  return dir;
};

const cases = [
  ["nextjs", { "package.json": JSON.stringify({ dependencies: { next: "16.0.0", react: "19", tailwindcss: "^4.1.0" } }), "app/globals.css": '@import "tailwindcss";\n\nbody{}\n' },
    (d) => { const css = readFileSync(join(d, "app/globals.css"), "utf8"); assert.match(css, /@import "tailwindcss";\n@import "@recanica\/tokens\/theme.css";\n@source/); }],
  ["vite-react", { "package.json": JSON.stringify({ dependencies: { react: "19", vite: "7", tailwindcss: "4.1.0" } }), "src/index.css": '@import "tailwindcss";\n' },
    (d) => assert.match(readFileSync(join(d, "src/index.css"), "utf8"), /@recanica\/tokens\/theme.css/)],
  ["tailwind-v3", { "package.json": JSON.stringify({ devDependencies: { tailwindcss: "^3.4.0" } }), "src/index.css": "@tailwind base;\n" },
    (d) => assert.match(readFileSync(join(d, "src/index.css"), "utf8"), /^@import "@recanica\/tokens\/variables.css";/)],
  ["html", { "index.html": "<html></html>" }, (d) => assert.ok(readFileSync(join(d, "recanica/recanica.css"), "utf8").includes(".rc-btn"))],
  ["flutter", { "pubspec.yaml": "name: app\n" }, (d) => assert.match(readFileSync(join(d, "lib/theme/recanica_tokens.dart"), "utf8"), /ThemeData recanicaTheme/)],
  ["swiftui", { "Package.swift": "// swift" }, (d) => assert.match(readFileSync(join(d, "Recanica/RecanicaTokens.swift"), "utf8"), /enum Recanica/)],
  ["compose", { "app/build.gradle.kts": "android { buildFeatures { compose = true } }" }, (d) => assert.ok(existsSync(join(d, "app/src/main/java/com/aturanica/recanica/RecanicaTokens.kt")))],
];

for (const [stack, files, verify] of cases) {
  const dir = fixture(files);
  const out = run(dir, "init", "--yes", "--skip-install");
  assert.match(out, new RegExp(`stack\\s+.*${stack}`), `${stack}: detection`);
  verify(dir);
  const agents = readFileSync(join(dir, "AGENTS.md"), "utf8");
  assert.match(agents, /# UI: Recanica/);
  assert.equal(readFileSync(join(dir, "CLAUDE.md"), "utf8"), "@AGENTS.md\n");
  assert.match(readFileSync(join(dir, ".claude/skills/recanica-page/SKILL.md"), "utf8"), /name: recanica-page/, `${stack}: page skill installed`);
  assert.equal(JSON.parse(readFileSync(join(dir, "recanica.config.json"), "utf8")).rules["hand-built"], "must", `${stack}: strict config`);
  assert.ok(existsSync(join(dir, ".github/workflows/recanica.yml")), `${stack}: CI check installed`);
  assert.ok(agents.length < 4000, `${stack}: AGENTS.md stays short (${agents.length} chars)`);
  run(dir, "init", "--yes", "--skip-install"); // idempotent: second run must not duplicate
  assert.equal((readFileSync(join(dir, "AGENTS.md"), "utf8").match(/recanica:start/g) ?? []).length, 1, `${stack}: AGENTS.md duplicated`);
  console.log(`✓ ${stack}`);
}
const dry = fixture({ "pubspec.yaml": "name: app\n" });
run(dry, "init", "--dry-run");
assert.ok(!existsSync(join(dry, "AGENTS.md")), "dry run must not write");
console.log("✓ dry-run writes nothing");
assert.match(run(dry, "tokens", "json"), /"background"/);
assert.match(run(dry, "rules"), /Recanica — design rules/);
console.log("✓ tokens, rules");

// recanica check: flags off-brand code, respects recanica-ignore and config.
const bad = fixture({
  "app/page.tsx": [
    'export default () => <div className="bg-blue-500 font-bold text-[#333]">Seamless</div>',
    '<p style={{ color: "#ff0000" }} />',
    '<a className="bg-gradient-to-r from-white to-black" />',
    '<span>Ticket #1042</span>',
    '<b className="font-bold" /> {/* recanica-ignore: legacy */}',
  ].join("\n"),
  "legacy/old.tsx": '<div className="bg-red-500" />',
  "recanica.config.json": JSON.stringify({ ignore: ["legacy/**"] }),
});
let failed = false;
let out;
try { out = run(bad, "check", "--json"); } catch (e) { failed = true; out = e.stdout; }
assert.ok(failed, "check must exit 1 on errors");
const report = JSON.parse(out);
const rules = new Set(report.hits.map((h) => h.rule));
for (const r of ["palette-hue", "bold-weight", "arbitrary-color", "hard-coded-color", "gradient", "copy"]) assert.ok(rules.has(r), `check: ${r}`);
assert.ok(!report.hits.some((h) => h.match === "#1042"), "ticket numbers are not colours");
assert.ok(!report.hits.some((h) => h.line === 5), "recanica-ignore respected");
assert.ok(!report.hits.some((h) => h.file.startsWith("legacy")), "config ignore respected");
const good = fixture({ "app/page.tsx": '<div className="rounded-2xl border bg-card p-panel text-muted-foreground">Invoices</div>' });
assert.match(run(good, "check"), /0 must-fix/);
{
  const rep = fixture({ "a.tsx": '<a className="flex items-center gap-4 bg-panel px-5 py-4 hover:bg-accent">A</a>', "b.tsx": '<a className="flex items-center gap-4 bg-panel px-5 py-4 hover:bg-accent">B</a>', "c.tsx": '<a className="hover:bg-accent flex items-center gap-4 bg-panel px-5 py-4">C</a>' });
  const r = JSON.parse(run(rep, "check", "--json"));
  assert.equal(r.hits.filter((h) => h.rule === "repeated-classes").length, 3, "check: a class string repeated 3× is flagged as a missing part");
}
console.log("✓ check");

// A fresh project after init: a hand-built button must fail the build (rules come from the installed config).
{
  const proj = fixture({ "package.json": JSON.stringify({ dependencies: { next: "16.0.0", react: "19", tailwindcss: "^4.1.0" } }), "app/globals.css": '@import "tailwindcss";\n' });
  run(proj, "init", "--yes", "--skip-install");
  writeFileSync(join(proj, "app/page.tsx"), '<button className="px-4">Save</button>\n<div className="rounded-2xl border p-5">Card</div>\n');
  let failed = false, out = "";
  try { out = run(proj, "check", "app"); } catch (e) { failed = true; out = e.stdout; }
  assert.ok(failed && /2 must-fix/.test(out), "init: hand-built parts fail the build in a new project");
  assert.match(readFileSync(join(proj, "package.json"), "utf8"), /"check:ui": "recanica check"/);
  console.log("✓ new projects are protected: hand-built parts fail the check");
}

// Browser audits: prove each Recanica spec rule fires on a real violation (needs playwright, present in the repo).
{
  const { createRequire } = await import("node:module");
  const req = createRequire(join(import.meta.dirname, "../../../apps/docs/package.json"));
  let pw = null;
  try { pw = await import(req.resolve("playwright")); } catch { try { pw = await import(req.resolve("@playwright/test")); } catch {} }
  if (!pw) console.log("- skipped browser audit test (playwright not installed)");
  else {
    const { auditPage, auditSpec } = await import("./audit-browser.js");
    const { COPY_RULES_SOURCE } = await import("./copy-rules.js");
    const chromium = pw.chromium ?? pw.default.chromium;
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
    await page.setContent(`<html style="--radius:12px;--font-sans:Arial;--background:#fff;--foreground:#111;--border:#e5e5e5;--muted-foreground:#737373;--primary:#111;--primary-foreground:#fff">
      <body style="font-family:Arial;background:#fff;color:#111;margin:0">
        <p style="color:#ff0000">Red text</p>
        <p style="font-weight:700">Bold text</p>
        <button data-slot="button" style="height:36px;border-radius:4px">Square</button>
        <button data-slot="button" style="height:36px;border-radius:999px;padding-left:16px">A</button>
        <button data-slot="button" style="height:36px;border-radius:999px;padding-left:16px">B</button>
        <button data-slot="button" style="height:36px;border-radius:999px;padding-left:24px">Odd one out</button>
        <div style="border:1px solid #e5e5e5;border-radius:7px;width:300px;height:80px"></div>
        <p>A seamless experience.</p>
        <div style="display:flex;width:200px"><span style="width:20px;white-space:nowrap">A very long label here</span><span>Bar</span></div>
        <table style="width:220px"><tr><td style="width:30px">4. Grouping</td><td>What belongs together, and how to group it on the page</td></tr></table>
      </body></html>`);
    const spec = new Set((await page.evaluate(auditSpec, COPY_RULES_SOURCE)).map((i) => i.rule));

    // Busyness: a typical crowded legacy page must produce a rework plan, and point at the right patterns.
    const { auditBusyness } = await import("./audit-browser.js");
    const { suggestPatterns } = await import("./review.js");
    const busy = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const sizes = [10, 12, 13, 14, 15, 16, 18, 20, 24];
    await busy.setContent(`<html style="--primary:#111"><body style="margin:0;font-family:Arial">
      <aside>${Array.from({ length: 20 }, (_, i) => `<a href="/x${i}">Item ${i}</a>`).join("")}</aside>
      <main>
        ${sizes.map((s) => `<p style="font-size:${s}px;margin:0">Size ${s}</p>`).join("")}
        ${[1, 2, 3].map((i) => `<button data-variant="default" style="background:#111;color:#fff">Action ${i}</button>`).join("")}
        <div style="border:1px solid #ddd;border-radius:12px;padding:8px"><div style="border:1px solid #ddd;border-radius:12px;padding:8px"><div style="border:1px solid #ddd;border-radius:12px;padding:8px;width:200px">Deep</div></div></div>
        <table><tr>${Array.from({ length: 10 }, (_, i) => `<th>Col ${i}</th>`).join("")}</tr></table>
        <form>${Array.from({ length: 14 }, (_, i) => `<label>F${i} <input name="f${i}"></label>`).join("")}</form>
      </main></body></html>`);
    const report = await busy.evaluate(auditBusyness);
    const relaxed = await busy.evaluate(auditBusyness, { tableColumns: 12 });
    assert.ok(!relaxed.findings.some((f) => f.rule === "busy-table"), "thresholds: a project limit changes the result");
    const found = new Set(report.findings.map((f) => f.rule));
    for (const r of ["busy-primary", "busy-type", "busy-nesting", "busy-table", "busy-form", "busy-nav", "tiny-text", "no-title"]) assert.ok(found.has(r), `review: ${r} should fire`);
    assert.ok(report.findings.every((f) => f.fix && f.fix.length > 20), "review: every finding carries a Recanica fix");
    const sugg = suggestPatterns({ path: "/settings/billing", title: "Billing settings", tables: 0, formFields: 14, bigNumbers: 0 }, data.appLibrary);
    assert.ok(sugg.some((s) => /settings/i.test(s.label)), "review: settings page maps to a settings pattern");
    console.log("✓ review finds busyness and suggests patterns");

    // Quality: UX/UI/layout measures must fail a page with known problems, and the scorecard must reflect it.
    const { auditQuality } = await import("./audit-browser.js");
    const { scorePage } = await import("./review.js");
    const bad = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await bad.setContent(`<html><body style="margin:0;font-family:Arial;font-size:16px;background:#fff;color:#111">
      <style>*:focus{outline:none}</style>
      <nav><a href="/a">Alpha</a><a href="/b">Beta</a><a href="about:blank">Here</a></nav>
      <main style="padding:13px">
        <h1 style="font-size:16px">Settings</h1>
        <p style="color:#bbb">Low contrast helper text that nobody can read comfortably on white.</p>
        <p style="width:1200px">${"Long line of text that keeps going. ".repeat(12)}</p>
        <div style="padding:13px;margin-top:7px;gap:9px;display:flex"><span style="padding-left:11px">a</span><span style="padding-top:15px">b</span></div>
        ${[20, 60, 100, 140, 180, 220, 260, 300, 340, 380].map((x) => `<p style="margin-left:${x}px;width:200px">Edge ${x}</p>`).join("")}
        <section style="width:1000px"><p style="max-width:640px">${"Capped paragraph next to a full-width table. ".repeat(5)}</p><div style="height:40px;border:1px solid #ccc">Full-width block</div><p style="max-width:640px">${"Another capped paragraph in the same column. ".repeat(5)}</p></section>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;width:900px"><div>${Array.from({ length: 10 }, (_, i) => `<p>Rule ${i}</p>`).join("")}</div><div><p>Built into tokens</p></div><div><p>Checked by audit</p></div></div>
        <div style="width:600px"><p style="margin:0">Intro sentence</p><div style="border:1px solid #ccc;border-radius:12px;height:40px;margin-top:4px">Table</div><p style="margin:24px 0 0">Then text</p><p style="margin:40px 0 0">More</p><p style="margin:8px 0 0">And more</p><p style="margin:60px 0 0">Last</p></div>
        ${["Billing", "Speed", "Security"].map((e) => `<div><p style="font-size:12px">${e}</p><h2 style="font-size:30px">${e} you can trust</h2></div>`).join("")}
        <input aria-invalid="true" aria-label="Email">
        <button>Submit</button><a href="/more">Learn more</a>
      </main></body></html>`);
    const q = await bad.evaluate(auditQuality);
    const qr = new Set(q.findings.map((f) => f.rule));
    for (const r of ["contrast", "line-length", "flat-hierarchy", "vague-labels", "spacing-rhythm", "alignment", "error-wiring", "two-right-edges", "uneven-columns", "cramped", "rhythm", "eyebrows", "redundant-eyebrow"]) assert.ok(qr.has(r), `quality: ${r} should fire`);
    const scored = scorePage({ findings: [], quality: q.findings, spec: [], desktop: [], mobile: [{ rule: "page-overflow", detail: "x" }], focusVisible: false });
    assert.ok(scored.overall < 85, `quality: a bad page must score under 85 (got ${scored.overall})`);
    assert.ok(scored.scores.readability < 85 && scored.scores.usability < 85 && scored.scores.layout < 85 && scored.scores.responsiveness < 100, "quality: weak dimensions show up");
    console.log(`✓ quality rules fire; bad page scores ${scored.overall}/100`);
    // Links inside a closed <details> (a collapsed FAQ answer) are not unnamed controls; an empty link is.
    const faq = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await faq.setContent(`<main><details><summary>Is it free?</summary><p>See the <a href="/privacy">Privacy Policy</a>.</p></details><a href="/empty" style="display:inline-block;width:24px;height:24px"></a></main>`);
    const unnamed = (await faq.evaluate(auditPage)).filter((i) => i.rule === "unnamed-control");
    assert.equal(unnamed.length, 1, "audit: only the empty link is unnamed, not the link in the closed answer");
    // Ragged section + lone word: a narrow section against the left edge, a heading ending on one word.
    await faq.setContent(`<main style="max-width:1152px;margin:0 auto"><section><h2 style="font:20px/1.2 monospace;width:19ch">aaaaaaaaa bbbbbbbbb c</h2><div style="height:80px"></div></section><section><h2>Two</h2><div style="height:80px"></div></section><section><h2 style="font-size:48px;max-width:720px">Free to start. Pro when you ship.</h2><div style="max-width:880px;height:80px"></div></section></main>`);
    const edges = new Set((await faq.evaluate(auditQuality)).findings.map((f) => f.rule));
    assert.ok(edges.has("ragged-section") && edges.has("lone-word"), "quality: ragged-section and lone-word fire");
    console.log("✓ closed FAQ links are not unnamed; ragged sections and lone words fire");
    const layout = new Set((await page.evaluate(auditPage)).map((i) => i.rule));
    await browser.close();
    for (const r of ["spec-color", "spec-weight", "spec-button", "spec-radius", "spec-copy", "inconsistent"]) assert.ok(spec.has(r), `audit: ${r} should fire`);
    assert.ok(layout.has("overlap"), "audit: overlap should fire");
    assert.ok(layout.has("wrapped-label"), "audit: a wrapped table label should fire");
    console.log("✓ audit rules fire on violations");
  }
}

// Levels: should-rules can be deviated from with a reason; must-rules can't; thresholds are the project's.
{
  const { classify } = await import("./config.js");
  const { levelOf, auditBusyness } = await import("./audit-browser.js");
  const issues = [{ rule: "busy-table", detail: "9 columns" }, { rule: "contrast", detail: "2.1:1" }];
  const config = { rules: {}, thresholds: {}, allow: [
    { rule: "busy-table", path: "/reports/**", reason: "Finance compares nine columns side by side" },
    { rule: "contrast", reason: "Brand guideline says so" },
  ] };
  const r = classify(issues, "/reports/q4", config, levelOf);
  assert.equal(r.accepted.length, 1, "levels: should-rule accepted with a reason");
  assert.equal(r.must.length, 1, "levels: a must-rule can't be allowed away");
  const other = classify(issues, "/dashboard", config, levelOf);
  assert.equal(other.should.length, 1, "levels: an allow entry only covers its path");
  const { loadConfig } = await import("./config.js");
  const dir = fixture({ "recanica.config.json": JSON.stringify({ allow: [{ rule: "busy-table", reason: "ok" }] }) });
  assert.equal(loadConfig(dir).allow.length, 0, "levels: an allow entry without a real reason is ignored");
  console.log("✓ must / should levels and accepted deviations");
}
