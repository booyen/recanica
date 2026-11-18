import { brandGuide, componentIndex, patternIndex, tokensCss } from "@/lib/llm";

export const dynamic = "force-static";

export function GET() {
  const body = `${brandGuide()}
## Components (@rekanica/ui)
${componentIndex()}

## Patterns and blocks (install with: pnpm dlx shadcn@latest add <url>)
${patternIndex()}

## Token file (packages/tokens/theme.css — Tailwind v4)
\`\`\`css
${tokensCss()}
\`\`\`
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
