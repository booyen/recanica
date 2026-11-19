import { DocsNav } from "@/components/docs/docs-nav";
import { SiteFooter } from "@/components/docs/site-footer";
import { SiteHeader } from "@/components/docs/site-header";
import { Toc } from "@/components/docs/toc";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="mx-auto max-w-screen-2xl px-gutter lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] overflow-y-auto overscroll-contain py-8 lg:block">
          <DocsNav />
        </aside>
        <main data-docs-content className="min-w-0 py-8 lg:py-12">
          {children}
        </main>
        <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] overflow-y-auto py-12 xl:block">
          <Toc />
        </aside>
      </div>
      <SiteFooter />
    </>
  );
}
