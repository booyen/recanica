/**
 * recanica kickoff — the questionnaire every new project starts with.
 *
 *   npx recanica kickoff                       ask in the terminal (defaults in brackets; Enter accepts)
 *   npx recanica kickoff --questions [--json]  print the questions, for an AI agent to ask the human
 *   npx recanica kickoff --answers a.json      write the result from answers an agent collected
 *   npx recanica kickoff --yes                 accept every default (CI, quick trials)
 *
 * Writes:
 *   recanica.config.json   "project" (role, flexibility, stack, surfaces), "scope", "zones", rule levels
 *   docs/ui/KICKOFF.md     the answers, readable, with the reasons
 *   docs/ui/DECISIONS.md   the first decisions (stack, role, flexibility), seeded from the answers
 *   docs/ui/PROPOSALS.md   guest projects: where UI suggestions for the wider team go
 *
 * Re-running it is safe: it updates the project block and appends new decisions that supersede changed ones.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createInterface } from "node:readline/promises";
import { FLEXIBILITY, loadConfig } from "./config.js";
import { appendEntries, loadDecisions } from "./decisions.js";

/**
 * The questions. Each: id, group, q (what to ask), why (one line the asker can show), type, options, default.
 * Defaults are what Recanica recommends when the human has no opinion; the agent should still ask.
 */
export const QUESTIONS = [
  { id: "name", group: "Project", q: "What is the project called?", why: "Used in the kickoff record and decision log.", type: "text", default: "" },
  { id: "purpose", group: "Project", q: "In one sentence: what is it for, and who uses it?", why: "Every page brief starts from this reader.", type: "text", default: "" },
  { id: "surfaces", group: "Project", q: "What will the UI work produce?", why: "Each surface has its own patterns and checks.", type: "multi",
    options: ["app", "site", "docs", "email", "mobile", "marketing assets"], default: ["app"] },
  { id: "locale", group: "Project", q: "Main locale for money, dates and names?", why: "Sample data and formats follow it.", type: "text", default: "en-MY" },

  { id: "role", group: "Role", q: "Does the UI work own this codebase, or is it one part of a bigger build?", why: "A guest changes only its own paths and proposes everything else.", type: "choice",
    options: [{ value: "owner", label: "Owner: the UI team runs this codebase" }, { value: "guest", label: "Guest: we're the UI/UX part of someone else's build" }], default: "owner" },
  { id: "owns", group: "Role", q: "Guest only: which paths does the UI work own? (comma-separated globs)", why: "Checks block only here; elsewhere they're advice.", type: "list",
    when: (a) => a.role === "guest", default: ["src/components/**", "src/styles/**"] },
  { id: "approver", group: "Role", q: "Who approves changes outside the UI scope (name or role)?", why: "Proposals go to them.", type: "text", when: (a) => a.role === "guest", default: "the tech lead" },

  { id: "stack", group: "Stack", q: "Which stack? (or 'unknown' if it isn't decided yet)", why: "Unknown starts CSS-first, so nothing has to be rewritten when the stack is chosen.", type: "choice",
    options: ["nextjs", "vite-react", "react-other", "vue", "svelte", "astro", "angular", "html", "tailwind-v3", "flutter", "swiftui", "compose", "unknown"], default: "detected" },

  { id: "flexibility", group: "Flexibility", q: "How strict should the system be?", why: "Tokens are fixed in every mode; this sets how hard the composition and reuse rules push.", type: "choice",
    options: [
      { value: "locked", label: "Locked: product UI at scale, many contributors or agents. Every deviation is a recorded decision." },
      { value: "guided", label: "Guided (recommended): reuse and structure enforced; style rules reported, can be allowed with a reason." },
      { value: "open", label: "Open: art-directed work. Tokens fixed, composition free, reuse reported." },
    ], default: "guided" },
  { id: "openZones", group: "Flexibility", q: "Any areas that should be looser than the rest? (globs, e.g. src/campaigns/**; empty for none)", why: "A campaign area can be open while the app stays locked.", type: "list", default: [] },
  { id: "brand", group: "Flexibility", q: "Brand colour (hex) and font, or 'later'?", why: "The one colour that is meant to change.", type: "text", default: "later" },

  { id: "reviewTarget", group: "Done", q: "Review score a page must reach (recanica review, 0–100)?", why: "Part of the definition of done.", type: "number", default: 85 },
  { id: "reviewer", group: "Done", q: "Who looks at a page before it counts as done (not its author)?", why: "Checks catch rule breaks; a person judges taste.", type: "text", default: "" },
  { id: "references", group: "Done", q: "3 pages that feel right and 3 that feel wrong, with one 'why' each (or 'later')", why: "The 'why' is what transfers to new pages.", type: "text", default: "later" },

  { id: "scale", group: "Scale", q: "Roughly how many pages or screens, and how many page types?", why: "10 pages can rely on review; 1,000 need a template per page type.", type: "text", default: "" },
];

