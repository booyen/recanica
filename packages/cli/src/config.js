/**
 * recanica.config.json — how a project tunes Recanica without forking it.
 *
 * {
 *   "ignore": ["emails/**"],                         // files `recanica check` skips
 *   "rules": { "busy-table": "off" },                // per rule: "must" | "should" | "off"
 *   "thresholds": { "tableColumns": 9 },             // busyness limits (see DEFAULT_THRESHOLDS)
 *   "allow": [                                       // accepted deviations from a should-rule, each with a reason
 *     { "rule": "busy-table", "path": "/reports/**", "reason": "Finance compares 9 columns side by side" }
 *   ]
 * }
 * Must-rules can't be allowed away; changing them to "should"/"off" shows up in code review like any other change.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

export function loadConfig(root = process.cwd()) {
  // Nearest recanica.config.json from here upward (works from a monorepo package folder too).
  let dir = root, p = join(dir, "recanica.config.json");
  while (!existsSync(p) && dirname(dir) !== dir) { dir = dirname(dir); p = join(dir, "recanica.config.json"); }
  let c = {};
  if (existsSync(p)) { try { c = JSON.parse(readFileSync(p, "utf8")); } catch { c = {}; } }
  return { ignore: c.ignore ?? [], rules: c.rules ?? {}, thresholds: c.thresholds ?? {}, allow: (c.allow ?? []).filter((a) => a && a.rule && a.reason && String(a.reason).trim().length >= 8) };
}

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
