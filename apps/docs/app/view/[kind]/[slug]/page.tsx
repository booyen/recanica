import { notFound } from "next/navigation";
import { blocks as blockMap, patterns as patternMap, web as webMap } from "@/__registry__";
import { blocks, patterns, web } from "@/lib/docs";

export const dynamicParams = false;
export function generateStaticParams() {
  return [
    ...patterns.map((p) => ({ kind: "patterns", slug: p.slug })),
    ...blocks.map((b) => ({ kind: "blocks", slug: b.slug })),
    ...web.map((w) => ({ kind: "web", slug: w.slug })),
  ];
}

export default async function ViewPage({ params }: { params: Promise<{ kind: string; slug: string }> }) {
  const { kind, slug } = await params;
  const Comp = kind === "patterns" ? patternMap[slug] : kind === "blocks" ? blockMap[slug] : kind === "web" ? webMap[slug] : undefined;
  if (!Comp) notFound();
  // Patterns sit on the panel surface like they would inside an app; blocks own their full page.
  return kind === "patterns" ? (
    <div className="min-h-svh bg-panel"><Comp /></div>
  ) : (
    <Comp />
  );
}
