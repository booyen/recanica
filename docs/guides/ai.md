# Using Rekanica with AI tools

Rekanica is built to be read by LLMs. Four ways in, from most to least integrated:

## 1. MCP server (recommended)

Gives Claude Code, Claude Desktop, Cursor, Windsurf and others live access to rules, tokens, component source and patterns.

```bash
# Claude Code
claude mcp add rekanica -- npx -y @rekanica/mcp
```

```json
// Cursor / Claude Desktop / others: mcpServers
{ "rekanica": { "command": "npx", "args": ["-y", "@rekanica/mcp"] } }
```

Tools: `get_rules`, `get_tokens(format)`, `list_components`, `get_component(name)`, `list_patterns(kind, category)`, `get_pattern(name)`,
`get_recipe(page)`, `get_page_library`, `search(query)`, `get_setup(stack)`. Prompt: `apply-rekanica`.

Typical requests that work well once the server is connected:
- "Build our pricing page with Rekanica." → the agent calls `get_recipe`, then `get_pattern` for each section.
- "Add a team & roles page to the dashboard." → `get_page_library`, then the matching demo/pattern source.

## 2. Rules file in the project

`npx rekanica init` writes `AGENTS.md` (read by Codex, Cursor, Claude Code via CLAUDE.md import, and others) containing the
Rekanica rules. Every AI session in that repo then follows them.

## 3. Copy-paste prompts

The docs page `/docs/ai` has prompts for: apply Rekanica to a project · brand & style only (any stack) · build a screen ·
audit UI · rules file. Each embeds the full rules and token values.

## 4. llms.txt

`/llms.txt` (index) and `/llms-full.txt` (everything in one file) on the docs site, for tools that fetch them.
