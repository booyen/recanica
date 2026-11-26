#!/usr/bin/env node
// Every shared part exists in both forms: the React export in @recanica/ui and the rc-* class in @recanica/css.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
const root = join(import.meta.dirname, "..");
const { parts } = JSON.parse(readFileSync(join(root, "packages/ui/parts.json"), "utf8"));
const css = readFileSync(join(root, "packages/css/src/components.css"), "utf8");
const missing = [];
for (const p of parts) {
  const name = p.react.split(" ")[0];
  const src = readFileSync(join(root, "packages/ui/src/components", `${p.file}.tsx`), "utf8");
  if (!new RegExp(`export \\{[^}]*\\b${name}\\b`).test(src)) missing.push(`${p.part}: React export ${name} missing from ${p.file}.tsx`);
  if (!new RegExp(`\\.${p.css.replace(/[-_]/g, (c) => "\\" + c)}(?![\\w-])`).test(css)) missing.push(`${p.part}: CSS class .${p.css} missing`);
}
// Mirrors: the local agent skills (.claude/skills, gitignored) are copies of the source in docs/ai/skills (FAILURES #19).
const src = join(root, "docs/ai/skills"), mirror = join(root, ".claude/skills");
for (const f of existsSync(mirror) ? readdirSync(src, { recursive: true }).filter((f) => f.endsWith(".md")) : []) {
  let copy = null;
  try { copy = readFileSync(join(mirror, f), "utf8"); } catch {}
  if (copy !== readFileSync(join(src, f), "utf8")) missing.push(`mirror: .claude/skills/${f} differs from docs/ai/skills/${f} (copy the source over)`);
}
for (const m of missing) console.log("✗ " + m);
console.log(`parts-check: ${parts.length} parts · ${missing.length} missing`);
process.exit(missing.length ? 1 : 0);
