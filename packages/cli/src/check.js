/**
 * recanica check — guards the design language in any project that uses Recanica.
 *
 *   npx recanica check [paths…] [--json] [--warn] [--all]
 *
 * Scans source files for things that break the Recanica look:
 * hard-coded colours, bold weights, gradients, arbitrary radii, palette hues, and AI-style copy.
 * Exit code 1 when errors are found (so it can gate CI or a pre-commit hook), unless --warn.
 *
 * Opt-outs, in order of preference:
 *   1. Fix it with a token (bg-brand, text-muted-foreground, rounded-2xl …).
 *   2. Add `recanica-ignore` in a comment on the same line, with a reason.
 *   3. recanica.config.json: { "ignore": ["src/legacy/**"], "rules": { "palette-hue": "off" } }
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { COPY_RULES } from "./copy-rules.js";
import { globToRe, inScope, levelFor, loadConfig } from "./config.js";
import { guardRules } from "./decisions.js";

const SKIP_DIRS = new Set(["node_modules", ".next", ".nuxt", ".svelte-kit", ".turbo", ".git", "dist", "build", "out", "coverage", "generated", "__registry__", "vendor", "Pods", ".dart_tool"]);
const EXT = /\.(tsx|jsx|ts|js|mjs|vue|svelte|astro|html|php|erb|css|scss|dart|swift|kt)$/;
// Token sources are allowed to hold raw values.
// The component library itself is where raw elements belong; the hand-built rule applies to apps, pages and sections.
const COMPONENT_SOURCE = /packages\/ui\/src\/components\//;
const TOKEN_FILE = /(recanica[_-]?tokens|RecanicaTokens|recanica\.css|variables\.css|tailwind-theme\.css|theme\.css|tokens\.(json|ts|js))$/i;

const HUES = "red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone";
const UTIL = "bg|text|border|ring|fill|stroke|from|via|to|outline|divide|shadow|decoration|accent|caret|placeholder";

/** [id, level, pattern, message, fix] */
export const RULES = [
  // A custom property defined from itself (--ring: var(--ring)) is invalid: every rule that uses it falls back
  // silently (an adopting site lost all its focus rings and card colours this way). Common when old variable names
  // are "mapped" to Recanica's semantic names of the same spelling.
  ["self-reference", "error", /(--[\w-]+)\s*:\s*var\(\s*\1\s*[,)]/,
    "CSS variable defined from itself", "it becomes invalid and everything using it falls back silently: point it at the value it should mirror (e.g. var(--rc-silver-300)), or delete it when it already is the Recanica token"],
  ["hard-coded-color", "error", /(?<![\w&-])#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b(?![\w-])/i,
    "Hard-coded colour", "use a semantic token: bg-background, bg-card, text-foreground, text-muted-foreground, border"],
  ["hard-coded-color", "error", /\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(\s*[\d.]/i,
    "Hard-coded colour function", "use a token (var(--foreground), bg-panel …)"],
  ["arbitrary-color", "error", new RegExp(`\\b(?:${UTIL})-\\[(?:#|rgb|hsl|oklch(?!\\(from))`, "i"),
    "Arbitrary colour utility", "use a semantic colour utility"],
  ["palette-hue", "error", new RegExp(`\\b(?:${UTIL})-(?:${HUES})-(?:50|[1-9]00|950)\\b`),
    "Tailwind palette colour", "keep it calm: neutrals (foreground/muted/border), your one brand colour (bg-brand, text-brand; set --brand in CSS), or success / warning / destructive for status"],
  ["bold-weight", "warn", /\bfont-(?:semibold|bold|extrabold|black)\b|font-weight\s*:\s*(?:[6-9]00|bold|bolder)\b|FontWeight\.(?:w[6-9]00|bold)\b|\.(?:semibold|bold|heavy|black)\b(?=\s*[),])|fontWeight\s*[:=]\s*["']?(?:[6-9]00|bold)/,
    "Heavy font weight", "Recanica type is light or regular; use font-normal / font-light and size for hierarchy"],
  ["gradient", "warn", /\bbg-(?:gradient-to|linear|radial|conic)-|\b(?:linear|radial|conic)-gradient\(|LinearGradient\(|Brush\.(?:linear|radial)Gradient/,
    "Gradient", "Brand colour is flat: bg-brand / text-brand"],
  ["arbitrary-radius", "warn", /\brounded(?:-[trblse]{1,2})?-\[[^\]]+\]/,
    "Arbitrary radius", "use the scale: rounded-lg (controls), rounded-full (pills), rounded-2xl (surfaces)"],
  ["arbitrary-spacing", "warn", /\b(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y)-\[\d+px\]/,
    "Arbitrary pixel spacing", "use the 4px scale (p-4, gap-6) or layout tokens (p-panel, px-gutter)"],
  ["structure", "warn", /<h[123]\b[^>]*className="[^"]*\btext-(?:display-(?:sm|md|lg)|title|heading)\b/,
    "Hand-made page structure", "use the shared parts: PageHeader / Heading / Section (apps), WebSectionTitle / WebHeroTitle / WebSection (sites), so rhythm and titles come from one place"],
  // An element carrying an rc-* class IS the part in stacks without React (HTML, Vue, Svelte, Astro, Angular).
  ["hand-built", "warn", /<(?:button|input|select|textarea|table)\b(?![^>]*recanica-ignore)(?![^>]*\bclass(?:Name)?=["'{`][^"'}`]*\brc-[a-z])/,
    "Hand-built element", "use the component: Button / Toggle / Item, Input, NativeSelect / Select, Textarea, Table / ReferenceTable"],
  ["hand-built", "warn", /className="[^"]*\brounded-(?:xl|2xl) border\b[^"]*\bp-(?:\d|panel|inset)/,
    "Hand-made card", "use Surface (tone, inset) or Card"],
  ["uppercase-label", "warn", /\buppercase\b(?=[^"'`]*tracking-(?:wide|wider|widest))/,
    "Shouty uppercase label", "use sentence case; small muted text carries the hierarchy"],
  // Design slop: the visual defaults generated UI falls back to. Reported (should) by default; must under "locked".
  ["design-slop", "warn", /\bbackdrop-blur\S*[^"'`]*\bbg-[\w-]+\/(?:5|[1-4]0)\b|\bbg-[\w-]+\/(?:5|[1-4]0)\b[^"'`]*\bbackdrop-blur/,
    "Glass card", "depth comes from stacked surfaces and hairline borders: bg-card / bg-panel with border"],
  ["design-slop", "warn", /\bshadow-\[0_0_\d{2,}px|box-shadow\s*:\s*0(?:px)? 0(?:px)? \d{2,}px|drop-shadow-\[0_0_/,
    "Glow", "no glows: shadows only on floating layers (menus, dialogs, toasts)"],
  ["design-slop", "warn", /\babsolute\b[^"'`]*\bblur-(?:2xl|3xl|\[\d{2,}px\])|\bblur-(?:2xl|3xl|\[\d{2,}px\])[^"'`]*\babsolute\b/,
    "Decorative blur blob", "remove it: calm comes from space and type; if the page needs a brand moment, use the one brand colour once"],
  ["design-slop", "warn", /\bbg-clip-text\b|background-clip\s*:\s*text/,
    "Gradient or clipped text", "headlines are plain foreground; emphasis comes from size and weight 300/400"],
  ["design-slop", "warn", /(?![©®™])\p{Extended_Pictographic}/u,
    "Emoji as decoration or icon", "use a lucide icon (16px, currentColor), or no icon"],
  ["design-slop", "warn", /\bSparkles(?:Icon)?\b/,
    "The AI sparkle", "name what the feature does; pick an icon for that action"],
  ["design-slop", "warn", /\banimate-(?:bounce|ping|pulse|spin)\b(?![^"'`]*(?:skeleton|loader|spinner))/,
    "Decorative motion", "motion explains a change (150–300ms); looping animation is only for loading states (Skeleton, Spinner, Loader)"],
  ["design-slop", "warn", /\bshadow-(?:xl|2xl)\b/,
    "Heavy shadow on a surface", "shadows are for floating layers only; surfaces get a hairline border"],
  // Copy rules come from copy-rules.js (shared with the repo copy lint and the page audit).
  ...COPY_RULES.map(([re, msg, level]) => ["copy", level, re, msg, "say what actually happens, with a number or a real noun"]),
];

/** Lines that are code structure, not UI: imports, and comment-only lines are skipped for copy rules. */
const isComment = (line) => /^\s*(\/\/|\*|\/\*|#(?!\w)|<!--)/.test(line);

export function check(root, paths, { all = false } = {}) {
  const cfg = loadConfig(root);
  const ignores = cfg.ignore.map(globToRe);
  const files = [];
  const walk = (abs) => {
    let st;
    try { st = statSync(abs); } catch { return; }
    const rel = relative(root, abs) || ".";
    if (ignores.some((re) => re.test(rel))) return;
    if (st.isDirectory()) {
      for (const f of readdirSync(abs)) if (!SKIP_DIRS.has(f) && !f.startsWith(".")) walk(join(abs, f));
    } else if (EXT.test(abs) && !TOKEN_FILE.test(abs) && st.size < 512_000) files.push(abs);
  };
  (paths.length ? paths : ["."]).forEach((p) => walk(join(root, p)));

  const hits = [];
  // Decision-log globs are relative to the config's folder; so are file paths here when run from the project root.
  const guards = guardRules(cfg);
  for (const abs of files) {
    const rel = relative(root, abs);
    const lines = readFileSync(abs, "utf8").split("\n");
    lines.forEach((line, i) => {
      if (line.includes("recanica-ignore") || /^\s*import\b/.test(line)) return;
      for (const [id, defLevel, re, msg, fix] of RULES) {
        const set = levelFor(cfg, id, rel);
        const level = set === "must" ? "error" : set === "should" ? "warn" : set ?? defLevel;
        if (level === "off") continue;
        if ((id === "copy" || id === "design-slop") && isComment(line)) continue;
        if (id === "design-slop" && /\.(css|scss)$/.test(abs) && /Pictographic|Sparkles/.test(re.source)) continue;
        // The component library is where floating layers and loading states live; the rules are for pages that use it.
        if (id === "design-slop" && /shadow-\(\?:xl|animate-/.test(re.source) && (COMPONENT_SOURCE.test(abs) || /tooltip|popover|dropdown|menu|dialog|toast|sheet|z-50/i.test(line))) continue;
        if (id === "hand-built" && (COMPONENT_SOURCE.test(abs) || abs.endsWith(".html"))) continue; // plain HTML uses the rc-* CSS package
        if (id === "hard-coded-color" && (isComment(line) || /\bmeta\b.*theme-color|<svg|xmlns/.test(line))) continue;
        const m = line.match(re);
        // "#1042" style ticket/issue numbers are not colours.
        if (m && id === "hard-coded-color" && /^#\d{1,4}$/.test(m[0])) continue;
        if (m) hits.push({ file: rel, line: i + 1, col: (m.index ?? 0) + 1, rule: id, level, message: msg, match: m[0].trim(), fix });
      }
      // Project rules from the decision log: each active entry with a pattern guard (traps fail, decisions report).
      for (const g of guards) {
        if (!g.files.test(rel)) continue;
        const set = cfg.explicitRules[g.id];
        const level = set === "off" ? "off" : set === "must" ? "error" : set === "should" ? "warn" : g.level;
        if (level === "off") continue;
        const m = line.match(g.re);
        if (m) hits.push({ file: rel, line: i + 1, col: (m.index ?? 0) + 1, rule: g.id, level, message: g.message, match: m[0].trim(), fix: g.fix });
      }
    });
  }
  // Repetition: the same long utility string in 3+ places means a part is missing, whatever it looks like.
  // Shape-specific rules only catch shapes we've already seen; this catches the next one too.
  const repeatLevel = cfg.rules["repeated-classes"] === "must" ? "error" : cfg.rules["repeated-classes"] === "off" ? "off" : "warn";
  if (repeatLevel !== "off") {
    const seen = new Map();
    for (const abs of files) {
      if (COMPONENT_SOURCE.test(abs) || !/\.(tsx|jsx|vue|svelte|astro|html|php|erb)$/.test(abs)) continue;
      readFileSync(abs, "utf8").split("\n").forEach((line, i) => {
        if (line.includes("recanica-ignore")) return;
        for (const m of line.matchAll(/class(?:Name)?="([^"{}$]+)"/g)) {
          const tokens = m[1].trim().split(/\s+/);
          if (tokens.length < 5) continue;
          const key = [...tokens].sort().join(" ");
          if (!seen.has(key)) seen.set(key, []);
          seen.get(key).push({ file: relative(root, abs), line: i + 1, col: (m.index ?? 0) + 1, match: m[1].slice(0, 70) });
        }
      });
    }
    for (const [, uses] of seen) {
      // A section and its starter-template copy (same file name) are one source distributed twice, not two decisions.
      const sources = new Set(uses.map((u) => u.file.split("/").pop() + ":" + u.match));
      if (uses.length < 3 || new Set(uses.map((u) => u.file.split("/").pop())).size < 2 && sources.size < 3) continue;
      if (new Set(uses.map((u) => u.file.split("/").pop())).size < 3 && uses.every((u, _, a) => a.filter((x) => x.file.split("/").pop() === u.file.split("/").pop()).length >= 1) && new Set(uses.map((u) => u.file.split("/").pop() + "@" + u.line)).size < 3) continue;
      for (const u of uses) hits.push({ ...u, rule: "repeated-classes", level: repeatLevel,
        message: `Repeated class string (${uses.length}× in the codebase)`, fix: "a part is missing: make it a component (and an rc-* class), then use it everywhere" });
    }
  }
  // Accepted deviations for files: recanica.config.json "allow" entries with a "file" glob (should-rules only;
  // must-rules can't be allowed away). E.g. gradient art: { "rule": "gradient", "file": "src/art/**", "reason": "…" }.
  const fileAllows = cfg.allow.filter((a) => a.file).map((a) => ({ ...a, re: globToRe(a.file) }));
  const accepted = [];
  const kept = hits.filter((h) => {
    if (h.level === "error") return true;
    const a = fileAllows.find((x) => x.rule === h.rule && x.re.test(h.file));
    if (a) { accepted.push({ ...h, reason: a.reason }); return false; }
    return true;
  });
  // Guest projects: outside the UI scope, findings are advice for the humans who own that code. They never fail the build.
  const advisory = [];
  const owned = kept.filter((h) => {
    if (h.file === "recanica.config.json" || inScope(cfg, h.file)) return true;
    advisory.push({ ...h, level: "advisory" });
    return false;
  });
  // The start-of-project questionnaire is part of the system: a project set up with `init` but never kicked off is flagged.
  if (cfg.exists && !cfg.project && !(cfg.explicitRules.kickoff === "off"))
    owned.push({ file: "recanica.config.json", line: 1, col: 1, rule: "kickoff", level: cfg.explicitRules.kickoff === "must" ? "error" : "warn",
      message: "No kickoff recorded", match: "project", fix: "run `npx recanica kickoff` (or the recanica-kickoff skill) so role, flexibility, scope and stack are decided before pages" });
  return { files: files.length, hits: owned, accepted, advisory };
}

export function runCheck(root, args, flags, log) {
  const { files, hits, accepted = [], advisory = [] } = check(root, args, { all: !!flags.all || !!flags.warn });
  const errors = hits.filter((h) => h.level === "error");
  if (flags.json) {
    process.stdout.write(JSON.stringify({ files, errors: errors.length, warnings: hits.length - errors.length, accepted: accepted.length, advisory: advisory.length, hits, acceptedHits: accepted, advisoryHits: advisory }, null, 2) + "\n");
  } else {
    for (const h of hits) log(`${h.level === "error" ? "✗" : "!"} ${h.file}:${h.line}:${h.col}  ${h.message}: “${h.match}”\n    → ${h.fix}  [${h.rule}]`);
    if (advisory.length) {
      const byFile = new Map();
      for (const h of advisory) byFile.set(h.file, (byFile.get(h.file) ?? 0) + 1);
      log(`\nOutside the UI scope (advice, not yours to change; raise the useful ones in docs/ui/PROPOSALS.md):`);
      for (const [f, n] of [...byFile].sort((a, b) => b[1] - a[1]).slice(0, flags.all ? 999 : 10)) log(`  · ${f}  ${n} finding${n > 1 ? "s" : ""}`);
    }
    log(`\nrecanica check: ${files} files · ${errors.length} must-fix · ${hits.length - errors.length} should (deviate with a recanica-ignore reason)${accepted.length ? ` · ${accepted.length} accepted (recanica.config.json "allow")` : ""}${advisory.length ? ` · ${advisory.length} advisory (outside scope)` : ""}`);
    if (errors.length) log("Fix with tokens, or add `recanica-ignore` with a reason on the line. Rules: npx recanica rules");
  }
  return errors.length && !flags.warn ? 1 : 0;
}
