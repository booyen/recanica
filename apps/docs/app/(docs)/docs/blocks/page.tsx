import { CatalogGrid } from "@/components/docs/catalog-grid";
import { DocsPageHeader } from "@/components/docs/page-header";
import { Pager } from "@/components/docs/pager";
import { blocks } from "@/lib/docs";

export const metadata = { title: "Blocks" };

export default function Page() {
  return (
    <>
      <DocsPageHeader eyebrow="Library" title="Blocks" description="Application blocks: app shells and invoicing. Website sections live in the Web Library." />
      <CatalogGrid items={blocks} base="/docs/blocks" />
      <Pager href="/docs/blocks" />
    </>
  );
}
