import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPageHeader, H2, InlineCode, P } from "@/components/docs/page-header";
import { Pager } from "@/components/docs/pager";
import { components } from "@/lib/docs";
import { readSource, uiImports } from "@/lib/highlight";
import { pageContext } from "@/lib/llm";
import { CopyPromptButton } from "@/components/docs/prompt-library";

export const dynamicParams = false;
export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = components.find((c) => c.slug === slug);
  return { title: item?.title, description: item?.description };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = components.find((c) => c.slug === slug);
  if (!item) notFound();
  const src = await readSource(`examples/${slug}-demo.tsx`);
  const file = slug === "sonner" ? "sonner" : slug;

  return (
    <>
      <DocsPageHeader eyebrow={`Components · ${item.category}`} title={item.title} description={item.description}>
        <CopyPromptButton text={pageContext("component", item.title, item.description, src)} label="Copy for LLM" size="sm" variant="outline" />
      </DocsPageHeader>
      <H2 id="preview">Preview</H2>
      <ComponentPreview slug={slug} />
      <H2 id="installation">Installation</H2>
      <P>Ships with the <InlineCode>@rekanica/ui</InlineCode> package. In an app inside the monorepo:</P>
      <div className="mt-4"><CodeBlock lang="bash" code={`pnpm add @rekanica/ui@workspace:*`} /></div>
      <H2 id="usage">Usage</H2>
      <CodeBlock code={uiImports(src) || `import * from "@rekanica/ui/components/${file}";`} />
      <P>
        Source: <InlineCode>packages/ui/src/components/{file}.tsx</InlineCode>. Styles come from semantic tokens only, so it
        follows light/dark and the brand finish automatically.
      </P>
      <Pager href={`/docs/components/${slug}`} />
    </>
  );
}
