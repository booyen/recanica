import { notFound } from "next/navigation";
import { BlockViewer } from "@/components/docs/block-viewer";
import { CodeBlock } from "@/components/docs/code-block";
import { DocsPageHeader, H2, P } from "@/components/docs/page-header";
import { Pager } from "@/components/docs/pager";
import { web } from "@/lib/docs";
import { highlight, readSource } from "@/lib/highlight";
import { pageContext } from "@/lib/llm";
import { CopyPromptButton } from "@/components/docs/prompt-library";

export const dynamicParams = false;
export function generateStaticParams() {
  return web.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = web.find((c) => c.slug === slug);
  return { title: item?.title, description: item?.description };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = web.find((c) => c.slug === slug);
  if (!item) notFound();
  const raw = await readSource(`registry/web/${slug}.tsx`);
  const html = await highlight(raw);
  const used = [...new Set([...raw.matchAll(/@recanica\/ui\/components\/([a-z-]+)/g)].map((m) => m[1]))];

  return (
    <>
      <DocsPageHeader title={item.title} description={item.description}>
        <CopyPromptButton text={pageContext("block", item.title, item.description, raw)} label="Copy for LLM" size="sm" variant="outline" />
      </DocsPageHeader>
      <H2 id="preview">Preview</H2>
      <BlockViewer src={`/view/web/${slug}`} height={item.height} html={html} raw={raw} title={item.title} />
      {item.use && (
        <>
          <H2 id="when-to-use">When to use</H2>
          <P>{item.use}</P>
        </>
      )}
      <H2 id="installation">Installation</H2>
      <P>Install from the Recanica registry. The file is copied into your app so you can edit it freely.</P>
      <div className="mt-4"><CodeBlock lang="bash" code={`pnpm dlx shadcn@latest add https://recanica.aturanica.com/r/${slug}.json`} /></div>
      <H2 id="components">Components used</H2>
      <div className="flex flex-wrap gap-2">
        {used.map((u) => (
          <a key={u} href={`/docs/components/${u}`} className="rounded-full border px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">{u}</a>
        ))}
      </div>
      <Pager href={`/docs/web/${slug}`} />
    </>
  );
}
