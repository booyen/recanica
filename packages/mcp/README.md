# @rekanica/mcp

MCP server that gives AI coding tools live access to Rekanica (UI framework by Aturanica Labs).

```bash
claude mcp add rekanica -- npx -y @rekanica/mcp
```

```json
{ "mcpServers": { "rekanica": { "command": "npx", "args": ["-y", "@rekanica/mcp"] } } }
```

| Tool | Returns |
|---|---|
| `get_rules` | Full brand + UI rules with hex color table |
| `get_tokens(format)` | json · css · tailwind-v4 · tailwind-v3 · flutter · swiftui · compose · figma · plain-css |
| `list_components(category?)` / `get_component(name)` | 60 React components: description, import, example, source |
| `list_patterns(kind?)` / `get_pattern(name)` | 18 patterns + 16 blocks with full source and install command |
| `search(query)` | Keyword search across everything |
| `get_setup(stack)` | nextjs · vite-react · tailwind-v3 · html · flutter · swiftui · compose · figma · ai |

Prompt: `apply-rekanica` restyles the current project.

Data is a snapshot built from the monorepo (`pnpm --filter @rekanica/mcp build`); no network access needed.
