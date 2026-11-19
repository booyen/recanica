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

const SKIP_DIRS = new Set(["node_modules", ".next", ".nuxt", ".svelte-kit", ".turbo", ".git", "dist", "build", "out", "coverage", "generated", "__registry__", "vendor", "Pods", ".dart_tool"]);
const EXT = /\.(tsx|jsx|ts|js|mjs|vue|svelte|astro|html|php|erb|css|scss|dart|swift|kt)$/;
// Token sources are allowed to hold raw values.
const TOKEN_FILE = /(recanica[_-]?tokens|RecanicaTokens|recanica\.css|variables\.css|tailwind-theme\.css|theme\.css|tokens\.(json|ts|js))$/i;

const HUES = "red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone";
const UTIL = "bg|text|border|ring|fill|stroke|from|via|to|outline|divide|shadow|decoration|accent|caret|placeholder";

/** [id, level, pattern, message, fix] */
export const RULES = [
  ["hard-coded-color", "error", /(?<![\w&-])#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b(?![\w-])/i,
    "Hard-coded colour", "use a semantic token: bg-background, bg-card, text-foreground, text-muted-foreground, border"],
  ["hard-coded-color", "error", /\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(\s*[\d.]/i,
    "Hard-coded colour function", "use a token (var(--foreground), bg-panel …)"],
  ["arbitrary-color", "error", new RegExp(`\\b(?:${UTIL})-\\[(?:#|rgb|hsl|oklch(?!\\(from))`, "i"),
    "Arbitrary colour utility", "use a semantic colour utility"],
  ["palette-hue", "error", new RegExp(`\\b(?:${UTIL})-(?:${HUES})-(?:50|[1-9]00|950)\\b`),
    "Tailwind palette colour", "Recanica is monochrome: use foreground/muted/border, or success / warning / destructive for status"],
  ["bold-weight", "error", /\bfont-(?:semibold|bold|extrabold|black)\b|font-weight\s*:\s*(?:[6-9]00|bold|bolder)\b|FontWeight\.(?:w[6-9]00|bold)\b|\.(?:semibold|bold|heavy|black)\b(?=\s*[),])|fontWeight\s*[:=]\s*["']?(?:[6-9]00|bold)/,
    "Heavy font weight", "Recanica type is light or regular; use font-normal / font-light and size for hierarchy"],
  ["gradient", "error", /\bbg-(?:gradient-to|linear|radial|conic)-|\b(?:linear|radial|conic)-gradient\(|LinearGradient\(|Brush\.(?:linear|radial)Gradient/,
    "Gradient", "Brand colour is flat: bg-brand / text-brand"],
  ["arbitrary-radius", "warn", /\brounded(?:-[trblse]{1,2})?-\[[^\]]+\]/,
    "Arbitrary radius", "use the scale: rounded-lg (controls), rounded-full (pills), rounded-2xl (surfaces)"],
  ["arbitrary-spacing", "warn", /\b(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y)-\[\d+px\]/,
    "Arbitrary pixel spacing", "use the 4px scale (p-4, gap-6) or layout tokens (p-panel, px-gutter)"],
  ["uppercase-label", "warn", /\buppercase\b(?=[^"'`]*tracking-(?:wide|wider|widest))/,
    "Shouty uppercase label", "use sentence case; small muted text carries the hierarchy"],
  // Copy: same rules as the docs copy lint (docs/COPY_AUDIT.md).
  ["copy", "error", /\b(?:seamless(?:ly)?|leverag(?:e|es|ing)|empower(?:s|ing)?|effortless(?:ly)?|supercharg\w*|revolutioni[sz]\w*|game[- ]chang\w*|delve|tapestry|synerg\w*)\b/i,
    "AI-style filler word", "say what actually happens"],
  ["copy", "error", /\b(?:cutting[- ]edge|state[- ]of[- ]the[- ]art|best[- ]in[- ]class|world[- ]class|next[- ]level|look no further|say goodbye to|at your fingertips|lorem ipsum)\b/i,
    "Cliché or placeholder copy", "replace with a concrete fact"],
  ["copy", "warn", /\b(?:unlock(?:s|ing)?|elevate[sd]?|streamlin(?:e|ed|es|ing)|robust|innovative|holistic|AI[- ]powered)\b/i,
    "Vague marketing word", "name the concrete benefit"],
];

function loadConfig(root) {
  const p = join(root, "recanica.config.json");
  if (!existsSync(p)) return { ignore: [], rules: {} };
  try {
    const c = JSON.parse(readFileSync(p, "utf8"));
    return { ignore: c.ignore ?? [], rules: c.rules ?? {} };
  } catch {
    return { ignore: [], rules: {} };
  }
}

const globToRe = (g) =>
  new RegExp("^" + g.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*\/?/g, "§").replace(/\*/g, "[^/]*").replace(/§/g, ".*") + "$");

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
  for (const abs of files) {
    const rel = relative(root, abs);
    const lines = readFileSync(abs, "utf8").split("\n");
    lines.forEach((line, i) => {
      if (line.includes("recanica-ignore") || /^\s*import\b/.test(line)) return;
      for (const [id, defLevel, re, msg, fix] of RULES) {
        const level = cfg.rules[id] ?? defLevel;
        if (level === "off" || (level === "warn" && !all)) continue;
        if (id === "copy" && isComment(line)) continue;
        if (id === "hard-coded-color" && (isComment(line) || /\bmeta\b.*theme-color|<svg|xmlns/.test(line))) continue;
        const m = line.match(re);
        // "#1042" style ticket/issue numbers are not colours.
        if (m && id === "hard-coded-color" && /^#\d{1,4}$/.test(m[0])) continue;
        if (m) hits.push({ file: rel, line: i + 1, col: (m.index ?? 0) + 1, rule: id, level, message: msg, match: m[0].trim(), fix });
      }
    });
  }
  return { files: files.length, hits };
}

export function runCheck(root, args, flags, log) {
  const { files, hits } = check(root, args, { all: !!flags.all || !!flags.warn });
  const errors = hits.filter((h) => h.level === "error");
  if (flags.json) {
    process.stdout.write(JSON.stringify({ files, errors: errors.length, warnings: hits.length - errors.length, hits }, null, 2) + "\n");
  } else {
    for (const h of hits) log(`${h.level === "error" ? "✗" : "!"} ${h.file}:${h.line}:${h.col}  ${h.message}: “${h.match}”\n    → ${h.fix}  [${h.rule}]`);
    log(`\nrecanica check: ${files} files · ${errors.length} errors · ${hits.length - errors.length} warnings${flags.all ? "" : " (--all shows warnings)"}`);
    if (errors.length) log("Fix with tokens, or add `recanica-ignore` with a reason on the line. Rules: npx recanica rules");
  }
  return errors.length && !flags.warn ? 1 : 0;
}
