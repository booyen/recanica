# rekanica

Add Rekanica (UI framework by Aturanica Labs) to any project.

```bash
npx rekanica init
```

Detects Next.js, Vite/React, Tailwind v3, plain HTML, Flutter, SwiftUI and Jetpack Compose. Installs or copies the right
outputs, wires your global CSS, and writes `AGENTS.md` (+ `CLAUDE.md` importing it) so AI tools follow Rekanica.

```bash
npx rekanica init --stack flutter --yes   # skip detection / confirmation
npx rekanica init --dry-run               # show what would change
npx rekanica add data-table               # copy a pattern or block into your app
npx rekanica tokens swiftui --out Theme/RekanicaTokens.swift
npx rekanica rules                        # design rules for any LLM
npx rekanica mcp                          # MCP setup for AI tools
```
