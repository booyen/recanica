import { WebHeroTitle } from "@recanica/ui/components/web-section";
import { Heading } from "@recanica/ui/components/page";
import { SurfaceGrid } from "@recanica/ui/components/surface";
const facts = [["Client", "Kedai Kopi Pak Mat"], ["Year", "2026"], ["Services", "Product design, build"], ["Timeline", "8 weeks"]];
const results = [["38%", "of orders now placed online"], ["4 min", "average wait at peak, down from 12"], ["RM 0", "spent on third-party delivery apps"]];

export function SinglePortfolio01() {
  return (
    <article className="px-gutter py-section-sm">
      <div className="mx-auto max-w-content space-y-section-sm">
        <header className="space-y-6">
          <p className="text-sm text-muted-foreground">Case study</p>
          <WebHeroTitle className="max-w-3xl">Online ordering for a 40-year-old kopitiam in Melaka</WebHeroTitle>
          <dl className="grid grid-cols-2 gap-6 border-t pt-6 text-sm md:grid-cols-4">
            {facts.map(([k, v]) => <div key={k}><dt className="text-muted-foreground">{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </header>
        <div className="aspect-[21/9] rounded-3xl border bg-muted" role="img" aria-label="Project hero image" />
        <div className="grid gap-10 md:grid-cols-[14rem_1fr]">
          <Heading level={2}>The problem</Heading>
          <p className="max-w-copy text-muted-foreground">Regulars ordered by phone and the lunch queue went out the door. Delivery apps took 30% of each order, so Pak Mat stopped using them.</p>
          <Heading level={2}>What we did</Heading>
          <p className="max-w-copy text-muted-foreground">A simple order page customers open from a QR code on the table or a WhatsApp link. Payment by DuitNow QR, orders printed straight to the kitchen.</p>
        </div>
        <SurfaceGrid className="sm:grid-cols-3">
          {results.map(([v, l]) => <div key={l} className="bg-background p-panel"><p className="text-metric font-light">{v}</p><p className="mt-2 text-sm text-muted-foreground">{l}</p></div>)}
        </SurfaceGrid>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="aspect-[4/3] rounded-3xl border bg-muted" role="img" aria-label="Screens" />
          <div className="aspect-[4/3] rounded-3xl border bg-muted" role="img" aria-label="In store" />
        </div>
      </div>
    </article>
  );
}

export default SinglePortfolio01;