const SURFACE_CHECKS = {
  app: "page anatomy + recanica-page briefs", site: "web recipes + WebSection parts", docs: "reading column + reference tables",
  email: "table-based HTML (inline hex is an accepted deviation)", mobile: "tokens for Flutter / SwiftUI / Compose", "marketing assets": "open zone + slop check on every headline",
};

export function questionsFor(answers = {}) { return QUESTIONS.filter((q) => !q.when || q.when(answers)); }

function normalise(a, detected) {
  const out = { ...a };
  for (const q of QUESTIONS) {
    let v = out[q.id];
    if (v === undefined || v === "") v = q.default === "detected" ? detected : q.default;
    if (q.type === "list" && typeof v === "string") v = v.split(",").map((s) => s.trim()).filter(Boolean);
    if (q.type === "multi" && typeof v === "string") v = v.split(",").map((s) => s.trim()).filter(Boolean);
    if (q.type === "number") v = Number(v) || q.default;
    out[q.id] = v;
  }
  if (!FLEXIBILITY[out.flexibility]) out.flexibility = "guided";
  if (out.role !== "guest") { out.role = "owner"; delete out.owns; delete out.approver; }
  return out;
}

export function printQuestions(log, json) {
  if (json) { process.stdout.write(JSON.stringify(QUESTIONS.map(({ when, ...q }) => ({ ...q, ...(when ? { askIf: q.id === "owns" || q.id === "approver" ? "role is guest" : "" } : {}) })), null, 2) + "\n"); return; }
  let g = "";
  log("Recanica kickoff: ask these one group at a time, show the default, and record the human's answers in a JSON file");
  log("keyed by id, then run `npx recanica kickoff --answers <file>`.\n");
  for (const q of QUESTIONS) {
    if (q.group !== g) { g = q.group; log(`\n## ${g}`); }
    const opts = q.options ? `\n   options: ${q.options.map((o) => (typeof o === "string" ? o : `${o.value} (${o.label})`)).join(" | ")}` : "";
    log(`- ${q.id}: ${q.q}${opts}\n   default: ${JSON.stringify(q.default)} · why: ${q.why}${q.when ? " · ask only for guest projects" : ""}`);
  }
}

async function ask(detected) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const a = {};
  let g = "";
  for (const q of QUESTIONS) {
    if (q.when && !q.when(a)) continue;
    if (q.group !== g) { g = q.group; console.log(`\n\x1b[1m${g}\x1b[0m`); }
    const def = q.default === "detected" ? detected : q.default;
    if (q.options) q.options.forEach((o, i) => console.log(`  ${i + 1}. ${typeof o === "string" ? o : o.label}`));
    const shown = Array.isArray(def) ? def.join(", ") : def;
    const r = (await rl.question(`${q.q} \x1b[2m${q.why}\x1b[0m\n> ${shown !== "" ? `[${shown}] ` : ""}`)).trim();
    if (!r) { a[q.id] = def; continue; }
    if (q.options && /^\d+$/.test(r) && q.type !== "multi") { const o = q.options[Number(r) - 1]; a[q.id] = typeof o === "string" ? o : o?.value ?? r; continue; }
    if (q.type === "multi" && /^[\d,\s]+$/.test(r)) { a[q.id] = r.split(",").map((n) => q.options[Number(n.trim()) - 1]).filter(Boolean); continue; }
    a[q.id] = r;
  }
  rl.close();
  return a;
}

function renderKickoff(a, date, zones = []) {
  const strict = FLEXIBILITY[a.flexibility];
  const list = (v) => (Array.isArray(v) && v.length ? v.join(", ") : "none");
  return `# Kickoff · ${a.name || "this project"}

Recorded ${date} by \`recanica kickoff\`. Re-run it when one of these answers changes; the decision log keeps the history.

**Purpose and reader:** ${a.purpose || "_to fill in_"}

**Surfaces:** ${list(a.surfaces)}
${(a.surfaces ?? []).map((s) => `- ${s}: ${SURFACE_CHECKS[s] ?? "agree its patterns before the first page"}`).join("\n")}

**Locale:** ${a.locale}

${(a._assumed ?? []).length ? `> **Assumed, not yet confirmed by a person:** ${a._assumed.join(", ")}. Confirm them and re-run \`recanica kickoff\`.\n` : ""}
## Role
${a.role === "guest"
    ? `**Guest.** The UI work is one part of a bigger build. It owns: ${list(a.owns)}.
- Inside those paths, Recanica's checks block the build.
- Outside them, findings are advice: raise them in \`docs/ui/PROPOSALS.md\` for ${a.approver || "the code owners"} to decide. Don't change that code.
- Build config, routing, data, state, dependencies and CI belong to the wider team.`
    : "**Owner.** The UI team runs this codebase; the checks apply everywhere."}

