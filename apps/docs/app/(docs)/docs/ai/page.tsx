import Link from "next/link";
import { DocsPageHeader, H2, InlineCode, P } from "@/components/docs/page-header";
import { CopyButton } from "@/components/docs/copy-button";
import { TokenTable } from "@/components/docs/frame";
import { Pager } from "@/components/docs/pager";
import { CopyPromptButton, PromptLibrary } from "@/components/docs/prompt-library";
import { SITE, brandGuide, colorTable, prompts } from "@/lib/llm";
import { SurfaceGrid } from "@recanica/ui/components/surface";

export const metadata = { title: "Use with AI", description: "Copy-paste prompts that teach any LLM the Recanica brand, style and tokens." };

const steps = [
  ["Open your project", "In Claude Code, Cursor, Codex, ChatGPT or any coding assistant, at the project root."],
  ["Copy a prompt", "“Apply Recanica to this project” for a full restyle, or a smaller one below."],
  ["Paste and run", "The prompt contains the full rules and tokens, so the LLM needs nothing else."],
];

export default function Page() {
  const list = prompts();
  const files = [
    ["/llms.txt", "Index of every page, in llmstxt.org format."],
    ["/llms-full.txt", "Rules, tokens with hex values, and the full component/pattern index in one file."],
    ["/recanica.css", "The raw token stylesheet (Tailwind v4)."],
  ];

  return (
    <>
      <DocsPageHeader
        title="Use with AI"
        description="Recanica is written to be read by LLMs. Copy a prompt, paste it into your AI tool inside any project, and it will apply the Recanica brand, style and colors."
      >
        <div className="flex flex-wrap gap-2 pt-2">
          <CopyPromptButton text={list[0].body} label="Copy “Apply Recanica” prompt" size="lg" />
          <CopyPromptButton text={brandGuide()} label="Copy rules only" size="lg" variant="outline" />
        </div>
      </DocsPageHeader>

      <H2 id="how">How it works</H2>
      <SurfaceGrid as="ol" className="sm:grid-cols-3">
        {steps.map(([t, b], i) => (
          <li key={t} className="bg-panel p-panel">
            <span className="font-mono text-xs text-muted-foreground">{i + 1}</span>
            <p className="mt-2">{t}</p>
            <p className="mt-1 text-sm text-muted-foreground">{b}</p>
          </li>
        ))}
      </SurfaceGrid>

      <H2 id="prompts">Prompts</H2>
      <P>Each prompt embeds the complete Recanica rules and token values, generated from the live token file, so it never goes out of date.</P>
      <div className="mt-6"><PromptLibrary prompts={list} /></div>

      <H2 id="per-page">Per-component context</H2>
      <P>
        Every component, pattern and block page has a <InlineCode>Copy for LLM</InlineCode> button. It copies that item's reference code plus the
        core rules, ideal for “build me this, but for my data”.
      </P>

      <H2 id="mcp">MCP server</H2>
      <P>
        For live access instead of a pasted prompt, connect your tool to the Recanica MCP server. Setup and the tool list are in
        the <Link href="/docs/mcp" className="text-foreground underline underline-offset-4">MCP guide</Link>.
      </P>

      <H2 id="files">Machine-readable files</H2>
      <P>Point an agent at these URLs instead of pasting. Many tools fetch <InlineCode>llms.txt</InlineCode> automatically.</P>
      <div className="mt-6 divide-y overflow-hidden rounded-2xl border">
        {files.map(([path, desc]) => (
          <div key={path} className="flex items-center gap-3 bg-panel px-5 py-3">
            <a href={path} target="_blank" rel="noreferrer" className="-my-1 inline-block py-1 font-mono text-sm hover:underline">{path}</a>
            <span className="hidden flex-1 text-sm text-muted-foreground sm:block">{desc}</span>
            <CopyButton value={`${SITE}${path}`} className="ml-auto" />
          </div>
        ))}
      </div>

      <H2 id="colors">Color tokens (hex)</H2>
      <P>The same values the prompts use, for design tools and non-CSS stacks.</P>
      <div className="mt-6">
        <TokenTable keys="code"
          head={["Token", "Light", "Dark"]}
          rows={colorTable().map((c) => [
            `--${c.token}`,
            <span key="l" className="flex items-center gap-2"><span data-audit-ignore className="size-4 rounded border" style={{ background: c.light }} /><span className="font-mono text-xs">{c.light}</span></span>,
            <span key="d" className="flex items-center gap-2"><span data-audit-ignore className="size-4 rounded border" style={{ background: c.dark }} /><span className="font-mono text-xs">{c.dark}</span></span>,
          ])}
        />
      </div>
      <Pager href="/docs/ai" />
    </>
  );
}
