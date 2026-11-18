# Rekanica guides

Rekanica is the UI framework by Aturanica Labs. Pick your stack:

| Stack | Guide | What you get |
|---|---|---|
| Next.js + Tailwind v4 | [setup-nextjs.md](setup-nextjs.md) | Tokens, 60 React components, patterns & blocks |
| Vite / React + Tailwind v4 | [setup-vite-react.md](setup-vite-react.md) | Same as above |
| Tailwind v3 (any framework) | [setup-tailwind-v3.md](setup-tailwind-v3.md) | Tokens via preset; build your own components |
| Plain HTML / WordPress / Laravel / Django / Rails | [setup-html.md](setup-html.md) | `@rekanica/css` with `rk-*` classes |
| Flutter | [setup-flutter.md](setup-flutter.md) | `rekanicaTheme()` + color/space/type constants |
| SwiftUI (iOS) | [setup-swiftui.md](setup-swiftui.md) | `Rekanica.Colors`, radius, spacing, type |
| Jetpack Compose (Android) | [setup-compose.md](setup-compose.md) | `rekanicaColorScheme()` + constants |
| Figma | [setup-figma.md](setup-figma.md) | Variables via Tokens Studio |
| AI tools (Claude Code, Cursor, …) | [ai.md](ai.md) | MCP server, rules file, prompts, llms.txt |

Fastest path for any web project:

```bash
npx rekanica init
```

The CLI detects your stack, installs the right package, wires the CSS and writes an `AGENTS.md` so AI tools follow Rekanica.
