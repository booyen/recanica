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

const root = join(import.meta.dirname, "..");
const SCAN = ["apps/docs/registry", "apps/docs/examples", "apps/docs/app", "apps/docs/components", "templates", "packages/css/examples", "docs/guides", "docs/ai", "README.md"];
const SKIP = new Set(["node_modules", ".next", "__registry__", "tests", "generated"]);
const EXT = /\.(tsx|ts|md|html|dart)$/;

// [pattern, message, level]
const RULES = [
  [/\bseamless(ly)?\b/i, "“seamless”: say what actually happens", "error"],
  [/\bunlock(s|ing)?\b/i, "“unlock”: name the concrete benefit", "error"],
  [/\belevate(s|d)?\b/i, "“elevate”: vague; say what improves", "error"],
  [/\bleverag(e|es|ing)\b/i, "“leverage”: use “use”", "error"],
  [/\bempower(s|ing)?\b/i, "“empower”: say what people can do", "error"],
  [/\beffortless(ly)?\b/i, "“effortless”: claims, not facts", "error"],
  [/\bcutting[- ]edge\b|\bstate[- ]of[- ]the[- ]art\b|\bbest[- ]in[- ]class\b|\bworld[- ]class\b|\bnext[- ]level\b/i, "superlative filler", "error"],
  [/\bgame[- ]chang/i, "“game-changer”: filler", "error"],
  [/\brevolutioni[sz]/i, "“revolutionize”: filler", "error"],
  [/\bsupercharg/i, "“supercharge”: filler", "error"],
  [/\bstreamlin(e|ed|es|ing)\b/i, "“streamline”: say what gets faster or shorter", "error"],
  [/\bdelve\b|\btapestry\b|\bembark\b|\bsynerg/i, "LLM tell-tale word", "error"],
  [/\bin today'?s (fast[- ]paced|digital|ever)/i, "“in today's … world” opener", "error"],
  [/\bever[- ]evolving\b|\bdigital landscape\b/i, "cliché", "error"],
  [/\bwhether you'?re\b/i, "“whether you're X or Y”: pick the actual audience", "error"],
  [/\b(it'?s )?not just (a|an|another)\b/i, "“not just X, it's Y” construction", "error"],
  [/\bsay goodbye to\b|\blook no further\b|\bat your fingertips\b|\btake .{1,20} to the next level\b/i, "ad cliché", "error"],
  [/\blorem ipsum\b|\breplace this with\b|\byour (value proposition|tagline) here\b/i, "placeholder copy left in", "error"],
  [/\bbuilt for the way you\b|\bon autopilot\b|\bexplains itself\b|\bevery (number|detail) that matters\b/i, "cliché found in the 2026-11 audit", "error"],
  [/\bin (minutes|seconds|days), not (hours|days|weeks|months)\b/i, "“in X, not Y” rhythm: state the fact once", "error"],
  [/\bactually wants?\b|\bthat never happens\b/i, "filler intensifier", "error"],
  [/\brobust\b/i, "“robust”: say what it survives", "warn"],
  [/\binnovative\b|\bunparalleled\b|\bholistic\b/i, "self-praise", "warn"],
  [/\bAI[- ]powered\b|\bmagic(al)?\b/i, "hype; describe the result", "warn"],
  [/\bboost\b|\bskyrocket\b/i, "growth-hack verb; give a number", "warn"],
  [/\bjourney\b/i, "“journey”: usually filler", "warn"],
  [/ — .* — /, "two em dashes in one line: tell-tale rhythm; split the sentence", "warn"],
];

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
