import type * as React from "react";
import { ArrowRightIcon } from "lucide-react";
import { Badge } from "@recanica/ui/components/badge";
import { Button } from "@recanica/ui/components/button";
import { WebHeroTitle } from "@recanica/ui/components/web-section";

/** Centred hero. Content is props; defaults are the sample billing product. */
export function Hero01({
  badge = "New · Payment plans are live",
  title = "Invoices and payments for small businesses",
  description = "Send an invoice, get paid by FPX or DuitNow, and have SST and e-Invoice done for you.",
  actions = (
    <>
      <Button size="lg" variant="brand">Get started <ArrowRightIcon /></Button>
      <Button size="lg" variant="outline">Book a demo</Button>
    </>
  ),
}: { badge?: React.ReactNode; title?: React.ReactNode; description?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="px-gutter py-section">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        {badge && <Badge variant="outline">{badge}</Badge>}
        <WebHeroTitle size="lg" className="text-brand">{title}</WebHeroTitle>
        <p className="max-w-xl text-base text-balance text-muted-foreground sm:text-lg">{description}</p>
        <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">{actions}</div>
      </div>
    </section>
  );
}

export default Hero01;