## Stack
**${a.stack}.** ${a.stack === "unknown" ? "Start CSS-first: tokens + `@recanica/css` (`rc-*` classes) in plain HTML or Vite. The classes are the contract, so moving to React, Vue or Svelte later swaps the adapter, not the design. See docs/STACKS.md." : "See docs/STACKS.md for what Recanica ships for this stack."}

## Flexibility
**${a.flexibility}.** Fixed in every mode: tokens only (no raw colours, no palette hues), valid CSS variables, no placeholder copy.
Must in this mode: ${Object.entries(strict).filter(([, v]) => v === "must").map(([k]) => `\`${k}\``).join(", ")}.
${(a.openZones ?? []).length ? `Open zones (tokens fixed, composition free): ${a.openZones.map((z) => `\`${z}\``).join(", ")}.` : "No open zones."}
${zones.filter((z) => !z.$kickoff).length ? `Other zones (recanica.config.json "zones"):\n${zones.filter((z) => !z.$kickoff).map((z) => `- \`${z.files}\`: ${z.flexibility}${z.reason ? `. ${z.reason}` : ""}`).join("\n")}` : ""}

**Brand:** ${a.brand}

## Done means
- A brief exists (recanica-page skill) and the page was looked at at 375px and 1280px.
- \`recanica review\` scores ${a.reviewTarget}+ with nothing under 70; \`recanica audit\` and \`recanica check\` show 0 must-fix; \`recanica slop\` shows 0 must-fix.
- ${a.reviewer || "_someone other than the author_"} has looked at it.
- Any UI/UX decision made on the way is in \`docs/ui/DECISIONS.md\`.

**References (right / wrong, and why):** ${a.references}

**Scale:** ${a.scale || "_to fill in_"}

## Still to decide with the team (from the kickoff skill)
- Which repeated things (filters bar, empty states, detail panels) become shared parts before the first page.
- The content extremes for each shared part (shortest and longest text, numbers, empty, 1 vs 1,000 items, other languages).
`;
}

const PROPOSALS = `# UI proposals

Suggestions for code the UI work doesn't own (recanica.config.json "scope"). The UI work raises them here; the owners decide.
Keep each one short and specific, with evidence. At most three new ones per task, raised at the end of the task.

| # | Date | Where | What we saw | Suggestion | Evidence | Effort | Status |
|---|---|---|---|---|---|---|---|
`;

