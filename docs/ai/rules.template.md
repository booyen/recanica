<!-- Source of the Recanica design rules used by the docs (/docs/ai, llms.txt), the MCP server and the CLI.
     {{COLOR_TABLE}} is replaced with the semantic color table generated from packages/tokens. -->
# Recanica — design rules
Recanica is the UI framework by Aturanica Labs. Visual reference: Polar's dashboard (calm, dark-first product UI).

## Identity
- Monochrome: black, white and gray only. Hierarchy comes from value (foreground vs muted), never from hue.
- Status colors (success, warning, destructive) are muted and used ONLY to communicate state, usually as a 12–15% tint inside a badge.
- Dark mode is the default. Light mode is fully supported via the same semantic tokens.
- Brand color is flat: solid black in light mode, silver in dark (bg-brand / text-brand). No gradients anywhere.
- One brand moment per screen (primary CTA, logo mark, or one hero number). Never all three.

## Color tokens (semantic; hex for light / dark)
| Token | Light | Dark |
|---|---|---|
{{COLOR_TABLE}}

Rules: components only use semantic tokens (bg-panel, text-muted-foreground, border…). Never hard-code hex in components; never introduce new hues.

## Surfaces & depth
Depth comes from stacked surfaces and 1px hairline borders, not shadows:
background (page + sidebar) → panel (inset rounded-2xl content area, 8px from the viewport edge) → card → accent (hover / active / selected).
Shadows only on floating layers: popovers, menus, dialogs, toasts.

## Typography
- Font: Geist Sans (UI) and Geist Mono (code, IDs). Fallback: system-ui.
- Weights: 300 light (big numbers), 400 regular (almost everything), 500 medium (buttons only). NEVER semibold or bold.
- Product scale: metric 40px light (stat values) · title 30px (page title) · heading 24px (section) · base 16 · sm 14 (default UI text) · xs 12 (meta).
- Landing scale: display-lg 64 · display-md 48 · display-sm 36, letter-spacing −0.02 to −0.035em, step down on mobile.
- Sentence case everywhere. tabular-nums for any aligned numbers.

## Spacing & layout
- 4px grid. Inside components use 4–24px; between groups 32–48px.
- Layout tokens: gutter clamp(16px, 3vw, 40px) · section clamp(64px, 10vw, 128px) · panel padding 28px · stack gap 40px · sidebar 240px · containers 1152 / 768 / 640px.
- Mobile-first. Breakpoints sm 640 · md 768 · lg 1024 · xl 1280. Sidebars become a slide-over sheet below md. Tab lists scroll horizontally instead of wrapping. Tables hide secondary columns before they scroll. Primary actions are full width on phones.

## Shape
- Base radius 12px. Buttons, icon buttons, tabs/segmented controls, badges, avatars: fully rounded pills.
- Inputs and menu items 10–16px. Cards, panels, dialogs, stat groups 20px (rounded-2xl). CTA/hero frames 24px.

## Components & patterns
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
- No placeholder copy in shipped sections. No invented statistics or testimonials in production; sample data must be marked as sample.
- Buttons are verbs that say what happens: "Send invoice", "Pay RM 9,720", not "Submit" or "Continue".
- Errors say what went wrong and what to do next. Empty states say what will appear and give one action.
- Malaysian context: RM amounts, DD/MM/YYYY dates, SST, FPX/DuitNow; Malay names and places spelled correctly.

## Workflow: mockup first
For any new project, new page or major redesign, do not start in production code.
1. **Ask** what the page is for, who uses it, and the one action that matters most. Ask about brand and must-have content.
2. **Mockup**: assemble a quick throwaway version from existing Recanica patterns, sections and recipes (MCP `get_recipe`, `get_page_library`, `list_patterns`), with realistic sample data. A single route or HTML file is enough.
3. **Review it with the user**: list what you included, what you left out, and two or three open questions. Mark each section keep / change / remove.
4. **Build** only what was kept, in the real codebase, using the same patterns.
5. **Check** before calling it done: `npx recanica check` (no off-brand colours, weights, gradients, copy), then view it at 375px, ~900px and 1280px and inside a narrow container.
Skip the mockup only for small edits to an existing, already-approved screen.

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
