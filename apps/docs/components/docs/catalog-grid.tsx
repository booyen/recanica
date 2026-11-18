import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { groupBy, type CatalogItem } from "@/lib/docs";

export function CatalogGrid({ items, base }: { items: CatalogItem[]; base: string }) {
  return (
    <div className="space-y-10">
      {groupBy(items).map(([category, list]) => (
        <section key={category} className="space-y-3">
          <h2 id={category.toLowerCase().replace(/\s+/g, "-")} className="scroll-mt-20 text-sm text-muted-foreground">{category}</h2>
          <div className="grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 xl:grid-cols-3">
            {list.map((i) => (
              <Link key={i.slug} href={`${base}/${i.slug}`} className="group flex flex-col gap-1 bg-panel p-5 transition-colors hover:bg-accent">
                <span className="flex items-center justify-between">
                  {i.title}
                  <ArrowRightIcon className="size-3.5 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                </span>
                <span className="text-sm text-muted-foreground">{i.description}</span>
              </Link>
            ))}
            {list.length % 3 !== 0 && <span className="hidden bg-panel xl:block" style={{ gridColumn: `span ${3 - (list.length % 3)}` }} />}
            {list.length % 2 !== 0 && <span className="hidden bg-panel sm:block xl:hidden" />}
          </div>
        </section>
      ))}
    </div>
  );
}
