<!-- Source of the Recanica design rules used by the docs (/docs/ai, llms.txt), the MCP server and the CLI.
     {{COLOR_TABLE}} is replaced with the semantic color table generated from packages/tokens. -->
# Recanica — design rules
Recanica is the UI framework by Aturanica Labs. Visual reference: Polar's dashboard (calm, dark-first product UI).

## Identity: calm is mandatory, colour is a project choice
- **Calm (every project):**
  - a neutral base (background, panels, text in grays)
  - hierarchy from value (foreground vs muted), size and spacing, not from colour
  - colour is used sparingly and always means something
- **Colour budget:**
  - neutrals
  - ONE brand colour (`--brand` / `--brand-foreground`), used for the primary action, focus and at most one highlight per screen
  - status colours (success, warning, destructive) only to communicate state, usually as a 10–15% tint
  - no extra hues, no rainbow charts, no gradients
- **Recanica's own theme is monochrome:** brand = black in light mode, silver in dark. A project sets its own brand colour by overriding `--brand` and `--brand-foreground`, and keeps everything else.
- **Dark mode:** it is the default. Light mode is fully supported via the same semantic tokens.
- **One brand moment per screen:** primary CTA, logo mark, or one hero number. Never all three.

## Color tokens (semantic; hex for light / dark)
| Token | Light | Dark |
|---|---|---|
{{COLOR_TABLE}}

Rules: components only use semantic tokens (bg-panel, text-muted-foreground, bg-brand, border…). Never hard-code hex in components. A project changes colour by overriding tokens (usually just --brand), never by adding hues in components.

## Surfaces & depth
Depth comes from stacked surfaces and 1px hairline borders, not shadows:
background (page + sidebar) → panel (inset rounded-2xl content area, 8px from the viewport edge) → card → accent (hover / active / selected).
Shadows only on floating layers: popovers, menus, dialogs, toasts.

## Typography
- **Font:** the project's choice. Set `--font-sans` (UI) and `--font-mono` (code, IDs). Recanica's default is Geist Sans / Geist Mono, with system-ui as the fallback.
- **What the font needs:**
  - a calm, readable sans with light (300) and regular (400) weights
  - tabular numerals for aligned figures
  - good legibility at 12–14px
  - one family for the UI; a display face only for marketing headlines, if at all
- Weights: 300 light (big numbers), 400 regular (almost everything), 500 medium (buttons only). NEVER semibold or bold.
- Product scale: metric 40px light (stat values) · title 30px (page title) · heading 24px (section) · base 16 · sm 14 (default UI text) · xs 12 (meta).
- Landing scale: display-lg 64 · display-md 48 · display-sm 36, letter-spacing −0.02 to −0.035em, step down on mobile.
- Sentence case everywhere. tabular-nums for any aligned numbers.

## Spacing & layout
- **Page structure comes from shared parts, never hand-built:**
  - apps: `Page`, `PageHeader`, `Section`, `Heading`, `Stack`, `ReferenceTable`
  - sites: `WebSection`, `WebSectionTitle`, `WebHeroTitle`

  They carry the rhythm tokens by role: `group` 12 · `flow` 20 · `stack` 40 · `section` (page bands) · `inset` (inside surfaces). A page composes them and never sets its own heading styles or block margins.
- **Single source for layout decisions:** containers own spacing and width; blocks don't.
  - Stack blocks in a `.flow` column. It applies `--spacing-flow` between blocks and `--spacing-stack` before headings.
  - Or use `gap-*` / `space-y-*` on the parent.
  - Never put margins on individual blocks to space them.
  - Reading pages put the whole column in `.reading`, so text, tables and cards share one right edge.
  - Text emphasis follows role: main content in foreground, supporting text muted.
- 4px grid. Inside components use 4–24px; between groups 32–48px.
- Layout tokens: gutter clamp(16px, 3vw, 40px) · section clamp(64px, 10vw, 128px) · panel padding 28px · stack gap 40px · sidebar 240px · containers 1152 / 768 / 640px.
- Mobile-first. Breakpoints sm 640 · md 768 · lg 1024 · xl 1280. Sidebars become a slide-over sheet below md. Tab lists scroll horizontally instead of wrapping. Tables hide secondary columns before they scroll. Primary actions are full width on phones.

## Shape
- Base radius 12px. Buttons, icon buttons, tabs/segmented controls, badges, avatars: fully rounded pills.
- Inputs and menu items 10–16px. Cards, panels, dialogs, stat groups 20px (rounded-2xl). CTA/hero frames 24px.

## Components & patterns
- **Reuse, never rebuild:**
  - every element comes from a shared part, used as it is (props and variants, no class overrides)
  - if a part doesn't fit, change the part
  - writing the same thing twice means a part is missing
  - hand-built buttons, inputs, selects, tables, cards and headings fail `recanica check`
