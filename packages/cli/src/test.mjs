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
