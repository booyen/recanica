// Runs `recanica init` against throwaway fixture projects for each stack and checks the result.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";

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
assert.match(run(good, "check"), /0 errors/);
console.log("✓ check");

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
      </body></html>`);
    const spec = new Set((await page.evaluate(auditSpec, COPY_RULES_SOURCE)).map((i) => i.rule));
    const layout = new Set((await page.evaluate(auditPage)).map((i) => i.rule));
    await browser.close();
    for (const r of ["spec-color", "spec-weight", "spec-button", "spec-radius", "spec-copy", "inconsistent"]) assert.ok(spec.has(r), `audit: ${r} should fire`);
    assert.ok(layout.has("overlap"), "audit: overlap should fire");
    console.log("✓ audit rules fire on violations");
  }
}
