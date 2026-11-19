import catalog from "@/lib/catalog.json";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Badge } from "@recanica/ui/components/badge";
import { Button } from "@recanica/ui/components/button";
import { SiteHeader } from "@/components/docs/site-header";
import { Bento01 } from "@/registry/web/bento-01";
import { Cta01 } from "@/registry/web/cta-01";
import { SiteFooter } from "@/components/docs/site-footer";
import { blocks, components, patterns } from "@/lib/docs";

// The design system's own homepage, assembled from its blocks.
export default function Home() {
  return (
    <>
      <SiteHeader />
      <section className="relative overflow-hidden px-gutter py-section">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-96 max-w-3xl rounded-full bg-foreground/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <Badge variant="outline" className="bg-background/60 backdrop-blur">Design system for dashboards and websites</Badge>
          <h1 className="text-display-sm tracking-tight text-balance text-brand sm:text-display-md lg:text-display-lg">Recanica</h1>
          <p className="max-w-xl text-base text-balance text-muted-foreground sm:text-lg">
            Monochrome, calm and precise. Tokens, {components.length} components, {patterns.length} patterns and {blocks.length} blocks for dashboards and landing pages.
          </p>
          <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Button size="lg" variant="brand" asChild><Link href="/docs">Read the docs <ArrowRightIcon /></Link></Button>
            <Button size="lg" variant="outline" asChild><Link href="/site">Sample website</Link></Button>
            <Button size="lg" variant="outline" asChild><Link href="/demo">Dashboard demo</Link></Button>
          </div>
        </div>
      </section>
      <section className="px-gutter py-section-sm">
        <dl className="mx-auto grid max-w-content grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border lg:grid-cols-4">
          {[[components.length, "components"], [patterns.length, "app patterns"], [blocks.length, "marketing blocks"], [catalog.web.length, "web sections"]].map(([v, l]) => (
            <div key={l} className="bg-background p-panel">
              <dd className="text-[2rem] leading-none font-light tracking-tight sm:text-display-sm">{v}</dd>
              <dt className="mt-2 text-sm text-muted-foreground">{l}</dt>
            </div>
          ))}
        </dl>
      </section>
      <Bento01 />
      <Cta01 />
      <SiteFooter />
    </>
  );
}
