/**
 * recanica slop — the AI-slop checker, for copy and for design.
 *
 *   npx recanica slop [paths…]          source files: copy tells + design-slop patterns, with a score per file
 *   npx recanica slop --text "…"        one piece of copy (a headline, a PR description, a decision entry)
 *   echo "…" | npx recanica slop -      the same, from stdin (agents: check your own words before you write them)
 *
 * Score: 100 = nothing generic found. Each must-level tell costs 10, each should-level tell 3, per 1,000 characters
 * of visible text for --text, per file for paths. It's a smell detector: it finds the defaults, it can't judge taste.
 */
import { readFileSync } from "node:fs";
import { COPY_RULES } from "./copy-rules.js";
import { check, RULES } from "./check.js";

const DESIGN = RULES.filter(([id]) => id === "design-slop");

/** Check one piece of text. Returns { score, hits: [{ level, message, match }] }. */
export function slopText(text) {
  const hits = [];
  for (const [re, msg, level] of COPY_RULES) {
    const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    for (const m of text.matchAll(g)) hits.push({ level, message: msg, match: m[0] });
  }
  for (const [, , re, msg, fix] of DESIGN) {
    const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    for (const m of text.matchAll(g)) hits.push({ level: "warn", message: msg, match: m[0], fix });
  }
  // Structural tells that no single word gives away.
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 3);
  // Lists of facts (375px, 900px and 1280px) are fine; lists of three adjectives or abstractions are the tell.
  const triads = (text.match(/\b\w+, \w+,? and \w+\b/g) ?? []).filter((t) => !/\d/.test(t));
  if (triads.length >= 3) hits.push({ level: "warn", message: `${triads.length} lists of three: the rule-of-three rhythm reads as generated; keep the ones that carry information`, match: triads.slice(0, 2).join(" / ") });
  const colonsOpeners = sentences.filter((s) => /^[A-Z][\w ]{2,24}: /.test(s.trim())).length;
  if (sentences.length >= 4 && colonsOpeners / sentences.length > 0.5) hits.push({ level: "warn", message: "most sentences open with “Label: …”: write sentences", match: "" });
  const exclaim = (text.match(/!/g) ?? []).length;
  if (exclaim >= 2) hits.push({ level: "warn", message: `${exclaim} exclamation marks: state it plainly`, match: "!" });
  const per = Math.max(1, text.length / 1000);
  const cost = hits.reduce((a, h) => a + (h.level === "error" ? 10 : 3), 0) / per;
  return { score: Math.max(0, Math.round(100 - cost)), hits };
}

export function runSlop(root, args, flags, log) {
  const readStdin = args[0] === "-";
  if (flags.text || readStdin) {
    const text = typeof flags.text === "string" ? flags.text : readFileSync(0, "utf8");
    const r = slopText(text);
    if (flags.json) process.stdout.write(JSON.stringify(r, null, 2) + "\n");
    else {
      for (const h of r.hits) log(`${h.level === "error" ? "✗" : "!"} ${h.match ? `“${h.match}”  ` : ""}${h.message}`);
      log(`\nslop score ${r.score}/100 · ${r.hits.filter((h) => h.level === "error").length} must-fix · ${r.hits.filter((h) => h.level !== "error").length} should`);
    }
    return r.hits.some((h) => h.level === "error") && !flags.warn ? 1 : 0;
  }
  const { files, hits, advisory = [] } = check(root, args.filter((a) => a !== "-"), { all: true });
  const slop = hits.filter((h) => h.rule === "copy" || h.rule === "design-slop");
  const byFile = new Map();
  for (const h of slop) { if (!byFile.has(h.file)) byFile.set(h.file, []); byFile.get(h.file).push(h); }
  const scored = [...byFile].map(([f, hs]) => ({ file: f, hits: hs, score: Math.max(0, 100 - hs.reduce((a, h) => a + (h.level === "error" ? 10 : 3), 0)) })).sort((a, b) => a.score - b.score);
  const errors = slop.filter((h) => h.level === "error").length;
  const overall = files ? Math.round(((files - scored.length) * 100 + scored.reduce((a, s) => a + s.score, 0)) / files) : 100;
  if (flags.json) {
    process.stdout.write(JSON.stringify({ files, score: overall, errors, warnings: slop.length - errors, byFile: scored, advisory: advisory.filter((h) => h.rule === "copy" || h.rule === "design-slop").length }, null, 2) + "\n");
  } else {
    for (const s of scored.slice(0, flags.all ? 999 : 15)) {
      log(`${s.score.toString().padStart(3)}  ${s.file}`);
      for (const h of s.hits.slice(0, 4)) log(`       ${h.level === "error" ? "✗" : "!"} ${h.line}: ${h.message}: “${h.match.slice(0, 60)}”`);
    }
    log(`\nslop: ${files} files · score ${overall}/100 · ${errors} must-fix · ${slop.length - errors} should · copy tells and design defaults (glass, glow, blur blobs, emoji, sparkles, decorative motion)`);
  }
  return errors && !flags.warn ? 1 : 0;
}
