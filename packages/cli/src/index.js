#!/usr/bin/env node
/**
 * recanica — add Recanica to any project.
 *
 *   npx recanica init [--stack <s>] [--role owner|guest] [--owns "src/ui/**,…"] [--yes] [--dry-run] [--skip-install] [--pm npm|pnpm|yarn|bun]
 *   npx recanica kickoff [--questions [--json]] [--answers a.json] [--yes]
 *   npx recanica decisions [brief|lint|list|new] [--trap] [--title "…"]
 *   npx recanica slop [paths…] | --text "…" | -
 *   npx recanica add <pattern-or-block>
 *   npx recanica tokens <format> [--out <file>]
 *   npx recanica check [paths…] [--all] [--json] [--warn]
 *   npx recanica review <url> [--crawl] [--out recanica-review.md]
 *   npx recanica audit <url> [--paths /,/pricing] [--widths 375,900,1280] [--crawl] [--json]
 *   npx recanica rules
 *   npx recanica mcp
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative } from "node:path";
import { createInterface } from "node:readline/promises";
import { runCheck } from "./check.js";
import { runAudit } from "./audit.js";
import { runReview } from "./review.js";
import { RULES as CHECK_RULES } from "./check.js";
import { RULE_LEVELS } from "./audit-browser.js";
import { loadConfig } from "./config.js";
import { appendEntries, briefDecisions, lintDecisions, loadDecisions } from "./decisions.js";
import { runKickoff } from "./kickoff.js";
import { runSlop } from "./slop.js";

const require = createRequire(import.meta.url);
// The rules/tokens data ships with @recanica/mcp. Run from a clone of this repo (e.g. a git
// submodule), it isn't built yet: build it once from the repo's own files (plain Node).
const loadData = () => {
  try {
    return JSON.parse(readFileSync(require.resolve("@recanica/mcp/data"), "utf8"));
  } catch {
    const mcp = join(import.meta.dirname, "../../mcp");
    const file = join(mcp, "data/recanica.json");
    if (!existsSync(file) && existsSync(join(mcp, "scripts/build-data.mjs"))) spawnSync(process.execPath, [join(mcp, "scripts/build-data.mjs")], { stdio: "ignore" });
    if (existsSync(file)) return JSON.parse(readFileSync(file, "utf8"));
    throw new Error("recanica: rules data not found. Install the published package (npx recanica), or run `node packages/mcp/scripts/build-data.mjs` in the recanica repo.");
  }
};
const data = loadData();
const VERSION = JSON.parse(readFileSync(join(import.meta.dirname, "../package.json"), "utf8")).version;

const [, , cmd, ...rest] = process.argv;
const flags = { _: [] };
for (let i = 0; i < rest.length; i++) {
  const a = rest[i];
  if (a.startsWith("--")) {
    const k = a.slice(2);
    const next = rest[i + 1];
    if (next && !next.startsWith("--")) { flags[k] = next; i++; } else flags[k] = true;
  } else flags._.push(a);
}
const cwd = process.cwd();
const dry = !!flags["dry-run"];

const c = { dim: (s) => `\x1b[2m${s}\x1b[0m`, bold: (s) => `\x1b[1m${s}\x1b[0m`, ok: (s) => `\x1b[32m${s}\x1b[0m`, warn: (s) => `\x1b[33m${s}\x1b[0m` };
const log = (...a) => console.log(...a);

/* ---------- detection ---------- */
function readJson(p) { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } }
function detectPm() {
  if (flags.pm) return flags.pm;
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
  if (existsSync(join(cwd, "bun.lockb")) || existsSync(join(cwd, "bun.lock"))) return "bun";
  return "npm";
}
function detectStack() {
  if (flags.stack) return flags.stack;
  if (existsSync(join(cwd, "pubspec.yaml"))) return "flutter";
  const gradle = ["app/build.gradle.kts", "app/build.gradle", "build.gradle.kts"].map((f) => join(cwd, f)).find(existsSync);
  if (gradle && /compose/i.test(readFileSync(gradle, "utf8"))) return "compose";
  if (existsSync(join(cwd, "Package.swift")) || readdirSync(cwd).some((f) => f.endsWith(".xcodeproj"))) return "swiftui";
  const pkg = readJson(join(cwd, "package.json"));
  if (pkg) {
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    const tw = deps.tailwindcss ? parseInt(String(deps.tailwindcss).replace(/[^\d]/, "")) : 0;
    if (tw && tw < 4) return "tailwind-v3";
    if (deps.next) return "nextjs";
    // React on anything else (Vite, React Router, Remix, Gatsby, Expo web): the React components work on React 19 + Tailwind v4.
    if (deps.react) return "vite-react";
    // Non-React web frameworks: the framework-free rc-* parts are the contract (docs/STACKS.md).
    if (deps.astro) return "astro";
    if (deps.vue || deps.nuxt) return "vue";
    if (deps.svelte || deps["@sveltejs/kit"]) return "svelte";
    if (deps["@angular/core"]) return "angular";
    return "html";
  }
  return "html";
}

