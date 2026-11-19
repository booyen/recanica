import { CatalogGrid } from "@/components/docs/catalog-grid";
import { DocsPageHeader } from "@/components/docs/page-header";
import { Pager } from "@/components/docs/pager";
import { web } from "@/lib/docs";

export const metadata = { title: "Web Library" };

export default function Page() {
  return (
    <>
      <DocsPageHeader eyebrow="Library" title="Web Library" description={`${web.length} website sections across ${new Set(web.map((w) => w.category)).size} categories: headers, heroes, blog, shop, property, careers, events and utility pages. Mobile-first, token-driven, installable from the registry.`} />
      <CatalogGrid items={web} base="/docs/web" />
      <Pager href="/docs/web" />
    </>
  );
}
