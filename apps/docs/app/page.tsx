import catalog from "@/lib/catalog.json";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";
import { SiteHeader } from "@/components/docs/site-header";
import { Bento01 } from "@/registry/web/bento-01";
import { Cta01 } from "@/registry/web/cta-01";
import { SiteFooter } from "@/components/docs/site-footer";
import { blocks, components, patterns } from "@/lib/docs";
import { SurfaceGrid } from "@recanica/ui/components/surface";

import { Hero01 } from "@/registry/web/hero-01";

// The design system's own homepage, assembled from its blocks.
export default function Home() {
  return (
    <>
      <SiteHeader />
      <Hero01
        badge="Design system for dashboards and websites"
        title="Recanica"
        description={`Calm and precise, monochrome by default. Tokens, ${components.length} components, ${patterns.length} patterns and ${blocks.length} blocks for dashboards and landing pages.`}
        actions={<>
          <Button size="lg" variant="brand" asChild><Link href="/docs">Read the docs <ArrowRightIcon /></Link></Button>
          <Button size="lg" variant="outline" asChild><Link href="/site">Sample website</Link></Button>
          <Button size="lg" variant="outline" asChild><Link href="/demo">Dashboard demo</Link></Button>
        </>}
      />
      <section className="px-gutter py-section-sm">
        <SurfaceGrid as="dl" className="mx-auto max-w-content grid-cols-2 lg:grid-cols-4">
          {[[components.length, "components"], [patterns.length, "app patterns"], [blocks.length, "marketing blocks"], [catalog.web.length, "web sections"]].map(([v, l]) => (
            <div key={l} className="bg-background p-panel">
              <dd className="text-[2rem] leading-none font-light tracking-tight sm:text-display-sm">{v}</dd>
              <dt className="mt-2 text-sm text-muted-foreground">{l}</dt>
            </div>
          ))}
        </SurfaceGrid>
      </section>
      <Bento01 />
      <Cta01 />
      <SiteFooter />
    </>
  );
}
