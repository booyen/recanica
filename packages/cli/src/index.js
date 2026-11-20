#!/usr/bin/env node
/**
 * recanica — add Recanica to any project.
 *
 *   npx recanica init [--stack <s>] [--yes] [--dry-run] [--skip-install] [--pm npm|pnpm|yarn|bun]
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

const require = createRequire(import.meta.url);
const data = JSON.parse(readFileSync(require.resolve("@recanica/mcp/data"), "utf8"));
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
    if (deps.vite || deps.react) return "vite-react";
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
  flutter: "Use recanicaTheme() plus RecanicaColors / RecanicaSpacing / RecanicaRadius / RecanicaText from lib/theme/recanica_tokens.dart.",
  swiftui: "Use Recanica.Colors / Spacing / Radius / Typography from RecanicaTokens.swift.",
  compose: "Use recanicaColorScheme() and RecanicaRadius / RecanicaSpacing / RecanicaTextSize from RecanicaTokens.kt.",
};
function agentsMd(stack) {
  // Short on purpose: this file is read on every request. Full rules load on demand (npx recanica rules / MCP get_rules);
  // the build enforces the rest (npx recanica check), so nothing here relies on being remembered.
  return `<!-- recanica:start -->
# UI: Recanica

This project uses **Recanica** (UI framework by Aturanica Labs, stack: ${stack}). ${USAGE[stack]}

**Build from the parts, never by hand:**
- **Page structure** from \`@recanica/ui\`:
  - apps: \`Page\`, \`PageHeader\`, \`Section\`, \`Heading\`, \`Stack\`
  - surfaces and tables: \`Surface\`, \`SurfaceGrid\`, \`ReferenceTable\`
  - sites: \`WebSection\`, \`WebSectionTitle\`, \`WebHeroTitle\`
  - without React, use the \`rc-*\` twins: \`rc-flow\`, \`rc-surface\`, \`rc-section\`, etc.
- **Controls:** \`Button\`, \`NavItem\`, \`ChoiceCard\`, \`Input\`, \`NativeSelect\`, \`Table\`. No raw \`<button>\`, \`<input>\` or \`<select>\`, and no hand-made cards.
- **Missing part:** if none fits, extend or add the part first. Never patch a part on one page.
- **Spacing and width:** owned by the container (\`Page\`/\`.flow\`, \`gap-*\`). Blocks carry no margins. Use rhythm tokens by role: group · flow · stack · section · inset.

**Calm:**
- neutral base, one brand colour (\`--brand\`), status colours only for status, no gradients
- light/regular type, no bold
- one primary action per view
- no eyebrows unless they add information
- no AI jargon

**Workflow:**
- New project: run the recanica-kickoff skill.
- Every page: pick its type in the page anatomy (MCP \`get_page_anatomy\`), fill the listed regions with the listed parts, and use the recanica-page skill (brief → build → look at 375/1280px).

**Checks (they run in CI; run them before you finish):**
- \`npx recanica check\`: code
- \`npx recanica audit <url>\`: rendered pages
- \`npx recanica review <url>\`: score

Full rules: \`npx recanica rules\`, or MCP \`get_rules\` (\`claude mcp add recanica -- npx -y @recanica/mcp\`).
<!-- recanica:end -->
`;
}
function writeAgents(stack) {
  const p = join(cwd, "AGENTS.md");
  const block = agentsMd(stack);
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
  write("recanica.config.json", JSON.stringify({
    $comment: "How strict Recanica is in this project. must = fails the build; should = reported. Loosen a rule only with a reason; record accepted deviations in allow.",
    rules: { "hand-built": "must", structure: "must" },
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
  const next = await STACKS[stack](pm);
  writeAgents(stack);
  log(c.bold("\nChanges"));
  for (const ch of changes) log(`  ${c.ok("•")} ${ch}`);
  log(c.bold("\nNext steps"));
  for (const n of next) log(`  → ${n}`);
  log(`  → AI tools: ${c.dim("claude mcp add recanica -- npx -y @recanica/mcp")}`);
  log(`  → Guide: ${data.site}/docs/installation\n`);
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
  npx recanica init [--stack <s>] [--yes] [--dry-run] [--skip-install] [--pm <pm>]
      stacks: ${Object.keys(STACKS).join(", ")} (auto-detected)
  npx recanica add <pattern-or-block>      copy a pattern/block into your app (shadcn registry)
  npx recanica tokens <format> [--out f]   ${Object.keys(data.tokens).join(" | ")}
  npx recanica check [paths] [--all]       flag colours, bold type, gradients, radii and copy that break Recanica
  npx recanica review <url> [--crawl]      existing project: measure what makes each page busy and write a
                                           rework plan (recanica-review.md): fixes, patterns, keep/change/remove
  npx recanica audit <url> [--crawl]       audit a running site at 375/900/1280px: overflow, overlap, wrapped labels,
                                           table edges, tap targets, labels, dead links (needs playwright)
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
  case "rules": process.stdout.write(data.rules + "\n"); break;
  case "mcp": log('Claude Code:  claude mcp add recanica -- npx -y @recanica/mcp\nOthers:       { "mcpServers": { "recanica": { "command": "npx", "args": ["-y", "@recanica/mcp"] } } }'); break;
  case "-v": case "--version": log(VERSION); break;
  default: log(help);
}
