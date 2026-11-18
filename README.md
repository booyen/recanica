# Rekanica

**A comprehensive UI framework by Aturanica Labs.** Monochrome, calm, dark-first, and usable from any stack or AI tool.

| Package | What |
|---|---|
| [`@rekanica/tokens`](packages/tokens) | W3C design tokens → CSS, Tailwind v3/v4, JS/TS, Flutter, SwiftUI, Compose, Figma |
| [`@rekanica/ui`](packages/ui) | 60 React components (Radix + Tailwind v4) |
| [`@rekanica/css`](packages/css) | Framework-free `rk-*` classes for plain HTML / PHP / Python / Ruby |
| [`@rekanica/mcp`](packages/mcp) | MCP server: rules, tokens, components, patterns for AI tools |
| [`rekanica`](packages/cli) | `npx rekanica init`: detects your stack and sets everything up |

Also: [docs site + 18 patterns + 16 blocks + clickable demo](apps/docs), [starter templates](templates), [guides](docs/guides).

## Quick start

```bash
npx rekanica init                              # any project
claude mcp add rekanica -- npx -y @rekanica/mcp   # AI tools
```

## Develop

```bash
pnpm install
pnpm dev            # docs at http://localhost:3100
pnpm build && pnpm typecheck
pnpm test           # CLI fixtures + MCP smoke
pnpm test:layout    # layout audit on every page (mobile + desktop)
pnpm test:visual    # screenshot regression
pnpm tokens         # rebuild generated tokens after editing packages/tokens/tokens/*.json
```

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
