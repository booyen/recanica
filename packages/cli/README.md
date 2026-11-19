# recanica

Add Recanica (UI framework by Aturanica Labs) to any project.

```bash
npx recanica init
```

Detects Next.js, Vite/React, Tailwind v3, plain HTML, Flutter, SwiftUI and Jetpack Compose. Installs or copies the right
outputs, wires your global CSS, and writes `AGENTS.md` (+ `CLAUDE.md` importing it) so AI tools follow Recanica.

```bash
npx recanica init --stack flutter --yes   # skip detection / confirmation
npx recanica init --dry-run               # show what would change
npx recanica add data-table               # copy a pattern or block into your app
npx recanica tokens swiftui --out Theme/RecanicaTokens.swift
npx recanica rules                        # design rules for any LLM
npx recanica mcp                          # MCP setup for AI tools
```

## Guard the design language

```bash
npx recanica check src          # exit 1 on hard-coded colours, palette hues, bold weights, gradients, AI-jargon copy
npx recanica check src --all    # also warnings: arbitrary radius/spacing, uppercase labels, vague copy
npx recanica check --json
```

Add it to CI or a pre-commit hook. Allow a deliberate exception with a `recanica-ignore: <reason>` comment on the line,
or list paths in `recanica.config.json`:

```json
{ "ignore": ["emails/**"], "rules": { "arbitrary-radius": "off" } }
```

## Audit the rendered site

```bash
npm i -D playwright && npx playwright install chromium
npx recanica audit http://localhost:3000 --crawl              # every reachable page at 375/900/1280px
npx recanica audit https://staging.example --paths /,/pricing --json
```

Same rules as Recanica's own CI:
- **Layout:** overflow, overlap, wrapped labels, table edges, surface padding.
- **Recanica spec:** token colours only, no bold, pill buttons, radius scale, same component = same look.
- **Copy:** AI jargon and placeholder text in rendered copy.
- **Accessibility:** names, labels, 24px targets, dead links.
