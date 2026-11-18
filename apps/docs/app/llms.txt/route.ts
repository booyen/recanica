import { blocks, components, foundations, patterns } from "@/lib/docs";
import { SITE } from "@/lib/llm";

export const dynamic = "force-static";

// llmstxt.org format: a short, link-rich index for LLMs.
export function GET() {
  const body = `# Rekanica

> Rekanica is the UI framework by Aturanica Labs: monochrome, Polar-inspired design tokens, ${components.length} React components (Radix + Tailwind v4), ${patterns.length} app patterns and ${blocks.length} blocks. Dark-first, light type, pill controls, depth from layered surfaces and hairline borders.

Use ${SITE}/llms-full.txt for the complete rules, tokens (with hex values) and component index in one file.

## Getting started
- [Introduction](${SITE}/docs)
- [Installation](${SITE}/docs/installation)
- [Theming](${SITE}/docs/theming)
- [Use with AI](${SITE}/docs/ai): copy-paste prompts to apply Rekanica to any project
- [Token CSS](${SITE}/rekanica.css): raw theme file

## Foundations
${foundations.map((f) => `- [${f.title}](${SITE}/docs/foundations/${f.slug}): ${f.description}`).join("\n")}

## Components
${components.map((c) => `- [${c.title}](${SITE}/docs/components/${c.slug}): ${c.description}`).join("\n")}

## Patterns
${patterns.map((p) => `- [${p.title}](${SITE}/docs/patterns/${p.slug}): ${p.description}`).join("\n")}

## Blocks
${blocks.map((b) => `- [${b.title}](${SITE}/docs/blocks/${b.slug}): ${b.description}`).join("\n")}
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
