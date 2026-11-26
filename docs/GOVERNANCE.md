# Keeping Recanica on-brand

Two separate jobs:

1. **Inside this repo**: nothing ships that breaks the design language or the layout.
2. **In projects that use Recanica**: those projects can't quietly drift away from it, whether a person or an AI wrote the code.

Both use the same rules (`docs/ai/rules.template.md`) and the same checks. The rules are written once and turned into checks. Nothing depends on someone remembering them.

## 1. Inside this repo: the quality gate

Every pull request runs these in CI (`.github/workflows/ci.yml`). Each one catches a different kind of mistake.

| Check | Command | Catches |
|---|---|---|
| Tokens in sync | `pnpm tokens:check` | Generated CSS/Flutter/Swift/Compose tokens out of date with the JSON source |
| Design lint | `pnpm lint:design` | Hard-coded colours, Tailwind palette hues, bold weights, gradients, arbitrary radii (`recanica check`) |
| Copy lint | `pnpm lint:copy` | AI jargon, clichés, assistant voice, placeholder text (see `docs/COPY_AUDIT.md`) |
| Types and build | `pnpm typecheck && pnpm build` | Broken APIs, missing imports, pages that don't build |
| Package tests | `pnpm test` | CLI `init` and `check` on fixture projects for every stack; MCP server smoke test |
| Layout audit | `pnpm test:layout` | Every page at 375px, 900px and 1280px: page overflow, text overflow, clipped text, **wrapped button, tab, badge and table-header labels**, stretched rows, runtime errors |
| Demo coverage | `pnpm test:audit` | A component, pattern, block or web section in the catalog that no demo shows |
| Recanica spec + consistency | `pnpm test:audit` | Rendered colours not in the token palette, weight above medium, non-pill buttons or off-scale heights, radius off the scale, the same component rendered differently on one page, AI jargon in visible text |
| Component QA | `pnpm test:qa` | Every component at 240px, 400px and full width (`/qa/<slug>`): spills, overlap, wrapped labels, runtime errors, plus a screenshot per component |
| UX audit | `pnpm test:audit` | Unnamed controls, tap targets under 24px (WCAG 2.5.8), unlabelled fields, duplicate ids |
| Link check | `pnpm test:audit` | Links that 404, and dead `#` links |
| Visual regression | `pnpm test:visual` | Unintended visual changes (screenshot diff) |

The layout audit is generated from `lib/catalog.json`, so a new component or page gets checked without anyone adding it to the test.

### What a reviewer still looks at

Automated checks catch rule breaks. They don't judge taste. Each PR description answers the checklist in `.github/pull_request_template.md`:

- **Narrow container:** did you view the change inside a narrow container (e.g. a 360px card), not just a narrow window?
- **Less is more:** is there one primary action per view, and is anything there that could be removed?
- **Copy:** are the words specific (numbers, real nouns), with no filler?
- **Docs:** if you added something, is it in the catalog, the docs, and a demo?

## 2. In other projects: protecting the language

A project picks up Recanica with `npx recanica init`, then runs the kickoff questionnaire. That sets up these layers of protection.

**1. The rules travel with the code**

`init` writes the rules into `AGENTS.md`, and `CLAUDE.md` points to it. Every AI coding tool reads that file before writing UI. The rules include the **mockup-first workflow**:
1. Ask what the page is for.
2. Mock it up from existing patterns.
3. Review with the user: keep / change / remove.
4. Build.
5. Check.

The MCP server (`@recanica/mcp`) serves the same rules live, along with tokens, component source and page recipes.

**2. Tokens instead of values**

Colours, radii, spacing and type come from `@recanica/tokens`. A project that uses `bg-card` and `text-muted-foreground` is updated automatically when Recanica changes. A project that types `#1a1a1a` is not, and `recanica check` flags it.

**3. `npx recanica check` and `npx recanica audit`**

`check` reads source code. `audit` loads the running site in a browser at 375/900/1280px and applies the same layout, spec, consistency, copy and accessibility rules this repo uses (`npx recanica audit http://localhost:3000 --crawl`). Run both in CI.


The guard. Run it in CI or a pre-commit hook:

```bash
npx recanica check src            # exit 1 on errors
npx recanica check src --all      # include warnings (arbitrary radius/spacing, uppercase labels, vague copy)
npx recanica check --json         # for tooling
```

