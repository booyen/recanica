import { CatalogGrid } from "@/components/docs/catalog-grid";
import { DocsPageHeader } from "@/components/docs/page-header";
import { Pager } from "@/components/docs/pager";
import { patterns } from "@/lib/docs";

export const metadata = { title: "Patterns" };

export default function Page() {
  return (
    <>
      <DocsPageHeader eyebrow="Library" title="Patterns" description="Composed app UI built only from @rekanica/ui. Preview at any viewport, then copy the code or install it from the registry." />
      <CatalogGrid items={patterns} base="/docs/patterns" />
      <Pager href="/docs/patterns" />
    </>
  );
}
