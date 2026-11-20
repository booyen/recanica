---
name: recanica-kickoff
description: Use at the start of any new project, design system, or major redesign that uses Recanica — before the first page is built. Asks the questions that decide how the UI stays consistent (which decisions the system owns, what content each part holds, definition of done, reference pages, strictness, how bugs become permanent fixes, scale), records the answers in docs/KICKOFF.md, and builds the shared structure parts before any page. Trigger on "new project", "start a project", "set up the design system", "kickoff", "redesign the whole app".
---

# Recanica kickoff

Projects drift into inconsistency when the look is defined but the *decisions* aren't: every page then re-decides spacing,
headers, sections and emphasis, and every re-decision is a new chance for the same mistake. This skill makes those decisions
once, at the start, and turns them into shared parts before any page exists.

Ask these one group at a time, propose a default for each, and record the answers in `docs/KICKOFF.md`.

## 0. Reuse is the point

A design system is decisions made once and reused. Before any page exists, agree with the user:
- Pages are built only from shared parts.
- A missing part is added to the system, not improvised on a page.
- `recanica check` enforces this in CI from day one (`hand-built` and `structure` set to must).

## 1. Which decisions belong to the system, not to pages?

Default: all of these are system decisions, built as shared parts before the first page:
- **Rhythm by role** (tokens): inset · group · flow · stack · section.
- **Page structure**: page column (`Page`), header (`PageHeader`), sections (`Section`, `Heading`), stacks (`Stack`).
- **Sites**: section shell (`WebSection`), section title (`WebSectionTitle`), hero headline (`WebHeroTitle`).
- **Tables**: data table and reference table, with what each column holds decided by the author (`keys="label" | "code"`).
- **Emphasis by role**: main content in foreground, supporting text muted.
- **Width per column**: reading, content or full.

Ask: anything else this product repeats on many pages (filters bar, empty states, detail panels)? Those become parts too.

## 2. What content will each part hold?

For every shared part, list its content extremes: shortest and longest text, single words, prose vs code/IDs, numbers
(and the largest), empty, 1 vs 1,000 items, other languages. These decide the part's defaults and become its stress tests
(component QA at 240px, 400px and full width).

## 3. When is something done, and who checks it?

Default: a page is done when its brief exists (`recanica-page` skill), it renders correctly at 375px and 1280px,
`recanica review` scores 85+ with nothing under 70, `recanica audit` shows 0 must-fix, and someone other than the author
has looked at it. Ask who that second person is.

## 4. What does "right" look like?

Ask for 3 pages (any product) that feel right and 3 that feel wrong, and one sentence on why for each. Save them in
`docs/KICKOFF.md` as the reference. Visual inspiration alone isn't enough; the "why" is what transfers.

## 5. How strict is each rule?

Walk the must / should / choice levels (see the Design language page). Ask which should-rules this product wants stricter
or looser, and which choices are fixed now: brand colour, font, locale, density, thresholds. Write them into tokens and
`recanica.config.json`.

## 6. What happens when a bug is found?

Default, agreed up front:
1. Name the *class* of problem, not just the instance.
2. Fix it in the shared part or token, never on one page.
3. Add a permanent test (component QA content case or audit rule) that fails on the old behaviour.
4. Record it in `docs/FAILURES.md`: screenshot, class, cause, fix, test.

## 7. How big will this get?

Number of pages, page types, apps and teams. 10 pages can lean on review; 1,000 pages need page templates per page type,
so each type is reviewed once and every page conforms to it.

## Then

1. Build or adopt the shared parts from section 1 (Recanica ships most of them), with the content cases from section 2.
2. Only then start pages, each with the `recanica-page` skill.