| Rule | Level | Example it flags |
|---|---|---|
| `hard-coded-color` | error | `#1a1a1a`, `rgb(0 0 0)`, `oklch(0.2 0 0)` |
| `arbitrary-color` | error | `bg-[#111]` |
| `palette-hue` | error | `bg-blue-500`, `text-emerald-600` |
| `bold-weight` | error | `font-semibold`, `font-weight: 700`, `FontWeight.bold` |
| `gradient` | error | `bg-gradient-to-r`, `linear-gradient(…)` |
| `copy` | error / warn | "seamless", "cutting-edge", "lorem ipsum" / "unlock", "robust" |
| `arbitrary-radius` | warn | `rounded-[7px]` |
| `arbitrary-spacing` | warn | `p-[13px]` |
| `uppercase-label` | warn | `uppercase tracking-wider` |
| `design-slop` | warn | glass cards, glows, decorative blur blobs, gradient/clipped text, emoji icons, the sparkle icon, looping decorative motion, heavy shadows on surfaces |
| `kickoff` | warn | a project with `recanica.config.json` but no kickoff recorded |
| `D-###` / `T-###` | warn / error | a pattern guard from the project's decision log (decisions report, traps fail) |

**4. `npx recanica slop`: the AI-slop checker**

Copy tells (jargon, hype, assistant voice, placeholder data) and design defaults (glass, glow, blur blobs, emoji icons,
sparkles, decorative motion) in one report with a score per file. `--text "…"` (or stdin, or MCP `check_copy`) checks a
single piece of copy, so an agent can check its own words before writing them. It finds generic phrasing; it can't judge
whether copy is specific to the reader.

**5. The kickoff questionnaire and the project's settings**

`npx recanica kickoff` asks a person the start-of-project questions (agents: `--questions`, then `--answers file.json`) and
writes the answers into `recanica.config.json`:

```json
{
  "project": { "role": "guest", "flexibility": "guided", "stack": "unknown", "surfaces": ["app", "email"] },
  "scope": { "owns": ["src/components/**", "src/styles/**"] },
  "zones": [{ "files": "src/campaigns/**", "flexibility": "open", "reason": "Art-directed per launch" }]
}
```

| Setting | What it changes |
|---|---|
| `flexibility: locked` | Every style rule and `design-slop` become must. Deviations need a decision-log entry. |
| `flexibility: guided` (default) | `hand-built` and `structure` are must; the rest are should, allowable with a reason. |
| `flexibility: open` | Reuse and style rules are reported, not enforced. Composition is free. |
| always fixed | `hard-coded-color`, `arbitrary-color`, `palette-hue`, `self-reference`: tokens hold in every mode. |
| `zones` | The same presets for one area (a campaign folder looser than the app). |
| `scope.owns` (guest) | Findings inside these paths block the build; outside them they're advisory and listed for `docs/ui/PROPOSALS.md`. |
| `rules` | Per-rule level; beats everything above. |

**6. The decision log: `docs/ui/DECISIONS.md`**

`D-` entries are UI/UX decisions; `T-` entries are traps (mistakes already caught). Each has a guard: `rule:<id>`,
`pattern:/regex/ in <glob>`, `test:<path>` or `review`. Pattern guards run inside `recanica check`, so a trap fails the build
if it comes back. `recanica decisions lint` (CI) rejects entries without a reason or alternatives, vague reasons ("better
UX"), unknown rules, missing tests, traps guarded only by review, broken supersede chains and slop in the entries themselves.
`recanica decisions brief` prints what's in force for the start of a task; `recanica decisions new` appends an entry.

**Exceptions are explicit and reviewable**

- **On one line:** add a comment containing `recanica-ignore: <reason>`. Use it for things like `<meta name="theme-color">`, which must be a literal.
- **For a whole area:** list paths in `recanica.config.json`:

  ```json
  { "ignore": ["emails/**"], "rules": { "arbitrary-radius": "off" } }
  ```

Email HTML is the usual case, because email clients don't support CSS variables. This repo's own `recanica.config.json` shows that exception.

### Each project keeps its own values

Recanica fixes the *language*: calm, light type, quiet surfaces, plain copy. A project adds its *content and identity* on top:

- **Brand colour:** override `--brand` / `--brand-foreground` in the project's CSS. This is the one colour that is meant to change.
- **Font:** swap `--font-sans` if the brand has its own typeface.
- **Copy and locale:** the copy rules apply to every project. Malaysian defaults (RM, SST, DD/MM/YYYY) can be swapped.
- **Rule toggles:** `recanica.config.json` can turn a rule off for that project. Because the change is in a committed file, it shows up in code review.

## Adding something to Recanica

See [CONTRIBUTING.md](../CONTRIBUTING.md). In short: one entry in `apps/docs/lib/catalog.json` feeds the docs, registry,
MCP server, `/llms.txt`, the layout audit and the coverage test, so a new item that has no demo fails CI.
