import Link from "next/link";
import { web as webMap } from "@/__registry__";
import { groupBy, web } from "@/lib/docs";

export const metadata = { title: "All sections" };

// Every section in the web library, rendered live and grouped by category.
export default function SectionsPage() {
  const groups = groupBy(web);
  return (
    <div className="pb-section">
      <div className="mx-auto max-w-content px-gutter py-section-sm">
        <h1 className="text-display-sm tracking-tight">All web sections</h1>
        <p className="mt-3 max-w-copy text-muted-foreground">{web.length} sections in {groups.length} categories, rendered live. Each one links to its docs page with code and install command.</p>
        <nav className="mt-8 flex flex-wrap gap-2" aria-label="Categories">
          {groups.map(([cat]) => <a key={cat} href={`#${cat.toLowerCase().replace(/\W+/g, "-")}`} className="rounded-full border px-3 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">{cat}</a>)}
        </nav>
      </div>
      {groups.map(([cat, items]) => (
        <section key={cat} id={cat.toLowerCase().replace(/\W+/g, "-")} className="scroll-mt-20 border-t">
          {items.map((i) => {
            const C = webMap[i.slug];
            return (
              <div key={i.slug} className="border-b last:border-b-0">
                <div className="mx-auto flex max-w-content flex-wrap items-baseline gap-x-3 px-gutter pt-6 text-sm">
                  <span className="text-muted-foreground">{cat}</span>
                  <span>{i.title}</span>
                  <Link href={`/docs/web/${i.slug}`} className="ml-auto font-mono text-xs text-muted-foreground hover:text-foreground">{i.slug} →</Link>
                </div>
                <div className="relative isolate overflow-hidden [&_header.sticky]:static">{C && <C />}</div>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
