"use client";

import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { examples } from "@/__registry__";
import catalog from "@/lib/catalog.json";

export { kitSlug } from "@/lib/kit";

/** Every component in one catalog category, rendered live, the way a purchased UI kit shows its elements. */
export function KitCategory({ category }: { category: string }) {
  const items = catalog.components.filter((c) => c.category === category);
  return (
    <div className="grid gap-4 @container">
      {items.map((c) => {
        const Example = examples[c.slug];
        return (
          <section key={c.slug} id={c.slug} className="scroll-mt-6 overflow-hidden rounded-2xl border bg-card" data-kit-item={c.slug}>
            <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b px-5 py-3.5">
              <div className="min-w-0">
                <h2 className="text-sm">{c.title}</h2>
                <p className="text-sm text-muted-foreground">{c.description}</p>
              </div>
              <Link href={`/docs/components/${c.slug}`} className="-my-1 inline-flex shrink-0 items-center gap-1 py-1 text-sm whitespace-nowrap text-muted-foreground hover:text-foreground">
                Docs <ArrowUpRightIcon className="size-3.5" />
              </Link>
            </header>
            <div className="flex min-h-40 items-center justify-center overflow-x-auto p-6">
              {Example ? <Example /> : <p className="text-sm text-muted-foreground">No example yet.</p>}
            </div>
          </section>
        );
      })}
    </div>
  );
}
