// Runs `rekanica init` against throwaway fixture projects for each stack and checks the result.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";

const cli = join(import.meta.dirname, "index.js");
const run = (dir, ...args) => execFileSync(process.execPath, [cli, ...args], { cwd: dir, encoding: "utf8", env: { ...process.env, NO_COLOR: "1" } });
const fixture = (files) => {
  const dir = mkdtempSync(join(tmpdir(), "rekanica-"));
  for (const [f, c] of Object.entries(files)) { mkdirSync(join(dir, f, ".."), { recursive: true }); writeFileSync(join(dir, f), c); }
  return dir;
};

const cases = [
  ["nextjs", { "package.json": JSON.stringify({ dependencies: { next: "16.0.0", react: "19", tailwindcss: "^4.1.0" } }), "app/globals.css": '@import "tailwindcss";\n\nbody{}\n' },
    (d) => { const css = readFileSync(join(d, "app/globals.css"), "utf8"); assert.match(css, /@import "tailwindcss";\n@import "@rekanica\/tokens\/theme.css";\n@source/); }],
  ["vite-react", { "package.json": JSON.stringify({ dependencies: { react: "19", vite: "7", tailwindcss: "4.1.0" } }), "src/index.css": '@import "tailwindcss";\n' },
    (d) => assert.match(readFileSync(join(d, "src/index.css"), "utf8"), /@rekanica\/tokens\/theme.css/)],
  ["tailwind-v3", { "package.json": JSON.stringify({ devDependencies: { tailwindcss: "^3.4.0" } }), "src/index.css": "@tailwind base;\n" },
    (d) => assert.match(readFileSync(join(d, "src/index.css"), "utf8"), /^@import "@rekanica\/tokens\/variables.css";/)],
  ["html", { "index.html": "<html></html>" }, (d) => assert.ok(readFileSync(join(d, "rekanica/rekanica.css"), "utf8").includes(".rk-btn"))],
  ["flutter", { "pubspec.yaml": "name: app\n" }, (d) => assert.match(readFileSync(join(d, "lib/theme/rekanica_tokens.dart"), "utf8"), /ThemeData rekanicaTheme/)],
  ["swiftui", { "Package.swift": "// swift" }, (d) => assert.match(readFileSync(join(d, "Rekanica/RekanicaTokens.swift"), "utf8"), /enum Rekanica/)],
  ["compose", { "app/build.gradle.kts": "android { buildFeatures { compose = true } }" }, (d) => assert.ok(existsSync(join(d, "app/src/main/java/com/aturanica/rekanica/RekanicaTokens.kt")))],
];

for (const [stack, files, verify] of cases) {
  const dir = fixture(files);
  const out = run(dir, "init", "--yes", "--skip-install");
  assert.match(out, new RegExp(`stack\\s+.*${stack}`), `${stack}: detection`);
  verify(dir);
  const agents = readFileSync(join(dir, "AGENTS.md"), "utf8");
  assert.match(agents, /# UI: Rekanica/);
  assert.equal(readFileSync(join(dir, "CLAUDE.md"), "utf8"), "@AGENTS.md\n");
  run(dir, "init", "--yes", "--skip-install"); // idempotent: second run must not duplicate
  assert.equal((readFileSync(join(dir, "AGENTS.md"), "utf8").match(/rekanica:start/g) ?? []).length, 1, `${stack}: AGENTS.md duplicated`);
  console.log(`✓ ${stack}`);
}
const dry = fixture({ "pubspec.yaml": "name: app\n" });
run(dry, "init", "--dry-run");
assert.ok(!existsSync(join(dry, "AGENTS.md")), "dry run must not write");
console.log("✓ dry-run writes nothing");
assert.match(run(dry, "tokens", "json"), /"background"/);
assert.match(run(dry, "rules"), /Rekanica — design rules/);
console.log("✓ tokens, rules");
