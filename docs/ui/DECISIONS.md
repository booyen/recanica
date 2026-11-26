# UI and UX decisions

The decisions this project's UI is built on, and the traps it has already fallen into.
Read it before UI work (`npx recanica decisions brief`). Add to it as you go:

- **Made a UI/UX decision?** Add a `D-` entry: what, why (reader, content, evidence or constraint), what you rejected, and its guard.
- **Caught a mistake?** Add a `T-` entry for the *class* of mistake, fix it in the shared part, and give it a mechanical guard
  (`rule:`, `pattern:` or `test:`). A pattern guard makes `recanica check` fail if it happens again.
- **Changing your mind?** Don't edit the old entry: add a new one with `Supersedes: D-###` and set the old one to `superseded by D-###`.

`npx recanica decisions lint` checks this file in CI. Format: see `recanica decisions --help`.

## D-001 · Stack: nextjs
- Date: 2026-11-26
- Status: active
- Kickoff: stack
- Area: stack
- Decision: Use Recanica's nextjs path (docs/STACKS.md).
- Why: The docs site (apps/docs) and next-marketing template are Next.js; the published packages stay framework-neutral (tokens, rc-* CSS) so other stacks get the same parts through their adapters.
- Rejected: A framework-free docs site (the docs would no longer exercise the React parts they document).
- Guard: review

## D-002 · Monochrome by default, one brand moment per view
- Date: 2026-11-26
- Status: active
- Area: visual
- Decision: Surfaces, text and controls use the neutral tokens; --brand appears once per view (the primary action or the hero title) and nowhere as decoration.
- Why: Recanica's readers are teams shipping product UI; calm comes from space and type, and a single brand colour lets each project re-skin by setting --brand alone.
- Rejected: A second accent colour for links and badges (two colours compete for the one focal point); brand-tinted surfaces and gradients (the slop check flags them, and they don't survive a re-skin).
- Guard: rule:palette-hue; rule:hard-coded-color; rule:busy-primary; review

## D-003 · Docs read in one reading column
- Date: 2026-11-26
- Status: active
- Area: layout
- Decision: Docs pages keep prose, tables and examples in one reading column (`Page width="reading"`, about 65ch for prose); the section nav and the page outline sit beside it, never inside it.
- Why: Docs readers scan top to bottom for one answer; lines past about 75 characters and side-by-side prose slow that down, and the audit measures both.
- Rejected: Full-width prose on wide screens (lines run past 120 characters); two-column prose with examples beside the text (breaks at 900px and splits the reader's eye).
- Guard: rule:line-length; rule:content-width; rule:two-right-edges

## D-004 · Labels and table keys never wrap
- Date: 2026-11-26
- Status: active
- Area: layout
- Decision: Button labels, badges, nav items and ReferenceTable key cells stay on one line (whitespace-nowrap in the part); when space runs out the column or label shortens, the text never breaks.
- Why: A key that breaks mid-word (on-Click) reads as two words and stops readers matching it to code; at 375px this happened in the prop tables.
- Rejected: Letting key cells wrap with break-all (splits identifiers mid-word); truncating keys with an ellipsis (hides the name the reader came for).
- Guard: rule:wrapped-label

## D-005 · List rows over card grids for uneven text
- Date: 2026-11-26
- Status: active
- Area: layout
- Decision: Where items carry text of uneven length (the home page list of what Recanica ships, adopted in https://github.com/booyen/recanica/pull/1; feature lists), use divided list rows; card grids only for items of equal shape.
- Why: On the home page, grid cards stretched to the tallest neighbour and left blank areas under the short ones; rows let each item take its own height and read in order.
- Rejected: A bento or card grid of features (stretched cards and blank areas, flagged by stretched-rows); a masonry grid (reading order no longer follows the source).
- Guard: rule:stretched-rows; rule:uneven-columns; review

## D-006 · Docs are prerendered; nothing reads fs or runs Shiki at request time
- Date: 2026-11-26
- Status: active
- Level: must
- Area: stack
- Decision: Every docs route is static (generateStaticParams with dynamicParams = false, force-static route handlers); fs reads and Shiki highlighting happen at build only.
- Why: The site runs on Cloudflare Workers through OpenNext, which has no filesystem and a tight CPU budget per request; a dynamic page that reads fs or loads Shiki fails there.
- Rejected: Rendering docs on request (needs fs and Shiki in the Worker, which fail); highlighting code in the browser (ships Shiki to every reader and flashes unstyled code).
- Guard: pattern:/force-dynamic|dynamicParams\s*=\s*true|export const revalidate\s*=\s*0/ in apps/docs/app/**

## T-001 · Mono key cells wrapped mid-word and the audit let them through
- Date: 2026-11-26
- Status: active
- Area: layout
- Seen as: At 375px, `ReferenceTable keys="code"` broke prop names mid-word (on-Click) in every prop table, and `recanica audit` reported no wrapped-label findings (fixed in https://github.com/booyen/recanica/pull/1).
- Cause: The part only set nowrap on plain-text keys, and the wrapped-label audit skipped monospace cells on the assumption that code wraps by design.
- Decision: ReferenceTable key cells never wrap, whatever their font; the wrapped-label audit rule checks mono cells too.
- Guard: rule:wrapped-label

## D-007 · Flexibility: guided overall, locked for the published packages
- Date: 2026-11-26
- Status: active
- Kickoff: flexibility
- Area: process
- Decision: Run Recanica in guided mode, with zones in recanica.config.json: packages/tokens, packages/ui and packages/css are locked; apps/docs and templates are guided.
- Why: Every project inherits the packages, so a style deviation there spreads to all of them and must be a recorded decision; docs demos and templates show the parts in use and sometimes need a reasoned exception.
- Rejected: Locked everywhere (docs pages that show colours and type sizes would need an exception each); open for the templates (they are copied into projects as their starting point, so they set the standard).
- Guard: rule:hand-built; rule:design-slop
