---
name: recanica-kickoff
description: Use at the start of any new project, design system, or major redesign that uses Recanica — before the first page is built. Runs the start-of-project questionnaire with the human (role in the wider build, UI scope, stack, flexibility, definition of done), records it with `npx recanica kickoff` (config, docs/ui/KICKOFF.md, the first entries of the decision log), then settles which shared parts exist before any page. Trigger on "new project", "start a project", "set up the design system", "kickoff", "redesign the whole app".
---

# Recanica kickoff

Projects drift into inconsistency when the look is defined but the *decisions* aren't: every page then re-decides spacing,
headers, sections and emphasis, and every re-decision is a new chance for the same mistake. This skill makes those decisions
once, at the start, with the human, and turns them into config, a decision log and shared parts before any page exists.

## 1. Run the questionnaire with the human (required, before any page)

1. Get the questions: `npx recanica kickoff --questions` (or MCP `get_kickoff_questions`). Each has a default and a one-line why.
2. Ask the human **one group at a time** (Project, Role, Stack, Flexibility, Done, Scale). Show the default and the why.
   Use your multiple-choice question tool where you have one. Never answer for the human.
3. If the human isn't available, use the defaults, list the ids you assumed under `"_assumed"` in the answers, and say so in
   the first line of your reply. Assumed answers are marked in KICKOFF.md until someone confirms them.
4. Save the answers as JSON keyed by question id (e.g. `kickoff-answers.json`, not committed) and run
   `npx recanica kickoff --answers kickoff-answers.json`.

That writes:
- `recanica.config.json`: `project` (role, flexibility, stack, surfaces), `scope` for guests, `zones` for looser areas.
- `docs/ui/KICKOFF.md`: the answers, readable.
- `docs/ui/DECISIONS.md`: D-001… for role, flexibility and stack. Re-running with a changed answer supersedes the old entry.
- `docs/ui/PROPOSALS.md` for guest projects.

Things to get right while asking:
- **Role.** If the UI work is one part of a bigger build (another team owns the app, the backend, the build), the answer is
  *guest*. Ask which paths the UI work owns. Outside them, Recanica's checks only advise, and you propose instead of changing.
- **Stack.** "Unknown" is a good answer. Don't default to Next.js because it has the most examples: unknown means CSS-first
  (see docs/STACKS.md), which carries over to any stack.
- **Flexibility.** Locked, guided or open. Tokens are fixed in every mode. Open zones let a campaign area be art-directed
  while the app stays strict.

## 2. Then settle the system's decisions

The questionnaire sets the frame. These need a conversation; record each outcome with `npx recanica decisions new`.

### Reuse is the point

A design system is decisions made once and reused. Before any page exists, agree with the user:
- Pages are built only from shared parts.
- A missing part is added to the system, not improvised on a page.
- `recanica check` enforces this in CI from day one (`hand-built` and `structure` set to must).

### Which decisions belong to the system, not to pages?

Default: all of these are system decisions, built as shared parts before the first page (React names shown; other stacks use the `rc-*` twins from `packages/ui/parts.json`):
- **Rhythm by role** (tokens): inset · group · flow · stack · section.
- **Page structure**: page column (`Page`), header (`PageHeader`), sections (`Section`, `Heading`), stacks (`Stack`).
- **Sites**: section shell (`WebSection`), section title (`WebSectionTitle`), hero headline (`WebHeroTitle`).
- **Tables**: data table and reference table, with what each column holds decided by the author (`keys="label" | "code"`).
- **Emphasis by role**: main content in foreground, supporting text muted.
- **Width per column**: reading, content or full.

Ask: anything else this product repeats on many pages (filters bar, empty states, detail panels)? Those become parts too.

### What content will each part hold?

For every shared part, list its content extremes: shortest and longest text, single words, prose vs code/IDs, numbers
(and the largest), empty, 1 vs 1,000 items, other languages. These decide the part's defaults and become its stress tests
(component QA at 240px, 400px and full width).

### What does "right" look like?

The questionnaire asks for 3 pages that feel right and 3 that feel wrong, with one sentence on why for each. If the human
said "later", come back to it before the first page. Add them to `docs/ui/KICKOFF.md`. Visual inspiration alone isn't enough; the "why" is what transfers.

### What happens when a bug is found?

Default, agreed up front:
1. Name the *class* of problem, not just the instance.
2. Fix it in the shared part or token, never on one page.
3. Add a permanent test (component QA content case or audit rule) that fails on the old behaviour.
4. Record it as a trap: `npx recanica decisions new --trap --title "<class of mistake>"`, with Seen as, Cause, Decision and a
   mechanical guard (`rule:`, `pattern:/…/ in <glob>` or `test:`). A pattern guard makes `recanica check` fail if it comes back.

## 3. Then

1. Build or adopt the shared parts (Recanica ships most of them), with the content cases above.
2. Only then start pages, each with the `recanica-page` skill.
3. Re-run `npx recanica kickoff` whenever an answer changes (new stack, the UI work becomes a guest, flexibility changes).
