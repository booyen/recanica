#!/usr/bin/env node
/**
 * Copy lint: flags AI-style jargon, filler and placeholder copy in user-facing text.
 *   node scripts/copy-lint.mjs          report + exit 1 on errors
 *   node scripts/copy-lint.mjs --all    also show warnings
 * Rules live in RULES below; the reasoning is in docs/COPY_AUDIT.md.
 * Ignore a line with: // copy-lint-ignore
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { COPY_RULES } from "../packages/cli/src/copy-rules.js";

const root = join(import.meta.dirname, "..");
const SCAN = ["apps/docs/registry", "apps/docs/examples", "apps/docs/app", "apps/docs/components", "templates", "packages/css/examples", "docs/guides", "docs/ai", "README.md"];
const SKIP = new Set(["node_modules", ".next", "__registry__", "tests", "generated"]);
const EXT = /\.(tsx|ts|md|html|dart)$/;

// [pattern, message, level]
const RULES = COPY_RULES;

const files = [];
const walk = (p) => {
  const abs = join(root, p);
  let st; try { st = statSync(abs); } catch { return; }
  if (st.isDirectory()) { for (const f of readdirSync(abs)) if (!SKIP.has(f)) walk(join(p, f)); }
  else if (EXT.test(p)) files.push(p);
};
SCAN.forEach(walk);

const all = process.argv.includes("--all");
const hits = [];
for (const f of files) {
  const lines = readFileSync(join(root, f), "utf8").split("\n");
  lines.forEach((line, i) => {
    if (line.includes("copy-lint-ignore")) return;
    // only look at likely-visible text: strings, JSX text, markdown prose (skip imports and class lists)
    if (/^\s*(import|export \{|\/\/|\*|\/\*)/.test(line) || /className=/.test(line) && !/>[^<]*[a-z]{4}/i.test(line)) return;
    for (const [re, msg, level] of RULES) {
      if (level === "warn" && !all) continue;
      const m = line.match(re);
      if (m) hits.push({ f, n: i + 1, level, msg, text: m[0] });
    }
  });
}
const errors = hits.filter((h) => h.level === "error");
for (const h of hits) console.log(`${h.level === "error" ? "✗" : "!"} ${h.f}:${h.n}  “${h.text}”  ${h.msg}`);
console.log(`\ncopy-lint: ${files.length} files · ${errors.length} errors · ${hits.length - errors.length} warnings${all ? "" : " (run with --all to see warnings)"}`);
process.exit(errors.length ? 1 : 0);
