# Failure library

Each entry is a **class** of problem, not one bug. Fix it in the shared part or token, add a test that fails on the old
behaviour, then record it here. Before building a page or part, skim this list.

| # | Class | Seen as | Cause | Fixed in | Guarded by |
|---|---|---|---|---|---|
| 1 | **Content doesn't fit a part's default** | Long names run over bar charts; step names wrap in tables; single words shown as code | A part assumed short or code content (fixed `w-8` label column; key column styled as code; guessing "no spaces = code") | `BarRow`/`StatList` subgrid; `ReferenceTable keys="label" \| "code"` (author decides, never guessed) | Component QA content cases; audit `overlap`, `wrapped-label` (incl. table label column) |
| 2 | **Spacing decided per element** | Text almost touching a table; uneven gaps; doubled margins | 246 hand-placed margins; blocks spacing themselves | Rhythm tokens by role (`group`, `flow`, `stack`, `inset`); `.flow` and `Page` own spacing | Audit `cramped`, `rhythm`; `recanica check` `structure` |
| 3 | **Width decided per element** | Subtitles stop short of tables beside them | Per-paragraph `max-w` cap | `.reading` column / `Page width` | Audit `two-right-edges` |
| 4 | **Data shape rendered as layout** | Three uneven columns per principle | Rendering the data model, not the reader's questions | `recanica-page` brief (reader questions → structure) | Audit `uneven-columns`; brief review |
| 5 | **Main content styled as secondary** | Rules in muted grey, weak headings | Docs default "paragraphs are muted" applied to primary content | Emphasis by role (rules template, skill checklist) | Skill step 4 checklist (not yet automated) |
| 6 | **Page structure rebuilt per page** | 2 page headers, hand-styled headings in 76 files | No shared structure parts | `Page`, `PageHeader`, `Section`, `Heading`, `WebSection*`, `WebHeroTitle` in `@recanica/ui` | `recanica check` `structure` |
| 7 | **Dead or placeholder links** | `href="#"`, links to pages that don't exist | Placeholders left in sections and patterns | Real targets everywhere | Link crawl; audit `dead-link` |
| 8 | **Component patched at the call site** | `w-40 truncate` inside a `w-8` column | Fixing the symptom on one page | Rule: fix the part | Review of diffs; failure entries like this one |
| 10 | **Optional slot filled by default (AI slop)** | An eyebrow above every heading, tile and docs page, often restating the headline | Shared parts offer an `eyebrow` slot; generated content fills every slot it's offered | Removed 27 → 2 (kept only where it adds information); rules: eyebrow only when it adds a date, status or location, max twice per page | Audit `eyebrows`, `redundant-eyebrow` |
| 11 | **Library exists but isn't consumed** | Docs used 12/63 components; 38 hand-made cards, 22 raw buttons, 20 padding/background combinations | Raw markup is quicker to write than looking a part up; missing parts (bordered box, hairline grid, selectable row, option card) were improvised; pages copied neighbours | Added `Surface`, `SurfaceGrid`, `NavItem`, `ChoiceCard`, `Button size="inline"` (+ rc-* CSS twins); converted every instance | `recanica check` `hand-built` (must in new projects via `recanica init`), CI workflow installed by init |
| 12 | **Whole things copied instead of shared** | App shell in 3 copies; home hero a copy of Hero01; 5 hand-written section headers; 63 repeated class strings | Copy-paste of a working block is faster than extracting a part; shape-specific checks don't see copies | `AppShell`/`AppPanel`/`AppSidebar*`, `CenteredPage`, `SplitLayout`, `TopBar`, `ListRow`, `IconBadge`; sections take props (Hero01); parts registry `packages/ui/parts.json` | `recanica check` `repeated-classes` (any string repeated 3×); `lint:parts` (every part in React and CSS) |
| 13 | **Two names for one thing** | Added `rc-app-shell` while `rc-shell` existed | Adding without looking up | One registry of parts with both names | `lint:parts` |
| 9 | **Tests reused a stale server** | Unstyled pages in test results, 500s | Playwright reused a server serving an older build | `reuseExistingServer` only on request | Config |

Not yet automated: emphasis inversion (#5). Candidate rule: primary content (the largest text block of a section) rendered in a muted colour.