- **Two forms of the same parts:**
  - React projects use the components.
  - Other stacks use `@recanica/css` classes, named prefixed-BEM: `rc-block`, `rc-block__element`, `rc-block--modifier` (e.g. `rc-section__title`, `rc-btn--brand`), plus layout helpers `rc-flow` and `rc-reading`.
  - Name a part after what it is, never where it's used.
  - A repeated class string means a part is missing: add it, in both forms.
- Built on Radix primitives + Tailwind CSS v4 + class-variance-authority, shadcn/ui-style API (function components, data-slot, className passthrough).
- Buttons: variants default (inverted), brand (bg-brand text-brand-foreground), secondary, outline, ghost, link, destructive. Pill shape. Height 36px default, 44px large.
- Stat panels (signature dashboard pattern): several stats share ONE bordered rounded-2xl container split by hairline dividers. Each stat: small label + "View all →" link, a 40px light number with a muted caption ("$48 November"), then rows: either thin 2px progress bars (BarRow) or list rows with muted secondary text ("Order paid · Nadia" … "2h ago").
- App shell: page-colored sidebar (logo mark, nav with muted items and a softly filled active item, nested sub-nav with a left rule, promo card, account switcher at the bottom) next to an inset rounded panel holding the page.
- Empty states: icon in a soft circle, title, one-line muted description, one pill action.
- Icons: lucide, 16px default, 14px inline meta, 20px feature tiles, stroke 2, currentColor.
- Motion: 150ms hovers, 200ms menus, 300ms sheets/dialogs, easing cubic-bezier(0.22, 1, 0.36, 1). Respect prefers-reduced-motion.

## Voice & copy
- Plain, specific, short. Say what happens, with numbers where you have them: "Most invoices are paid within 3 days", not "Get paid faster".
- Write for the actual reader (a shop owner in Penang, a finance admin), not "teams of all sizes".
- Banned: seamless, unlock, elevate, leverage, empower, effortless, cutting-edge, game-changer, supercharge, streamline, robust, delve, "in today's … world", "whether you're X or Y", "not just X, it's Y", "in minutes, not months", "built for the way you…", "on autopilot". <!-- copy-lint-ignore: the banned list itself -->
- **Eyebrows** (small labels above a heading): only when they add information the heading doesn't, such as a date, a status or where you are on a long page. At most once or twice per page; never on every section or tile. Never restate the headline.
- No placeholder copy in shipped sections. No invented statistics or testimonials in production; sample data must be marked as sample.
- Buttons are verbs that say what happens: "Send invoice", "Pay RM 9,720", not "Submit" or "Continue".
- Errors say what went wrong and what to do next. Empty states say what will appear and give one action.
- Locale is the project's: format money, dates and numbers with the project's locale (Intl.NumberFormat / DateTimeFormat), and use names and places your users recognise. Recanica's demos use Malaysian defaults (RM, DD/MM/YYYY, SST, FPX/DuitNow) as an example, not a rule.

## Workflow: mockup first
For any new project, new page or major redesign, do not start in production code.
1. **Ask** what the page is for, who uses it, and the one action that matters most. Ask about brand and must-have content.
2. **Mockup**: assemble a quick throwaway version from existing Recanica patterns, sections and recipes (MCP `get_recipe`, `get_page_library`, `list_patterns`), with realistic sample data. A single route or HTML file is enough.
3. **Review it with the user**: list what you included, what you left out, and two or three open questions. Mark each section keep / change / remove.
4. **Build** only what was kept, in the real codebase, using the same patterns.
5. **Check** before calling it done: `npx recanica check` (no off-brand colours, weights, gradients, copy), then view it at 375px, ~900px and 1280px and inside a narrow container.
Skip the mockup only for small edits to an existing, already-approved screen.

## Existing projects: rework, not reskin
Swapping colours is not adopting Recanica. Recanica is also how pages are built: fewer, calmer, one thing at a time.
1. **Review**: `npx recanica review <dev-url> --crawl` measures what makes each page busy and writes `recanica-review.md`. Each busy signal comes with the Recanica fix, plus the closest Recanica pattern for each page.
2. **Decide per page with the user**: what the page is for, the one action that matters, and keep / change / remove for each element. Removing and merging is expected, not a failure.
3. **Rebuild** each page from its pattern (Page Header → content → one primary action), using Recanica components. Don't restyle the old markup.
4. **Verify**: `npx recanica review` shows no busy signals on reworked pages; `npx recanica check` and `npx recanica audit` pass.

What makes a good page (scored 0–100 by `recanica review`, target 85+, nothing under 70):
- **Clarity:** a visible title, and on task pages the main action on the first screen.
- **Hierarchy:** one focal element, with the title at least 1.4× the body size.
- **Calm:** the busy signals below.
- **Consistency:** Recanica tokens and shapes, so the same component renders the same.
- **Readability:** AA contrast, lines of 90 characters at most, nothing under 12px.
- **Layout:** few alignment edges, the 4px spacing grid, no overlap.
- **Usability:** verb labels, the current page marked, errors under their fields, visible focus.
- **Responsiveness:** works at 375px.

