/**
 * recanica.config.json — how a project tunes Recanica without forking it.
 *
 * {
 *   "project": {                                     // written by `recanica kickoff` (the start-of-project questionnaire)
 *     "name": "Shop admin", "kickoffDate": "2026-11-26", "kickoff": "docs/ui/KICKOFF.md",
 *     "role": "owner" | "guest",                     // guest = the UI layer is one part of someone else's build
 *     "flexibility": "locked" | "guided" | "open",   // how strict the should-rules are (see FLEXIBILITY)
 *     "stack": "nextjs" | "unknown" | …, "surfaces": ["app", "site"]
 *   },
 *   "scope": {                                       // guest projects: the paths the UI work owns
 *     "owns": ["src/components/**", "src/app/(marketing)/**"]   // findings elsewhere are advisory: propose, don't change
 *   },
 *   "zones": [                                       // per-area flexibility, e.g. a looser campaign area
 *     { "files": "src/campaigns/**", "flexibility": "open", "reason": "Campaign pages are art-directed per launch" }
 *   ],
 *   "decisions": "docs/ui/DECISIONS.md",             // the UI/UX decision log (its pattern guards run in `check`)
 *   "ignore": ["emails/**"],                         // files `recanica check` skips
 *   "rules": { "busy-table": "off" },                // per rule: "must" | "should" | "off" (beats flexibility)
 *   "thresholds": { "tableColumns": 9 },             // busyness limits (see DEFAULT_THRESHOLDS)
 *   "allow": [                                       // accepted deviations from a should-rule, each with a reason;
 *                                                    // "path" = page URLs (audit, review), "file" = source files (check)
 *     { "rule": "busy-table", "path": "/reports/**", "reason": "Finance compares 9 columns side by side" },
 *     { "rule": "gradient", "file": "src/art/**", "reason": "Gradient artwork is the product, not interface colour" }
 *   ]
 * }
 * Must-rules can't be allowed away; changing them to "should"/"off" shows up in code review like any other change.
 * Order of precedence for a rule's level: "rules" → the file's zone flexibility → project flexibility → the rule's default.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * Flexibility presets. Rules not listed keep their default level.
 * Some rules are FIXED in every preset: they protect the system itself (tokens, valid CSS, no placeholder copy),
 * so loosening the project never loosens them. Creativity lives in composition, not in breaking the tokens.
 */
export const FIXED = { "hard-coded-color": "must", "arbitrary-color": "must", "self-reference": "must", "palette-hue": "must" };
export const FLEXIBILITY = {
  // Product UI at scale, many contributors or agents: every deviation is a recorded decision.
  locked: { ...FIXED, "hand-built": "must", structure: "must", "repeated-classes": "must", "arbitrary-spacing": "must", "arbitrary-radius": "must", "bold-weight": "must", gradient: "must", "design-slop": "must", "uppercase-label": "must" },
  // The default: reuse and structure are enforced; style rules are reported and can be allowed with a reason.
  guided: { ...FIXED, "hand-built": "must", structure: "must" },
  // Art-directed work (campaigns, launches, editorial): tokens stay fixed, composition is free.
  // Reuse is still reported, so a one-off doesn't silently become the pattern.
  open: { ...FIXED, "hand-built": "should", structure: "should", gradient: "should", "bold-weight": "should", "design-slop": "should", "repeated-classes": "should", "arbitrary-spacing": "off", "arbitrary-radius": "should" },
};

export function findConfigPath(root = process.cwd()) {
  // Nearest recanica.config.json from here upward (works from a monorepo package folder too).
  let dir = root, p = join(dir, "recanica.config.json");
  while (!existsSync(p) && dirname(dir) !== dir) { dir = dirname(dir); p = join(dir, "recanica.config.json"); }
  return existsSync(p) ? p : null;
}

export function loadConfig(root = process.cwd()) {
  const p = findConfigPath(root);
  let c = {};
  if (p) { try { c = JSON.parse(readFileSync(p, "utf8")); } catch { c = {}; } }
  const project = c.project ?? null;
  const preset = FLEXIBILITY[project?.flexibility] ?? {};
  return {
    path: p,
    dir: p ? dirname(p) : root,
    exists: !!p,
    project,
    explicitRules: c.rules ?? {},
    // Effective project-wide levels: preset first, explicit rules win.
    rules: { ...preset, ...(c.rules ?? {}) },
    zones: (c.zones ?? []).filter((z) => z && z.files && FLEXIBILITY[z.flexibility]).map((z) => ({ ...z, re: globToRe(z.files) })),
    scope: c.scope?.owns?.length ? { owns: c.scope.owns, re: c.scope.owns.map(globToRe) } : null,
    decisions: c.decisions ?? "docs/ui/DECISIONS.md",
    ignore: c.ignore ?? [],
    thresholds: c.thresholds ?? {},
    allow: (c.allow ?? []).filter((a) => a && a.rule && a.reason && String(a.reason).trim().length >= 8),
  };
}

/** The level a rule has for one file: explicit rule → zone → project flexibility → default. */
export function levelFor(cfg, rule, file) {
  if (cfg.explicitRules[rule]) return cfg.explicitRules[rule];
  const zone = file && cfg.zones.find((z) => z.re.test(file));
  if (zone && FLEXIBILITY[zone.flexibility][rule]) return FLEXIBILITY[zone.flexibility][rule];
  return cfg.rules[rule];
}

/** Guest projects: is this file inside the UI work's scope? (Owner projects own everything.) */
export const inScope = (cfg, file) => !cfg.scope || cfg.scope.re.some((re) => re.test(file));

export const globToRe = (g) =>
  new RegExp("^" + g.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*\/?/g, "§").replace(/\*/g, "[^/]*").replace(/§/g, ".*") + "$");

/** Sort one page's issues into must / should / accepted / off, applying the project's config. */
export function classify(issues, pathname, config, levelOf) {
  const out = { must: [], should: [], accepted: [] };
  for (const i of issues) {
    const level = config.rules[i.rule] ?? levelOf(i.rule);
    if (level === "off") continue;
    const allowed = level !== "must" && config.allow.find((a) => a.rule === i.rule && (!a.path || globToRe(a.path).test(pathname)));
    if (allowed) out.accepted.push({ ...i, reason: allowed.reason });
    else out[level === "must" ? "must" : "should"].push(i);
  }
  return out;
}
