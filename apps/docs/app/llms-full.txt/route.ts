import { appLibraryIndex, brandGuide, componentIndex, patternIndex, recipesIndex, tokensCss } from "@/lib/llm";

export const dynamic = "force-static";

export function GET() {
  const body = `${brandGuide()}
## Components (@recanica/ui)
${componentIndex()}

## Patterns, blocks and web sections (install with: pnpm dlx shadcn@latest add <url>)
${patternIndex()}

## Website page recipes (section order)
${recipesIndex()}

## Dashboard / portal page types
${appLibraryIndex()}

## Token file (packages/tokens/theme.css — Tailwind v4)
\`\`\`css
${tokensCss()}
\`\`\`
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
