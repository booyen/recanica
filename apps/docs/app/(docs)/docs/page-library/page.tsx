import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { DocsPageHeader, H2, P } from "@/components/docs/page-header";
import { Pager } from "@/components/docs/pager";
import catalog from "@/lib/catalog.json";
import { slugify } from "@/lib/kit";
import { Surface } from "@recanica/ui/components/surface";

export const metadata = { title: "Page Library", description: "Common dashboard, portal and website page types, and what in Recanica implements each." };

const slug = slugify;

export default function Page() {
  return (
    <>
      <DocsPageHeader
        title="Page Library"
        description={`${catalog.appLibrary.length} dashboard and portal page types, and ${catalog.webRecipes.length} website page recipes. Start every new screen here instead of designing from scratch.`}
      />
      <H2 id="dashboard">Dashboard & portal pages</H2>
      <P>Each page type links to a working demo page and the patterns or components it&apos;s built from.</P>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {catalog.appLibrary.map((c) => (
          <Surface as="section" tone="panel" className="scroll-mt-20" key={c.category} id={slug(c.category)}>
            <h3>{c.category}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
            <ul className="mt-4 space-y-1.5">
              {c.items.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="group flex items-center gap-2 py-1 text-sm hover:underline">
                    <span className="w-20 shrink-0 text-sm text-muted-foreground">{i.kind}</span>
                    <span className="min-w-0 truncate">{i.label}</span>
                    {i.kind === "demo" && <ArrowUpRightIcon className="size-3.5 shrink-0 text-muted-foreground" />}
                  </Link>
                </li>
              ))}
            </ul>
          </Surface>
        ))}
      </div>
      <H2 id="website">Website page recipes</H2>
      <P>Section order for common website pages. Every section is in the Web Library; the sample website uses these recipes.</P>
      <ol className="mt-6 divide-y rounded-2xl border bg-panel">
        {catalog.webRecipes.map((r) => (
          <li key={r.page} className="space-y-2 p-5">
            <h3>{r.page}</h3>
            <div className="flex flex-wrap gap-1.5">
              {r.sections.map((s, i) => (
                <Link key={s + i} href={`/docs/web/${s}`} className="rounded-full border px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">{i + 1}. {s}</Link>
              ))}
            </div>
            {r.notes && <p className="text-sm text-muted-foreground">{r.notes}</p>}
          </li>
        ))}
      </ol>
      <Pager href="/docs/page-library" />
    </>
  );
}
