import { ArrowRightIcon } from "lucide-react";
import { Badge } from "@rekanica/ui/components/badge";
import { Button } from "@rekanica/ui/components/button";

export function Hero01() {
  return (
    <section className="relative overflow-hidden px-gutter py-section">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-96 max-w-3xl rounded-full bg-foreground/10 blur-3xl" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <Badge variant="outline" className="bg-background/60 backdrop-blur">New · Aturanica 1.0 is live</Badge>
        <h1 className="text-display-sm tracking-tight text-balance text-metallic sm:text-display-md lg:text-display-lg">
          The platform your team actually wants to use
        </h1>
        <p className="max-w-xl text-base text-balance text-muted-foreground sm:text-lg">
          Replace this with your value proposition. One sentence on what changes for the customer.
        </p>
        <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Button size="lg" variant="brand">Get started <ArrowRightIcon /></Button>
          <Button size="lg" variant="outline">Book a demo</Button>
        </div>
      </div>
    </section>
  );
}

export default Hero01;
