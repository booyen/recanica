# Recanica

**A comprehensive UI framework by Aturanica Labs.** Calm by rule, monochrome by default (bring your own brand colour), dark-first, and usable from any stack or AI tool.

| Package | What |
|---|---|
| [`@recanica/tokens`](packages/tokens) | W3C design tokens → CSS, Tailwind v3/v4, JS/TS, Flutter, SwiftUI, Compose, Figma |
| [`@recanica/ui`](packages/ui) | 60 React components (Radix + Tailwind v4) |
| [`@recanica/css`](packages/css) | Framework-free `rc-*` classes for plain HTML / PHP / Python / Ruby |
| [`@recanica/mcp`](packages/mcp) | MCP server: rules, tokens, components, patterns for AI tools |
| [`recanica`](packages/cli) | `npx recanica init`: detects your stack and sets everything up |

Also:
- the [docs site](apps/docs), with 60 components, 19 app patterns, a **web library of 49 sections** and 20 page recipes
- a **sample website** (`/site`)
- a **clickable dashboard demo** (`/demo`), set up like a template you'd buy: 23 page types, a UI kit with every component live, a forms showcase and a patterns gallery
- a customer portal
- [starter templates](templates) and [guides](docs/guides)
- [governance](docs/GOVERNANCE.md), which covers how the design language is checked and protected in other projects
- the [copy audit](docs/COPY_AUDIT.md)

## Quick start

```bash
npx recanica init                              # any project
npx recanica check src                         # guard the design language (CI / pre-commit)
claude mcp add recanica -- npx -y @recanica/mcp   # AI tools
```

## Develop

```bash
pnpm install
pnpm dev            # docs at http://localhost:3100
pnpm build && pnpm typecheck
pnpm test           # CLI fixtures + MCP smoke
pnpm test:layout    # layout audit on every page (375 / 900 / 1280px)
pnpm test:visual    # screenshot regression
pnpm lint:copy      # AI-jargon / placeholder copy check
pnpm lint:design    # recanica check on our own code
pnpm tokens         # rebuild generated tokens after editing packages/tokens/tokens/*.json
```

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
