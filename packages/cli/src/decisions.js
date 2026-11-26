/**
 * The UI/UX decision log: docs/ui/DECISIONS.md (path set by recanica.config.json "decisions").
 *
 * Two kinds of entry, in one file, newest at the bottom:
 *   D-###  a decision: what we chose, why, what we rejected, and how it is guarded
 *   T-###  a trap: a mistake that was caught. It is not closed until it has a mechanical guard,
 *          so the same mistake fails the build next time instead of relying on someone remembering it.
 *
 *   ## D-004 · Tables hide columns before they scroll
 *   - Date: 2026-11-26
 *   - Status: active                 active | proposed | superseded by D-007 | retired
 *   - Area: layout                   layout | ux | visual | copy | a11y | motion | content | process | stack
 *   - Decision: On phones, tables drop secondary columns first; only the remaining table scrolls.
 *   - Why: Support tickets showed people missing the amount column when the whole table scrolled.
 *   - Rejected: Card list per row (loses comparison); horizontal scroll only (hides the amount).
 *   - Guard: rule:busy-table; pattern:/overflow-x-auto[^"]*min-w-\[/ in src/**; test:tests/tables.spec.ts; review
 *
 *   ## T-002 · Hand-made cards came back in the settings pages
 *   - Date: 2026-11-26
 *   - Status: active
 *   - Seen as: 6 bordered divs with their own padding in src/app/settings
 *   - Cause: The agent copied the neighbouring page instead of using Surface
 *   - Decision: Settings groups use Surface; the page owns spacing.
 *   - Guard: rule:hand-built; pattern:/className="[^"]*rounded-2xl border p-/ in src/app/settings/**
 *
 * Guards:
 *   rule:<id>                    an existing check / audit rule that covers it (validated)
 *   pattern:/regex/flags in glob a project rule: `recanica check` fails (or warns, for D- entries) on a match
 *   test:<path>                  a test file that covers it (must exist)
 *   review                       a person checks it (allowed for decisions, not for traps)
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { COPY_RULES } from "./copy-rules.js";
import { globToRe } from "./config.js";

const HEADER = /^##\s+([DT]-\d{3,})\s*[·:|\-–—]\s*(.+?)\s*$/;
const FIELD = /^[-*]\s+\*{0,2}([A-Za-z][A-Za-z ]{1,20}?)\*{0,2}\s*:\s*\*{0,2}\s*(.*)$/;
const STATUS = /^(active|proposed|retired|superseded by ([DT]-\d{3,}))$/i;
// Reasons that are a feeling, not a reason. A decision's "Why" must name the reader, the content, the evidence or the constraint.
const VAGUE_WHY = /^(for |to (be|look|make it) )?(better|improved?|cleaner|nicer|modern|more modern|sleek|consistency|consistent|best practices?|ux|good ux|user experience|looks? (better|good)|it'?s cleaner|standard)\b[\s\w]{0,25}\.?$/i;

export function logPath(cfg) { return join(cfg.dir, cfg.decisions); }

/** Parse the log. Returns { entries, problems } (problems = unparseable lines inside entries). */
export function parseDecisions(text) {
  const entries = [];
  let cur = null, last = null;
  text.split("\n").forEach((line, i) => {
    const h = line.match(HEADER);
    if (h) { cur = { id: h[1], kind: h[1][0] === "T" ? "trap" : "decision", title: h[2], line: i + 1, fields: {} }; entries.push(cur); last = null; return; }
    if (/^#{1,2}\s/.test(line)) { cur = null; return; }
    if (!cur) return;
    const f = line.match(FIELD);
    if (f) { last = f[1].trim().toLowerCase(); cur.fields[last] = f[2].trim(); return; }
    if (last && /^\s{2,}\S/.test(line)) cur.fields[last] += " " + line.trim();
  });
  for (const e of entries) {
    e.status = (e.fields.status ?? "").toLowerCase();
    e.active = e.status === "active";
    e.guards = parseGuards(e.fields.guard ?? "");
  }
  return entries;
}

export function parseGuards(s) {
  const out = [];
  const re = /(rule|audit):([\w-]+)|pattern:\/((?:\\.|[^/\\])+)\/([a-z]*)(?:\s+in\s+([^;]+?))?(?=\s*;|\s*$)|test:([^;\s]+)|\b(review)\b/g;
  for (const m of s.matchAll(re)) {
    if (m[1]) out.push({ type: "rule", rule: m[2] });
    else if (m[3]) out.push({ type: "pattern", source: m[3], flags: m[4] ?? "", files: (m[5] ?? "**").trim() });
    else if (m[6]) out.push({ type: "test", path: m[6] });
    else if (m[7]) out.push({ type: "review" });
  }
  return out;
}

export function loadDecisions(cfg) {
  const p = logPath(cfg);
  if (!existsSync(p)) return { path: p, exists: false, entries: [] };
  return { path: p, exists: true, entries: parseDecisions(readFileSync(p, "utf8")) };
}

/**
 * Project rules from active entries' pattern guards, in the same shape `recanica check` uses.
 * Traps fail the build (must); decisions are reported (should), unless the entry says "Level: must".
 */
export function guardRules(cfg) {
  const { entries } = loadDecisions(cfg);
  const rules = [];
  for (const e of entries) {
    if (!e.active) continue;
    for (const g of e.guards) {
      if (g.type !== "pattern") continue;
      let re; try { re = new RegExp(g.source, g.flags.replace(/g/g, "")); } catch { continue; }
      const level = (e.fields.level ?? (e.kind === "trap" ? "must" : "should")).toLowerCase() === "must" ? "error" : "warn";
      rules.push({ id: e.id, level, re, files: globToRe(g.files), message: `${e.id} ${e.title}`, fix: e.fields.decision ?? "see the decision log" });
    }
  }
  return rules;
}

/** Lint the log. knownRules = every rule id `check` and `audit` know. Returns [{ id, level: "error"|"warn", message }]. */
export function lintDecisions(cfg, knownRules) {
  const { path, exists, entries } = loadDecisions(cfg);
  const out = [];
  const add = (id, level, message) => out.push({ id, level, message });
  if (!exists) { add("log", "warn", `No decision log at ${cfg.decisions}. Run \`recanica kickoff\` or \`recanica decisions new\`.`); return out; }
  const ids = new Map();
  for (const e of entries) {
    if (ids.has(e.id)) add(e.id, "error", `duplicate id (also on line ${ids.get(e.id)})`);
    ids.set(e.id, e.line);
  }
  for (const e of entries) {
    const f = e.fields;
    const need = e.kind === "trap" ? ["date", "status", "seen as", "cause", "decision", "guard"] : ["date", "status", "decision", "why", "guard"];
    for (const k of need) if (!f[k]) add(e.id, "error", `missing "${k[0].toUpperCase() + k.slice(1)}"`);
    if (f.date && !/^\d{4}-\d{2}-\d{2}$/.test(f.date)) add(e.id, "warn", `Date should be YYYY-MM-DD (got "${f.date}")`);
    if (f.status && !STATUS.test(f.status)) add(e.id, "error", `Status must be active, proposed, retired or "superseded by D-###" (got "${f.status}")`);
    const sup = f.status?.match(/superseded by ([DT]-\d{3,})/i);
    if (sup && !ids.has(sup[1].toUpperCase())) add(e.id, "error", `superseded by ${sup[1]}, which isn't in the log`);
    if (f.supersedes) for (const s of f.supersedes.split(/[,\s]+/).filter(Boolean)) {
      const target = entries.find((x) => x.id === s);
      if (!target) add(e.id, "error", `supersedes ${s}, which isn't in the log`);
      else if (e.active && target.active) add(s, "error", `still active, but ${e.id} supersedes it: set its Status to "superseded by ${e.id}"`);
    }
    // A decision without a reason is how guidelines get ignored later: nobody can tell whether it still applies.
    if (f.why && (VAGUE_WHY.test(f.why) || f.why.length < 20)) add(e.id, "warn", `"Why" is too vague ("${f.why}"): name the reader, the content, the evidence or the constraint`);
    if (e.kind === "decision" && e.active && !f.rejected) add(e.id, "warn", `no "Rejected" alternatives: write down what you didn't do, so it isn't tried again`);
    // Guards.
    if (f.guard && !e.guards.length) add(e.id, "error", `Guard "${f.guard}" isn't recognised: use rule:<id>, pattern:/re/ in <glob>, test:<path> or review`);
    if (e.kind === "trap" && e.active && e.guards.length && e.guards.every((g) => g.type === "review"))
      add(e.id, "error", "a trap needs a mechanical guard (rule:, pattern: or test:): review alone is how the same mistake comes back");
    for (const g of e.guards) {
      if (g.type === "rule" && knownRules && !knownRules.has(g.rule)) add(e.id, "error", `rule:${g.rule} doesn't exist (see \`recanica rules\` / GOVERNANCE.md)`);
      if (g.type === "pattern") { try { new RegExp(g.source, g.flags.replace(/g/g, "")); } catch (err) { add(e.id, "error", `pattern guard doesn't compile: ${err.message}`); } }
      if (g.type === "test" && !existsSync(join(cfg.dir, g.path))) add(e.id, "error", `test:${g.path} doesn't exist`);
    }
    // The log is read by people and agents at the start of every task: no slop in it either.
    for (const [k, v] of Object.entries(f)) for (const [re, msg, level] of COPY_RULES) {
      if (level === "error" && re.test(v)) add(e.id, "warn", `${k}: ${msg}`);
    }
  }
  return out;
}

/** A compact brief for the start of a task: active decisions and traps, one line each. */
export function briefDecisions(cfg) {
  const { exists, entries } = loadDecisions(cfg);
  if (!exists) return `No UI decision log yet (${cfg.decisions}).`;
  const act = entries.filter((e) => e.active);
  const line = (e) => `- ${e.id} ${e.title}: ${e.fields.decision ?? ""}${e.guards.length ? `  [guard: ${e.guards.map((g) => g.type === "rule" ? g.rule : g.type).join(", ")}]` : ""}`;
  const traps = act.filter((e) => e.kind === "trap"), decs = act.filter((e) => e.kind === "decision");
  const proposed = entries.filter((e) => e.status === "proposed");
  return [
    `UI decisions in force (${cfg.decisions}). Follow them; to change one, add a new entry that supersedes it, don't just do something else.`,
    decs.length ? `\nDecisions\n${decs.map(line).join("\n")}` : "",
    traps.length ? `\nTraps already hit (don't repeat them)\n${traps.map(line).join("\n")}` : "",
    proposed.length ? `\nProposed, waiting for a human: ${proposed.map((e) => `${e.id} ${e.title}`).join("; ")}` : "",
  ].filter(Boolean).join("\n");
}

export const LOG_HEADER = `# UI and UX decisions

The decisions this project's UI is built on, and the traps it has already fallen into.
Read it before UI work (\`npx recanica decisions brief\`). Add to it as you go:

- **Made a UI/UX decision?** Add a \`D-\` entry: what, why (reader, content, evidence or constraint), what you rejected, and its guard.
- **Caught a mistake?** Add a \`T-\` entry for the *class* of mistake, fix it in the shared part, and give it a mechanical guard
  (\`rule:\`, \`pattern:\` or \`test:\`). A pattern guard makes \`recanica check\` fail if it happens again.
- **Changing your mind?** Don't edit the old entry: add a new one with \`Supersedes: D-###\` and set the old one to \`superseded by D-###\`.

\`npx recanica decisions lint\` checks this file in CI. Format: see \`recanica decisions --help\`.
`;

export function nextId(entries, kind) {
  const p = kind === "trap" ? "T" : "D";
  const n = Math.max(0, ...entries.filter((e) => e.id[0] === p).map((e) => parseInt(e.id.slice(2), 10)));
  return `${p}-${String(n + 1).padStart(3, "0")}`;
}

export function entryTemplate({ id, title, kind, date, decision = "", why = "", rejected = "", guard = "review", area = "", seen = "", cause = "", status = "active", extra = {} }) {
  const f = [`## ${id} · ${title}`, `- Date: ${date}`, `- Status: ${status}`];
  for (const [k, v] of Object.entries(extra)) if (v) f.push(`- ${k}: ${v}`);
  if (area) f.push(`- Area: ${area}`);
  if (kind === "trap") f.push(`- Seen as: ${seen}`, `- Cause: ${cause}`);
  f.push(`- Decision: ${decision}`);
  if (kind !== "trap") f.push(`- Why: ${why}`, `- Rejected: ${rejected}`);
  f.push(`- Guard: ${guard}`);
  return f.join("\n") + "\n";
}

/** Append entries to the log (creating it with its header). Returns the ids written. */
export function appendEntries(cfg, items, write = true) {
  const p = logPath(cfg);
  const cur = existsSync(p) ? readFileSync(p, "utf8") : LOG_HEADER;
  const entries = parseDecisions(cur);
  const ids = [];
  let text = cur.trimEnd() + "\n";
  for (const it of items) {
    const id = nextId([...entries, ...ids.map((x) => ({ id: x }))], it.kind);
    ids.push(id);
    text += "\n" + entryTemplate({ ...it, id });
  }
  if (write) { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, text); }
  return ids;
}
