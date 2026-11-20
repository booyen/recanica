import { CatalogGrid } from "@/components/docs/catalog-grid";
import { DocsPageHeader } from "@/components/docs/page-header";
import { Pager } from "@/components/docs/pager";
import { components } from "@/lib/docs";

export const metadata = { title: "Components" };

export default function Page() {
  return (
    <>
      <DocsPageHeader
        title="Components"
        description={`${components.length} accessible primitives on Radix, styled only with Recanica tokens. Import from @recanica/ui/components/<name>.`}
      />
      <CatalogGrid items={components} base="/docs/components" />
      <Pager href="/docs/components" />
    </>
  );
}
