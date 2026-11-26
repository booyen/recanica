import { CodeBlock } from "@/components/docs/code-block";
import { DocsPageHeader, H2, InlineCode, P } from "@/components/docs/page-header";
import { Pager } from "@/components/docs/pager";
import { ReferenceTable } from "@recanica/ui/components/page";

export const metadata = { title: "MCP guide", description: "Connect an AI coding tool to Recanica's rules, tokens, components and patterns through MCP." };

// Source of truth for the tool list: packages/mcp/src/index.js (and packages/mcp/README.md).
const tools = [
  ["get_rules", "The full brand and UI rules, with the hex colour table. Read before writing any UI."],
  ["get_tokens", "Tokens as json, css, tailwind-v4, tailwind-v3, flutter, swiftui, compose, figma or plain-css."],
  ["list_components", "Every @recanica/ui component with category, description and import path."],
  ["get_component", "Source and a usage example for one component."],
  ["list_patterns", "App patterns, app blocks and the web library, with when-to-use notes."],
  ["get_pattern", "Full source of a pattern or block, plus its install command."],
  ["get_page_anatomy", "For a page type: its shell, regions in reading order and the part for each."],
  ["get_recipe", "Section order for common website pages: landing, shop, product, careers and more."],
  ["get_page_library", "Dashboard and customer-portal page types and what implements each."],
  ["get_setup", "Install steps per stack: nextjs, vite-react, tailwind-v3, html, flutter, swiftui, compose, figma, ai."],
  ["get_kickoff_questions", "The questions to ask at the start of a new project, with defaults."],
  ["check_copy", "Checks UI copy against the copy rules: jargon, hype, assistant voice, placeholders."],
  ["search", "Keyword search across components, patterns, blocks and guides."],
];


export default function Page() {
  return (
    <>
      <DocsPageHeader
        title="MCP guide"
        description="The Recanica MCP server gives your AI coding tool the design rules, tokens, component source and patterns, so it builds with the system instead of guessing."
      />

      <H2 id="clone">Set it up from a clone</H2>
      <P>The server runs from the monorepo. Clone it, install, then point your tool at the server file.</P>
      <CodeBlock lang="bash" code={`git clone https://github.com/booyen/recanica.git
cd recanica && pnpm install`} />
      <P>In Claude Code, from your project:</P>
      <CodeBlock lang="bash" code={`claude mcp add recanica -- node /path/to/recanica/packages/mcp/src/index.js`} />
      <P>In any tool that reads an <InlineCode>mcpServers</InlineCode> config (Cursor, Claude Desktop, Windsurf):</P>
      <CodeBlock lang="json" code={`{
  "mcpServers": {
    "recanica": {
      "command": "node",
      "args": ["/path/to/recanica/packages/mcp/src/index.js"]
    }
  }
}`} />

      <H2 id="npm">From npm</H2>
      <P>Once <InlineCode>@recanica/mcp</InlineCode> is published, the clone is not needed:</P>
      <CodeBlock lang="bash" code={`claude mcp add recanica -- npx -y @recanica/mcp`} />

      <H2 id="tools">Tools</H2>
      <P>The data is a snapshot built from the monorepo, so the server needs no network access. Rebuild it after changing the system with <InlineCode>pnpm --filter @recanica/mcp build</InlineCode>.</P>
      <ReferenceTable keys="code" head={["Tool", "Returns"]} rows={tools} />

      <H2 id="prompts">Prompts</H2>
      <P>
        <InlineCode>apply-recanica</InlineCode> adopts Recanica in an existing project: it reviews the pages, agrees a rework plan with you and
        rebuilds them from patterns. <InlineCode>recanica-page</InlineCode> writes a page brief before building, checks the rendered page, or
        explains why an existing page is laid out as it is.
      </P>

      <Pager href="/docs/mcp" />
    </>
  );
}
