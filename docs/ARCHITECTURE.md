# Recanica: Architecture & Approach

Recanica is the UI framework by Aturanica Labs.

Visual reference: **Polar** (dashboard). Architecture: **shadcn/ui** (own-your-source
components, registry distribution) and **Payload** (one `@scope/ui` package shared
across admin and marketing).

## Visual language

The rules live in one place: [`docs/ai/rules.template.md`](ai/rules.template.md). The docs AI page, `/llms.txt`, the MCP
server and the CLI's `AGENTS.md` are all generated from it, and `recanica check` enforces the mechanical parts
(see [GOVERNANCE.md](GOVERNANCE.md)). In short: monochrome, flat brand colour, depth from layers not shadows,
light type, pill controls, labels that never wrap.

## Layers

```
 ┌──────────────────────────────────────────────────────────────┐
 │ 5. Templates   full pages/apps (marketing site, dashboard)   │  starter repos
 │ 4. Blocks      hero, pricing, dashboard-shell, auth, …       │  shadcn registry (copy-in)
 │ 3. Patterns    data-table, list-detail, settings, auth, …    │  shadcn registry (copy-in)
 │ 2. Components  button, card, dialog, tabs, input, …          │  @recanica/ui
 │ 1. Tokens      color, type, radius, shadow, motion           │  @recanica/tokens
 └──────────────────────────────────────────────────────────────┘
```

**Rule:** each layer may only use the layers below it. Blocks never hard-code
colors; components never reference primitive tokens (`--rc-gray-500`), only
semantic ones (`--muted-foreground`).

## Why hybrid distribution

| Layer | Distributed as | Why |
|---|---|---|
| Tokens, Components | Workspace/npm package `@recanica/*` | Must stay identical everywhere; a fix ships to all apps at once. |
| Patterns, Blocks | shadcn registry (`/r/*.json`) | Composed UI gets customized per app; copying source avoids prop explosion. |
| Templates | Starter repos / `create-*` | Whole-app scaffolds. |

## Repo layout

```
packages/tokens     theme.css: primitives → semantic (light/dark) → Tailwind @theme
packages/ui         Radix-based components, cva variants, cn()
apps/docs                    Next.js docs library + registry host (public/r)
  lib/catalog.json           single source of truth: components, patterns, blocks
  scripts/gen-registry.mjs   generates __registry__/index.tsx + registry.json (runs on dev/build)
  examples/<slug>-demo.tsx   one live demo per component
  registry/patterns/*.tsx    app UI patterns (installable)
  registry/blocks/*.tsx      marketing + app-shell blocks (installable)
  app/(docs)/docs/…          docs pages: foundations, components/[slug], patterns/[slug], blocks/[slug]
  app/view/[kind]/[slug]     bare render used by the responsive iframe viewer
```

## Spacing & layout

4px base grid (Tailwind default). Semantic layout tokens keep every surface on one rhythm:

| Token | Value | Utility |
|---|---|---|
| gutter | clamp(16px, 3vw, 40px) | `px-gutter` |
| section / section-sm | clamp(64–128px) / clamp(48–80px) | `py-section` |
| panel | 28px | `p-panel` |
| stack | 40px | `gap-stack`, `space-y-stack` |
| sidebar | 240px | `w-sidebar` |
| containers | 1152 / 768 / 640px | `max-w-content / narrow / copy` |

Product type scale: `text-title` (30), `text-heading` (24), `text-metric` (40, light).
Landing scale: `text-display-sm/md/lg` (36/48/64).

## Tokens: three tiers

1. **Primitives** `--rc-gray-*`, `--rc-silver-*`: raw scales.
2. **Semantic** `--background`, `--surface`, `--brand`, `--sidebar`, …: swapped under `.dark`.
3. **Tailwind bridge** `@theme inline`: so you can write `bg-surface text-muted-foreground`.

Re-brand = change tier 1. New theme (e.g. a client white-label) = a new class remapping tier 2.

Landing pages get an extra **display type scale** (`text-display-sm/md/lg`);
dashboards get **sidebar tokens**. Same system, two densities.

## LLM-friendly by design

- `apps/docs/lib/llm.ts` builds every AI artifact from the live `theme.css` and `catalog.json`
  (including OKLCH → hex conversion), so prompts never drift from the real tokens.
- `/docs/ai`: five copy-paste prompts (apply, brand-only, build a screen, audit, rules file).
- `/llms.txt`, `/llms-full.txt`, `/recanica.css`: static, machine-readable.
- "Copy for LLM" on each component/pattern/block page: reference code + core rules.

## Clickable demo

`apps/docs/app/demo/*`: a full seller app on dummy data. State is a reducer in
`lib/demo/store.tsx`, seeded from `lib/demo/seed.ts` and persisted to localStorage
(synced across tabs). Flows: sign in → product → checkout link → customer checkout →
order/customer/revenue update; invoices draft → send → customer pays; refunds;
cancel subscription; connect payouts → withdraw; settings with save bar; reset.

It is laid out like a template you'd buy: a **UI kit** (`/demo/app/ui`) renders every component by category, `/demo/app/forms`
shows every form state, input, layout and a wizard, and `/demo/app/ui/patterns` previews every pattern and block.
`tests/coverage.spec.ts` fails if a catalog item is missing from the demos. The sidebar hides with ⌘B.

## Malaysia localization (demo invoicing)

The demo is localized for Malaysia: MYR (RM), SST (service 8% / sales 10% / 5%), supplier and buyer
identifiers (SSM BRN, LHDN TIN, SST no., MSIC, MyKad), simulated LHDN MyInvois submission → validation
with UUID + QR, amount in words ("Ringgit Malaysia … Only"), FPX / DuitNow QR / JomPAY payment options,
and payment plans (deposit + instalments, each payable separately, partial status). Helpers live in
`apps/docs/lib/demo/my.ts`.

## Conventions

- Components are shadcn-shaped: function components, `data-slot`, `className` passthrough, `cva` variants.
- You can still run `pnpm dlx shadcn add <component>` inside `packages/ui`, then restyle it to Recanica tokens.
- Every component, pattern and block is listed in `lib/catalog.json` and has a docs page.
  Adding one = add the file + a catalog entry; `pnpm gen` warns about missing files.
- Mobile-first: write the phone layout first; sidebars become Sheets below `md`.
- Accessibility comes from Radix; don't re-implement focus/keyboard logic.

## Open decisions (to discuss)

1. **Publishing**: publish `@recanica/*` to npm (release workflow is ready; needs `NPM_TOKEN`) or keep in-monorepo.
2. **Docs hosting**: domain for the docs + registry (`registry.json` homepage is a placeholder).
3. **Repo name**: GitHub repo is still `rekanica-des`; rename to match Recanica?
4. **Motion**: adopt a motion library for marketing, or stay CSS-only?

## Roadmap

- **Done**: tokens for 7 platforms, 60 components, 19 patterns, 3 blocks, 49 web sections, 20 page recipes,
  sample website, dashboard demo with UI kit and forms, MCP server, CLI (`init`, `add`, `check`),
  layout audit / coverage / link / visual / copy / design checks in CI.
- **Next**: TanStack data table, per-component props tables, multiple examples per component, a11y audit (axe) in CI.
