import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { PageHeader } from "@/components/demo/ui";
import catalog from "@/lib/catalog.json";

export const metadata = { title: "Patterns & blocks" };

type Item = { slug: string; title: string; description: string; category: string; height?: number };

function Gallery({ items, kind }: { items: Item[]; kind: "patterns" | "blocks" }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {items.map((p) => (
        <section key={p.slug} id={p.slug} data-kit-item={p.slug} className="scroll-mt-6 overflow-hidden rounded-2xl border bg-card">
          <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b px-5 py-3.5">
            <div className="min-w-0">
              <h3 className="text-sm">{p.title} <span className="text-muted-foreground">· {p.category}</span></h3>
              <p className="text-sm text-muted-foreground">{p.description}</p>
            </div>
            <Link href={`/docs/${kind}/${p.slug}`} className="-my-1 inline-flex shrink-0 items-center gap-1 py-1 text-sm whitespace-nowrap text-muted-foreground hover:text-foreground">
              Code <ArrowUpRightIcon className="size-3.5" />
            </Link>
          </header>
          {/* Rendered at desktop width and scaled down, like a template's thumbnail. */}
          <div className="relative h-72 overflow-hidden bg-background">
            <iframe
              src={`/view/${kind}/${p.slug}`}
              title={p.title}
              loading="lazy"
              tabIndex={-1}
              className="pointer-events-none absolute top-0 left-0 h-[200%] w-[200%] origin-top-left scale-50 border-0"
            />
            <Link href={`/view/${kind}/${p.slug}`} target="_blank" className="absolute inset-0" aria-label={`Open ${p.title} full size`} />
          </div>
        </section>
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <>
      <PageHeader
        title="Patterns & blocks"
        description="App-level building blocks. Click a preview to open it full size and resize it; Code opens the source."
        back={{ href: "/demo/app/ui", label: "UI kit" }}
      />
      <h2 className="mb-4">Patterns</h2>
      <Gallery items={catalog.patterns} kind="patterns" />
      <h2 className="mt-10 mb-4">Blocks</h2>
      <Gallery items={catalog.blocks} kind="blocks" />
    </>
  );
}
