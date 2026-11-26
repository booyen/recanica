# Kickoff · Recanica

Recorded 2026-11-26 by `recanica kickoff`. Re-run it when one of these answers changes; the decision log keeps the history.

**Purpose and reader:** A calm, monochrome-by-default UI framework (tokens, React parts, rc-* CSS, CLI, MCP) for product teams and the AI agents that build their pages.

**Surfaces:** docs, site, email
- docs: reading column + reference tables
- site: web recipes + WebSection parts
- email: table-based HTML (inline hex is an accepted deviation)

**Locale:** en-MY


## Role
**Owner.** The UI team runs this codebase; the checks apply everywhere.

## Stack
**nextjs.** See docs/STACKS.md for what Recanica ships for this stack.

## Flexibility
**guided.** Fixed in every mode: tokens only (no raw colours, no palette hues), valid CSS variables, no placeholder copy.
Must in this mode: `hard-coded-color`, `arbitrary-color`, `self-reference`, `palette-hue`, `hand-built`, `structure`.
No open zones.
Other zones (recanica.config.json "zones"):
- `packages/tokens/**`: locked. Published tokens: every project inherits them, so every deviation is a recorded decision
- `packages/ui/**`: locked. Published React parts: every project inherits them, so every deviation is a recorded decision
- `packages/css/**`: locked. Published rc-* classes: every project inherits them, so every deviation is a recorded decision
- `apps/docs/**`: guided. Docs pages and demos show the parts in use; style deviations need a reason
- `templates/**`: guided. Starter templates are copied into projects; style deviations need a reason

**Brand:** later: monochrome by default; projects set --brand and --font-sans

## Done means
- A brief exists (recanica-page skill) and the page was looked at at 375px and 1280px.
- `recanica review` scores 85+ with nothing under 70; `recanica audit` and `recanica check` show 0 must-fix; `recanica slop` shows 0 must-fix.
- the repo owner (booyen) has looked at it.
- Any UI/UX decision made on the way is in `docs/ui/DECISIONS.md`.

**References (right / wrong, and why):** later

**Scale:** About 80 docs pages of 5 page types (component, pattern, foundation, guide, home), plus 2 templates and the registry blocks.

## Still to decide with the team (from the kickoff skill)
- Which repeated things (filters bar, empty states, detail panels) become shared parts before the first page.
- The content extremes for each shared part (shortest and longest text, numbers, empty, 1 vs 1,000 items, other languages).