/* ---------- file helpers ---------- */
const changes = [];
function write(rel, content, { onlyIfMissing = false } = {}) {
  const p = join(cwd, rel);
  if (onlyIfMissing && existsSync(p)) { log(c.dim(`  skip ${rel} (exists)`)); return; }
  changes.push(`${existsSync(p) ? "update" : "create"} ${rel}`);
  if (!dry) { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, content); }
}
function findFirst(cands) { return cands.find((f) => existsSync(join(cwd, f))); }
function patchCss(rel, lines) {
  const p = join(cwd, rel);
  let css = readFileSync(p, "utf8");
  const missing = lines.filter((l) => !css.includes(l));
  if (!missing.length) { log(c.dim(`  ${rel} already wired`)); return; }
  const anchor = css.match(/@import\s+["']tailwindcss["'];?\n?/);
  css = anchor ? css.replace(anchor[0], anchor[0] + missing.join("\n") + "\n") : missing.join("\n") + "\n" + css;
  changes.push(`update ${rel}`);
  if (!dry) writeFileSync(p, css);
}
function install(pm, pkgs, dev = false) {
  if (flags["skip-install"]) { changes.push(`(skipped) install ${pkgs.join(" ")}`); return; }
  const verb = pm === "npm" ? "install" : "add";
  const args = [verb, ...(dev ? [pm === "npm" ? "--save-dev" : "-D"] : []), ...pkgs];
  changes.push(`run ${pm} ${args.join(" ")}`);
  if (dry) return;
  const r = spawnSync(pm, args, { cwd, stdio: "inherit", shell: process.platform === "win32" });
  if (r.status !== 0) { console.error(c.warn(`  ${pm} failed. Install manually: ${pm} ${args.join(" ")}`)); }
}

/* ---------- AGENTS.md ---------- */
const USAGE = {
  nextjs: 'Import components from "@recanica/ui/components/<name>". Style with Tailwind classes on Recanica tokens (bg-panel, text-muted-foreground, p-panel, text-title…).',
  "vite-react": 'Import components from "@recanica/ui/components/<name>". Style with Tailwind classes on Recanica tokens.',
  "tailwind-v3": "Use the Recanica Tailwind preset classes (bg-panel, text-muted-foreground, rounded-2xl, p-panel, text-title…). No hard-coded colors.",
  html: "Use the rc-* classes from @recanica/css (rc-btn, rc-card, rc-stats, rc-table, rc-input…). No inline colors.",
  vue: "Use the rc-* classes from @recanica/css in your templates (rc-btn, rc-surface, rc-section…). Wrap a part in a .vue component only to add behaviour; never restyle it.",
  svelte: "Use the rc-* classes from @recanica/css in your components (rc-btn, rc-surface, rc-section…). Wrap a part in a .svelte component only to add behaviour; never restyle it.",
  astro: "Use the rc-* classes from @recanica/css in .astro components (rc-btn, rc-surface, rc-section…). React islands may use @recanica/ui.",
  angular: "Use the rc-* classes from @recanica/css in templates (rc-btn, rc-surface, rc-section…). Wrap a part in a component only to add behaviour; never restyle it.",
  flutter: "Use recanicaTheme() plus RecanicaColors / RecanicaSpacing / RecanicaRadius / RecanicaText from lib/theme/recanica_tokens.dart.",
  swiftui: "Use Recanica.Colors / Spacing / Radius / Typography from RecanicaTokens.swift.",
  compose: "Use recanicaColorScheme() and RecanicaRadius / RecanicaSpacing / RecanicaTextSize from RecanicaTokens.kt.",
};
const REACT_STACKS = new Set(["nextjs", "vite-react"]);
const NATIVE_STACKS = new Set(["flutter", "swiftui", "compose"]);
function partsLine(stack) {
  // Name the parts the way this stack writes them: React components, or their rc-* twins everywhere else.
  const want = ["Page", "PageHeader", "Section", "Heading", "Stack", "Surface", "SurfaceGrid", "ReferenceTable", "WebSection", "WebSectionTitle", "WebHeroTitle"];
  const parts = (data.parts ?? []).filter((p) => want.includes(p.react));
  if (REACT_STACKS.has(stack)) return parts.map((p) => `\`${p.react}\``).join(", ") + " from `@recanica/ui`";
  return parts.map((p) => `\`${p.css}\``).join(", ") + " from `@recanica/css`";
}
function agentsMd(stack, role = "owner") {
  // Short on purpose: this file is read on every request. Full rules load on demand (npx recanica rules / MCP get_rules);
  // the build enforces the rest (npx recanica check), so nothing here relies on being remembered.
  const react = REACT_STACKS.has(stack);
  const guest = role === "guest" ? `
**You are a guest in this codebase.** The UI work owns only the paths in \`recanica.config.json\` → \`scope.owns\`.
- Don't change build config, routing, data fetching, state, APIs, dependencies, CI or other teams' tests. Ask first.
- Follow the project's own conventions (naming, imports, formatting, test style) over Recanica's.
- Saw a UI/UX problem outside your scope? Add it to \`docs/ui/PROPOSALS.md\` (where, what you saw, suggestion, evidence, effort). Don't fix it. At most three per task, raised at the end.
` : "";
  return `<!-- recanica:start -->
# UI: Recanica

This project uses **Recanica** (UI framework by Aturanica Labs, stack: ${stack}). ${USAGE[stack]}
${guest}
**Build from the parts, never by hand:**
${NATIVE_STACKS.has(stack) ? "- Every colour, radius, spacing and text size comes from the generated Recanica tokens. No literal values in widgets." : `- **Page structure:** ${partsLine(stack)}.
- **Controls:** ${react ? "`Button`, `NavItem`, `ChoiceCard`, `Input`, `NativeSelect`, `Table`" : "`rc-btn`, `rc-nav-item`, `rc-choice`, `rc-input`, `rc-table`"}. No hand-styled buttons, inputs, selects or cards.`}
- **Missing part:** extend or add the part first (both React and rc-* forms). Never patch a part on one page.
- **Spacing and width:** owned by the container. Blocks carry no margins. Rhythm tokens by role: group · flow · stack · section · inset.

**Calm:** neutral base, one brand colour (\`--brand\`), status colours only for status, no gradients, glass, glows or emoji icons · light/regular type, no bold · one primary action per view · no eyebrows unless they add information · no AI jargon.

**Workflow:**
- New project: \`npx recanica kickoff\` (or the recanica-kickoff skill) asks the human the start-of-project questions. Don't build pages before it's done.
- Before UI work: \`npx recanica decisions brief\`. Follow the decisions in force; change one only by adding an entry that supersedes it.
- Every page: pick its type in the page anatomy (MCP \`get_page_anatomy\`) and use the recanica-page skill (brief → build → look at 375/1280px).
- Made a UI/UX decision? \`npx recanica decisions new --title "…"\`. Caught a mistake? \`npx recanica decisions new --trap\`, with a guard so it can't come back.

**Checks (they run in CI; run them before you finish):** \`npx recanica check\` (code) · \`npx recanica slop\` (copy and design defaults; also \`--text "…"\` for your own words) · \`npx recanica audit <url>\` (rendered pages) · \`npx recanica review <url>\` (score).

Full rules: \`npx recanica rules\`, or MCP \`get_rules\`.
<!-- recanica:end -->
`;
}
function writeAgents(stack, role = "owner") {
  const p = join(cwd, "AGENTS.md");
  const block = agentsMd(stack, role);
  if (existsSync(p)) {
    const cur = readFileSync(p, "utf8");
    const next = /<!-- recanica:start -->[\s\S]*<!-- recanica:end -->\n?/.test(cur)
      ? cur.replace(/<!-- recanica:start -->[\s\S]*<!-- recanica:end -->\n?/, block)
      : cur.trimEnd() + "\n\n" + block;
    changes.push("update AGENTS.md (Recanica section)");
    if (!dry) writeFileSync(p, next);
  } else write("AGENTS.md", block);
  write("CLAUDE.md", "@AGENTS.md\n", { onlyIfMissing: true });
  // Enforcement that costs no tokens: config (structure + hand-built as must), a CI check and a script.
  const owns = typeof flags.owns === "string" ? flags.owns.split(",").map((x) => x.trim()).filter(Boolean) : null;
  write("recanica.config.json", JSON.stringify({
    $comment: "How strict Recanica is in this project. must = fails the build; should = reported. Loosen a rule only with a reason; record accepted deviations in allow. Run `recanica kickoff` to set role, flexibility, scope and stack.",
    rules: { "hand-built": "must", structure: "must" },
    ...(role === "guest" ? { scope: { owns: owns ?? ["src/components/**", "src/styles/**"] } } : {}),
    thresholds: {},
    allow: [],
  }, null, 2) + "\n", { onlyIfMissing: true });
  write(".github/workflows/recanica.yml", `name: Recanica
on: [push, pull_request]
jobs:
  ui:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npx -y recanica check
      - run: npx -y recanica slop
      - run: npx -y recanica decisions lint
`, { onlyIfMissing: true });
  const pkgPath = join(cwd, "package.json");
  const pkg = readJson(pkgPath);
  if (pkg && !pkg.scripts?.["check:ui"]) {
    pkg.scripts = { ...(pkg.scripts ?? {}), "check:ui": "recanica check" };
    changes.push("update package.json (check:ui script)");
    if (!dry) writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  }
  // Skills: how every page is designed, explained and checked (Claude Code reads .claude/skills; other tools use the MCP prompt).
  for (const [name, files] of Object.entries(data.skills ?? {})) {
    for (const [f, content] of Object.entries(files)) write(`.claude/skills/${name}/${f}`, content);
  }
}

/* ---------- stacks ---------- */
const CSS_CANDIDATES = ["app/globals.css", "src/app/globals.css", "src/styles/globals.css", "styles/globals.css", "src/index.css", "src/main.css", "src/styles.css", "app/app.css"];
const STACKS = {
  async nextjs(pm) {
    install(pm, ["@recanica/ui", "@recanica/tokens", "next-themes"]);
    const css = findFirst(CSS_CANDIDATES);
    if (css) patchCss(css, ['@import "@recanica/tokens/theme.css";', '@source "../node_modules/@recanica/ui";']);
    else log(c.warn("  No global CSS found. Add the imports from the Next.js guide manually."));
    return ["Load your font with next/font and set --font-sans / --font-mono (default Geist: --font-geist-sans / --font-geist-mono; see guide).", 'Add class="dark" to <html> (or use next-themes).'];
  },
  async "vite-react"(pm) {
    install(pm, ["@recanica/ui", "@recanica/tokens"]);
    const css = findFirst(CSS_CANDIDATES);
    if (css) patchCss(css, ['@import "@recanica/tokens/theme.css";', '@source "../node_modules/@recanica/ui";']);
    return ['Make sure Tailwind v4 is set up (@tailwindcss/vite) and @import "tailwindcss" comes first.', 'Load your font and set --font-sans (default Geist), and add class="dark" to <html>.'];
  },
  async "tailwind-v3"(pm) {
    install(pm, ["@recanica/tokens"]);
    const css = findFirst([...CSS_CANDIDATES, "resources/css/app.css", "assets/css/main.css"]);
    if (css) {
      const p = join(cwd, css);
      const cur = readFileSync(p, "utf8");
      if (!cur.includes("@recanica/tokens/variables.css")) { changes.push(`update ${css}`); if (!dry) writeFileSync(p, '@import "@recanica/tokens/variables.css";\n' + cur); }
    }
    return ['Add to tailwind.config: presets: [require("@recanica/tokens/tailwind-preset")]'];
  },
  // Non-React web frameworks: the rc-* classes are the contract; the framework only adds behaviour.
  async vue(pm) { return webCss(pm, ["src/assets/main.css", "src/style.css", "assets/css/main.css", "src/styles.css"], "In main.ts: import \"./assets/main.css\" (Nuxt: add it to css in nuxt.config)."); },
  async svelte(pm) { return webCss(pm, ["src/app.css", "src/styles.css"], "Import src/app.css in your root +layout.svelte."); },
  async astro(pm) { return webCss(pm, ["src/styles/global.css", "src/styles.css"], "Import src/styles/global.css in your base layout."); },
  async angular(pm) { return webCss(pm, ["src/styles.css", "src/styles.scss"], "src/styles.css is already global in angular.json."); },
  async html() {
    write("recanica/recanica.css", data.tokens["plain-css"] ?? "");
    return ['Link it: <link rel="stylesheet" href="/recanica/recanica.css" />', 'Add class="dark" to <html> and load your font and set --font-sans (default Geist from Google Fonts).'];
  },
  async flutter() {
    write("lib/theme/recanica_tokens.dart", data.tokens.flutter);
    return ["Use: MaterialApp(theme: recanicaTheme(Brightness.light), darkTheme: recanicaTheme(Brightness.dark))", "Add your font files (default Geist) to pubspec.yaml (see guide)."];
  },
  async swiftui() {
    write("Recanica/RecanicaTokens.swift", data.tokens.swiftui);
    return ["Add Recanica/RecanicaTokens.swift to your Xcode target.", "Add your fonts (default Geist) under UIAppFonts in Info.plist."];
  },
  async compose() {
    write("app/src/main/java/com/aturanica/recanica/RecanicaTokens.kt", data.tokens.compose);
    return ["Wrap your app: MaterialTheme(colorScheme = recanicaColorScheme(isSystemInDarkTheme())) { … }"];
  },
};

async function webCss(pm, candidates, hint) {
  install(pm, ["@recanica/css", "@recanica/tokens"]);
  const css = findFirst(candidates);
  const line = '@import "@recanica/css";';
  if (css) {
    const p = join(cwd, css), cur = readFileSync(p, "utf8");
    if (!cur.includes(line)) { changes.push(`update ${css}`); if (!dry) writeFileSync(p, line + "\n" + cur); }
  } else write(candidates[0], line + "\n");
  return [hint, 'Add class="dark" to <html>, load your font and set --font-sans (default Geist).', "Interactive parts (dialog, menu, tabs) use native HTML first (<dialog>, <details>, popover); see docs/STACKS.md."];
}

/* ---------- commands ---------- */
async function init() {
  const stack = detectStack();
  if (!STACKS[stack]) { console.error(`Unknown stack "${stack}". Use one of: ${Object.keys(STACKS).join(", ")}`); process.exit(1); }
  const pm = detectPm();
  log(`\n${c.bold("Recanica")} ${c.dim(`v${VERSION} · UI framework by Aturanica Labs`)}`);
  log(`  project  ${relative(process.env.HOME ?? "", cwd) || cwd}`);
  log(`  stack    ${c.bold(stack)}${flags.stack ? "" : c.dim(" (detected, override with --stack)")}`);
  if (["nextjs", "vite-react", "tailwind-v3"].includes(stack)) log(`  manager  ${pm}`);
  if (dry) log(c.warn("  dry run: nothing will be written"));
  if (!flags.yes && !dry && process.stdin.isTTY) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const a = (await rl.question("\nContinue? (Y/n) ")).trim().toLowerCase();
    rl.close();
    if (a === "n" || a === "no") { log("Cancelled."); return; }
  }
  log("");
  const role = flags.role === "guest" ? "guest" : "owner";
  const next = await STACKS[stack](pm);
  writeAgents(stack, role);
  log(c.bold("\nChanges"));
  for (const ch of changes) log(`  ${c.ok("•")} ${ch}`);
  log(c.bold("\nNext steps"));
  for (const n of next) log(`  → ${n}`);
  log(`  → AI tools: ${c.dim("claude mcp add recanica -- npx -y @recanica/mcp")}`);
  log(`  → Guide: ${data.site}/docs/installation`);
  log(`  → ${c.bold("Kickoff:")} npx recanica kickoff ${c.dim("(the start-of-project questionnaire: role, flexibility, scope, stack, done)")}\n`);
  if (!flags.yes && !dry && process.stdin.isTTY) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const a = (await rl.question("Run the kickoff questionnaire now? (Y/n) ")).trim().toLowerCase();
    rl.close();
    if (a !== "n" && a !== "no") await runKickoff(cwd, { ...flags, yes: false }, log, { detectStack: () => stack });
  }
}

