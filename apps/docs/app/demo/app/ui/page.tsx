import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { PageHeader } from "@/components/demo/ui";
import { kitSlug } from "@/lib/kit";
import catalog from "@/lib/catalog.json";

export const metadata = { title: "UI kit" };

const categories = [...new Set(catalog.components.map((c) => c.category))];

export default function Page() {
  const sections = [
    { title: "Forms", href: "/demo/app/forms", count: "6 layouts", body: "Working forms: validation states, layouts, every input type, a multi-step wizard." },
    { title: "Patterns & blocks", href: "/demo/app/ui/patterns", count: `${catalog.patterns.length + catalog.blocks.length} items`, body: "App-level pieces: sidebars, top nav, data tables, settings, onboarding, invoices." },
    { title: "Web sections", href: "/site/sections", count: `${catalog.web.length} sections`, body: "Navbars, heroes, pricing, FAQ, footers and more, for websites." },
    { title: "Sample website", href: "/site", count: "22 pages", body: "A full marketing site built only from the web library." },
  ];
  return (
    <>
      <PageHeader
        title="UI kit"
        description={`Everything this template ships with: ${catalog.components.length} components, ${catalog.patterns.length} patterns, ${catalog.web.length} web sections. All live, all in the docs.`}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className="group rounded-2xl border bg-card p-5 transition-colors hover:bg-accent/40">
            <div className="flex items-baseline justify-between gap-3">
              <h2>{s.title}</h2>
              <span className="text-sm whitespace-nowrap text-muted-foreground">{s.count}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm">Open <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" /></span>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 mb-4">Components by category</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const items = catalog.components.filter((c) => c.category === cat);
          return (
            <section key={cat} className="rounded-2xl border bg-card p-5">
              <Link href={`/demo/app/ui/${kitSlug(cat)}`} className="flex items-baseline justify-between gap-3 hover:underline">
                <h3>{cat}</h3>
                <span className="text-sm text-muted-foreground">{items.length}</span>
              </Link>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {items.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/demo/app/ui/${kitSlug(cat)}#${c.slug}`} className="inline-block rounded-full border px-2.5 py-0.5 text-[13px] whitespace-nowrap text-muted-foreground hover:text-foreground">
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