Then watch 3–5 real users do the main task.

Busy signals and their fixes:
- More than one primary button on a screen: one primary; others outline/ghost or a ••• menu.
- More than ~18 actions on the first screen: show the 3–5 most used, the rest in menus.
- More than 6 text sizes (7 with a hero): title, body, small, metric.
- Cards inside cards inside cards: one bordered surface per group; inner groups use spacing and headings.
- A border around every item: one container with hairline dividers.
- More than 8 badges: badges only for changing status.
- Tables over 6 columns: hide secondary columns, or use List / detail.
- Forms over 10 fields without sections: titled sections, or steps.
- Nav runs over 15 items: group them, or use a More menu.
- Text under 12px, or a page without a title: never.

## Layout: how to decide (in this order)
1. **Purpose:** what the page is for, who uses it, the one main action, and what they must see first. Agree it in the mockup.
2. **Page type → pattern:** match the page to the page library (overview, list, detail, form, settings, marketing recipe) and start from that pattern. Don't invent a layout.
3. **Order by importance and sequence:**
   1. title and main action
   2. key information (numbers, status)
   3. the working area (table, form, editor)
   4. details and secondary content
   5. rare and destructive actions last
4. **Group by meaning:** related things share one surface; unrelated groups are separated by space, not more borders.
5. **Show by frequency:** daily actions visible; occasional ones in a menu; details behind a click (progressive disclosure).
6. **Size from content, not the screen.** Decide width per column, not per element: on a reading page the whole column gets a reading width, so text, tables and cards share one right edge.
   - forms: one column, ≤ 640px
   - reading text: ~65ch
   - tables: full content width
   - multi-column grids: only for comparable items
   - detail: a side panel or its own page
7. **Decide how each block adapts:** stack, wrap, scroll, More menu or sheet. Check at 240/400px containers and 375/900/1280px screens.
8. **Verify:** review the mockup with the user, then `recanica review`.

## Page composition
- Websites: start from a recipe (MCP `get_recipe`, or the Web Library recipes) and swap sections rather than inventing layouts.
- Dashboards: check the page library (MCP `get_page_library`) for the page type before designing one.

## Responsive behaviour (any width, any container)
- Components respond to their container, not just the viewport: use container queries (`@container`, `@md:`) for cards, stats, headers and toolbars that can sit in narrow columns.
- Buttons, badges, tabs, nav items and table headers never wrap: `whitespace-nowrap`. When space runs out, change the form instead: actions wrap as a group onto a new row, nav items move into a "More" menu or a sheet, tables scroll inside their own frame.
- Nothing overflows the page. Long text truncates (`truncate`, with the full text in a title/tooltip) or wraps as prose; it never pushes layout wider.
- No fixed-width label columns (`w-8`, `w-24`): size label columns to their content with a cap (`fit-content(40%)`) and truncate, so a long label never runs into the next element.
- Labels and values sit side by side when there is room and stack cleanly (label above value) when there is not, never squeezed into one word per line.
- Navigation: side nav (hideable, ⌘B) for dashboards with many sections; top nav with priority+ "More" overflow for few flat sections; a sheet below 768px. See the Navigation foundation.

## Showcases, galleries and demos
- Each section, block or template page gets its own page, rendered in an isolated frame (its own route or iframe) with mobile / tablet / desktop widths and previous / next. The index is a grid of thumbnails.
- Never stack unrelated full-width sections in one long scroll: their spacing, widths and fixed or sticky parts collide.
- Don't group when groups would hold one item; use a flat grid with the category as a caption.
- Every demo page can reach every other page (a floating page menu) and has a visible way back to the docs.
- No `href="#"`: link to a real page, or leave the link out.

## Forms & validation
- Invalid fields are highlighted: destructive border, faint destructive tint and ring. Set `data-invalid` on the Field (controls pick it up) or `aria-invalid` on the control.
- Messages are small tinted notices under the field, by intent: error (destructive tint), warning, success, info (muted). One short sentence saying what to fix.
- On submit, move focus to the first invalid field and show a summary notice at the top for long forms. Never only disable the submit button.

## Do
- Use value contrast (foreground vs muted-foreground) for hierarchy.
- Keep one primary action per view; everything else outline/ghost.
- Pair a light big number with a small muted caption.
- Group related metrics in one bordered container with dividers.

## Don't
- No bold, no ALL CAPS labels, no colored backgrounds, no gradients.
- No wrapped button or nav labels, no horizontal page scroll, no text squeezed into narrow columns.
- No drop shadows on cards or panels.
- No new accent hues, no emoji as UI.