export async function runKickoff(root, flags, log, { detectStack }) {
  if (flags.questions) { printQuestions(log, !!flags.json); return 0; }
  const detected = detectStack();
  let raw = {};
  if (typeof flags.answers === "string") raw = JSON.parse(readFileSync(join(root, flags.answers), "utf8"));
  else if (!flags.yes && process.stdin.isTTY) raw = await ask(detected);
  const a = normalise(raw, detected);
  const date = flags.date ?? new Date().toISOString().slice(0, 10);
  const dry = !!flags["dry-run"];
  const changes = [];
  const put = (rel, content, onlyIfMissing = false) => {
    const p = join(root, rel);
    if (onlyIfMissing && existsSync(p)) return;
    changes.push(`${existsSync(p) ? "update" : "create"} ${rel}`);
    if (!dry) { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, content); }
  };

  // 1. Config: project block, scope, zones. Explicit rules the project already set are kept.
  const cfgPath = join(root, "recanica.config.json");
  let cfg = {};
  if (existsSync(cfgPath)) { try { cfg = JSON.parse(readFileSync(cfgPath, "utf8")); } catch {} }
  const before = cfg.project ?? null;
  cfg.project = {
    name: a.name || before?.name || "", kickoffDate: date, kickoff: "docs/ui/KICKOFF.md",
    role: a.role, flexibility: a.flexibility, stack: a.stack, surfaces: a.surfaces, locale: a.locale,
    ...((a._assumed ?? []).length ? { assumed: a._assumed } : {}),
    done: { reviewTarget: a.reviewTarget, reviewer: a.reviewer || null },
  };
  if (a.role === "guest") cfg.scope = { owns: a.owns };
  else delete cfg.scope;
  const zones = (cfg.zones ?? []).filter((z) => z.flexibility !== "open" || !z.$kickoff);
  for (const z of a.openZones ?? []) if (!zones.some((x) => x.files === z)) zones.push({ files: z, flexibility: "open", reason: "Open zone chosen at kickoff", $kickoff: true });
  if (zones.length) cfg.zones = zones; else delete cfg.zones;
  cfg.decisions = cfg.decisions ?? "docs/ui/DECISIONS.md";
  // The presets carry the levels; drop init's defaults that only restate the guided preset, so changing flexibility later works.
  if (cfg.rules) {
    for (const [k, v] of Object.entries(cfg.rules)) if (FLEXIBILITY.guided[k] === v && !before) delete cfg.rules[k];
    if (!Object.keys(cfg.rules).length) delete cfg.rules;
  }
  const { $comment, project, scope, zones: z2, decisions, ...rest } = cfg;
  const ordered = { $comment: $comment ?? "How strict Recanica is in this project. Set by `recanica kickoff`; must = fails the build, should = reported. Loosen a rule only with a reason; record accepted deviations in allow.",
    project, ...(scope ? { scope } : {}), ...(z2 ? { zones: z2 } : {}), decisions, ...rest };
  put("recanica.config.json", JSON.stringify(ordered, null, 2) + "\n");

  // 2. The readable record.
  put("docs/ui/KICKOFF.md", renderKickoff(a, date, cfg.zones ?? []));

  // 3. The first decisions, so the log starts with the choices everything else depends on.
  const conf = loadConfig(root);
  const { entries } = loadDecisions(conf);
  const seeds = [];
  const changed = (k) => !before || before[k] !== cfg.project[k];
  const seed = (key, title, decision, why, rejected, guard = "review") => {
    if (!changed(key)) return;
    const prev = [...entries].reverse().find((e) => e.active && e.fields["kickoff"] === key);
    seeds.push({ kind: "decision", title, date, area: key === "stack" ? "stack" : "process", decision, why, rejected, guard, prev, extra: { Kickoff: key, Supersedes: prev?.id } });
  };
  seed("role", a.role === "guest" ? "The UI work is a guest in this codebase" : "The UI team owns this codebase",
    a.role === "guest" ? `Change only ${a.owns.join(", ")}; propose everything else in docs/ui/PROPOSALS.md for ${a.approver}.` : "Recanica's checks apply to the whole codebase.",
    a.role === "guest" ? "The UI is one part of a bigger build; changing other teams' code from a UI task breaks their work and their trust." : "One team decides the UI end to end, so one set of rules can apply everywhere.",
    a.role === "guest" ? "Applying the checks everywhere (would fail other teams' builds); no scope at all (UI changes leak into routing and data code)." : "Guest mode (nobody else owns the UI code).");
  seed("flexibility", `Flexibility is ${a.flexibility}`, `Run Recanica in ${a.flexibility} mode${(a.openZones ?? []).length ? `, with open zones ${a.openZones.join(", ")}` : ""}.`,
    a.flexibility === "locked" ? "Many contributors and agents build pages; every deviation needs to be a visible, reviewable decision." : a.flexibility === "open" ? "The work is art-directed per piece; composition has to be free while tokens keep it on brand." : "Reuse and structure must hold from day one; style deviations happen and need a reason, not a fight.",
    ["locked", "guided", "open"].filter((x) => x !== a.flexibility).map((x) => `${x} mode`).join("; ") + " (see KICKOFF.md).", "rule:hand-built");
  seed("stack", `Stack: ${a.stack}`, a.stack === "unknown" ? "Build CSS-first with tokens + rc-* classes until the stack is chosen." : `Use Recanica's ${a.stack} path (docs/STACKS.md).`,
    a.stack === "unknown" ? "The stack isn't chosen yet; the rc-* classes are the contract every adapter renders, so CSS-first work carries over." : "Chosen at kickoff; the adapter maps Recanica's parts onto this stack.",
    a.stack === "unknown" ? "Defaulting to Next.js (locks the project in before the decision is made)." : "Starting framework-free and porting later (slower for this team).");
  if (seeds.length && !dry) {
    const ids = appendEntries(conf, seeds.map(({ prev, ...s }) => s));
    // An answer that changed supersedes the decision the last kickoff recorded for it.
    const p = join(conf.dir, conf.decisions);
    let text = readFileSync(p, "utf8");
    seeds.forEach((s, i) => {
      if (s.prev) text = text.replace(new RegExp(`(## ${s.prev.id} [^\\n]*\\n(?:- [^\\n]*\\n)*?)- Status: active\\n`), `$1- Status: superseded by ${ids[i]}\n`);
    });
    writeFileSync(p, text);
    changes.push(`update ${conf.decisions} (${ids.join(", ")})`);
  }

  // 4. Guests get a place to put suggestions.
  if (a.role === "guest") put("docs/ui/PROPOSALS.md", PROPOSALS, true);

  if (flags.json) { process.stdout.write(JSON.stringify({ answers: a, changes }, null, 2) + "\n"); return 0; }
  log(`\nKickoff recorded (${a.role}, ${a.flexibility}, ${a.stack}).`);
  for (const ch of changes) log(`  • ${ch}`);
  log(`\nNext: build the shared parts the kickoff skill lists, then start pages with the recanica-page skill.`);
  return 0;
}
