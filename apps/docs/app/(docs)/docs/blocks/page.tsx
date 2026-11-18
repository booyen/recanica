import { CatalogGrid } from "@/components/docs/catalog-grid";
import { DocsPageHeader } from "@/components/docs/page-header";
import { Pager } from "@/components/docs/pager";
import { blocks } from "@/lib/docs";

export const metadata = { title: "Blocks" };

export default function Page() {
  return (
    <>
      <DocsPageHeader eyebrow="Library" title="Blocks" description="Landing-page and app-shell sections. Mobile-first, token-driven, installable from the registry." />
      <CatalogGrid items={blocks} base="/docs/blocks" />
      <Pager href="/docs/blocks" />
    </>
  );
}