function decisions() {
  const cfg = loadConfig(cwd);
  const sub = flags._[0] ?? "brief";
  if (sub === "brief") { log(briefDecisions(cfg)); return 0; }
  if (sub === "list") {
    const { entries } = loadDecisions(cfg);
    if (flags.json) { process.stdout.write(JSON.stringify(entries, null, 2) + "\n"); return 0; }
    for (const e of entries) log(`${e.id.padEnd(6)} ${(e.fields.status ?? "").padEnd(20)} ${e.title}`);
    return 0;
  }
  if (sub === "lint") {
    const known = new Set([...CHECK_RULES.map((r) => r[0]), "repeated-classes", "kickoff", ...RULE_LEVELS.must, ...RULE_LEVELS.should]);
    const problems = lintDecisions(cfg, known);
    if (flags.json) process.stdout.write(JSON.stringify(problems, null, 2) + "\n");
    else {
      for (const p of problems) log(`${p.level === "error" ? "✗" : "!"} ${p.id}  ${p.message}`);
      const n = loadDecisions(cfg).entries.length;
      log(`\ndecisions lint: ${n} entries · ${problems.filter((p) => p.level === "error").length} must-fix · ${problems.filter((p) => p.level !== "error").length} should`);
    }
    return problems.some((p) => p.level === "error") ? 1 : 0;
  }
  if (sub === "new") {
    const kind = flags.trap ? "trap" : "decision";
    const title = typeof flags.title === "string" ? flags.title : kind === "trap" ? "Name the class of mistake" : "Name the decision";
    const [id] = appendEntries(cfg, [{ kind, title, date: new Date().toISOString().slice(0, 10), status: kind === "trap" ? "active" : "proposed",
      decision: typeof flags.decision === "string" ? flags.decision : "", why: typeof flags.why === "string" ? flags.why : "",
      guard: typeof flags.guard === "string" ? flags.guard : kind === "trap" ? "rule:<id> or pattern:/…/ in <glob>" : "review" }], !dry);
    log(`${dry ? "Would add" : "Added"} ${id} to ${cfg.decisions}. Fill in every field, then run \`npx recanica decisions lint\`.`);
    return 0;
  }
  log(`recanica decisions [brief|list|lint|new]
  brief                      the decisions and traps in force, for the start of a task
  list [--json]              every entry with its status
  lint                       fields, statuses, supersedes, guards, vague reasons, slop (CI)
  new [--trap] --title "…"   append an entry with the next id ([--decision] [--why] [--guard])
Format and guard syntax: packages/cli/src/decisions.js (top comment) or docs/GOVERNANCE.md.`);
  return 0;
}

