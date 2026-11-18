<!-- Source of the Rekanica design rules used by the docs (/docs/ai, llms.txt), the MCP server and the CLI.
     {{COLOR_TABLE}} is replaced with the semantic color table generated from packages/tokens. -->
# Rekanica — design rules
Rekanica is the UI framework by Aturanica Labs. Visual reference: Polar's dashboard (calm, dark-first product UI).

## Identity
- Monochrome: black, white and gray only. Hierarchy comes from value (foreground vs muted), never from hue.
- Status colors (success, warning, destructive) are muted and used ONLY to communicate state, usually as a 12–15% tint inside a badge.
- Dark mode is the default. Light mode is fully supported via the same semantic tokens.
- Brand finish is a switch on <html data-finish="flat|mesh|chrome">. Flat (default) = solid black in light / silver in dark. Mesh = soft silver mesh gradient. Chrome = linear brushed chrome. Brand surfaces use the utilities bg-metallic, text-metallic, border-metallic so the switch applies everywhere.
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
- Buttons: variants default (inverted), brand (bg-metallic), secondary, outline, ghost, link, destructive. Pill shape. Height 36px default, 44px large.
- Stat panels (signature dashboard pattern): several stats share ONE bordered rounded-2xl container split by hairline dividers. Each stat: small label + "View all →" link, a 40px light number with a muted caption ("$48 November"), then rows: either thin 2px progress bars (BarRow) or list rows with muted secondary text ("Order paid · Nadia" … "2h ago").
- App shell: page-colored sidebar (logo mark, nav with muted items and a softly filled active item, nested sub-nav with a left rule, promo card, account switcher at the bottom) next to an inset rounded panel holding the page.
- Empty states: icon in a soft circle, title, one-line muted description, one pill action.
- Icons: lucide, 16px default, 14px inline meta, 20px feature tiles, stroke 2, currentColor.
- Motion: 150ms hovers, 200ms menus, 300ms sheets/dialogs, easing cubic-bezier(0.22, 1, 0.36, 1). Respect prefers-reduced-motion.

## Do
- Use value contrast (foreground vs muted-foreground) for hierarchy.
- Keep one primary action per view; everything else outline/ghost.
- Pair a light big number with a small muted caption.
- Group related metrics in one bordered container with dividers.

## Don't
- No bold, no ALL CAPS labels, no colored backgrounds, no gradients outside bg/text/border-metallic.
- No drop shadows on cards or panels.
- No new accent hues, no emoji as UI.