function add() {
  const name = flags._[0];
  const p = data.patterns.find((x) => x.slug === name);
  if (!p) {
    console.error(name ? `No pattern or block "${name}".` : "Usage: recanica add <name>");
    log("Available:\n" + data.patterns.map((x) => `  ${x.slug.padEnd(20)} ${c.dim(x.kind)}  ${x.description}`).join("\n"));
    process.exit(name ? 1 : 0);
  }
  const url = `${data.site}/r/${p.slug}.json`;
  log(`Adding ${p.title} from ${url}`);
  if (dry) return;
  spawnSync("npx", ["shadcn@latest", "add", url], { cwd, stdio: "inherit", shell: process.platform === "win32" });
}

function tokens() {
  const format = flags._[0];
  const v = data.tokens[format];
  if (!v) { console.error(`Formats: ${Object.keys(data.tokens).join(", ")}`); process.exit(1); }
  const out = typeof v === "string" ? v : JSON.stringify(v, null, 2);
  if (flags.out) { write(flags.out, out); log(`Wrote ${flags.out}`); } else process.stdout.write(out + "\n");
}

const help = `recanica v${VERSION} · UI framework by Aturanica Labs

Usage
  npx recanica init [--stack <s>] [--role guest --owns "src/ui/**"] [--yes] [--dry-run] [--skip-install] [--pm <pm>]
      stacks: ${Object.keys(STACKS).join(", ")} (auto-detected)
  npx recanica add <pattern-or-block>      copy a pattern/block into your app (shadcn registry)
  npx recanica tokens <format> [--out f]   ${Object.keys(data.tokens).join(" | ")}
  npx recanica check [paths] [--all]       flag colours, bold type, gradients, radii and copy that break Recanica
  npx recanica review <url> [--crawl]      existing project: measure what makes each page busy and write a
                                           rework plan (recanica-review.md): fixes, patterns, keep/change/remove
  npx recanica audit <url> [--crawl]       audit a running site at 375/900/1280px: overflow, overlap, wrapped labels,
                                           table edges, tap targets, labels, dead links (needs playwright)
  npx recanica kickoff                     the start-of-project questionnaire (--questions for agents, --answers a.json)
  npx recanica decisions [brief|lint|new]  the UI/UX decision log: what's in force, is it sound, add an entry
  npx recanica slop [paths] | --text "…"   AI-slop check for copy and design defaults, with a score
  npx recanica rules                       print the design rules (for any LLM)
  npx recanica mcp                         print MCP setup for AI tools
`;

switch (cmd) {
  case "init": await init(); break;
  case "add": add(); break;
  case "tokens": tokens(); break;
  case "check": process.exitCode = runCheck(cwd, flags._, flags, log); break;
  case "audit": process.exitCode = await runAudit(flags._, flags, log); break;
  case "review": process.exitCode = await runReview(flags._, flags, log, data); break;
  case "kickoff": process.exitCode = await runKickoff(cwd, flags, log, { detectStack }); break;
  case "decisions": process.exitCode = decisions(); break;
  case "slop": process.exitCode = runSlop(cwd, flags._, flags, log); break;
  case "rules": process.stdout.write(data.rules + "\n"); break;
  case "mcp": log('Claude Code:  claude mcp add recanica -- npx -y @recanica/mcp\nOthers:       { "mcpServers": { "recanica": { "command": "npx", "args": ["-y", "@recanica/mcp"] } } }'); break;
  case "-v": case "--version": log(VERSION); break;
  default: log(help);
}
