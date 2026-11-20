"use client";

import * as React from "react";
import { CheckIcon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";
import { Input } from "@recanica/ui/components/input";
import { WebHeroTitle } from "@recanica/ui/components/web-section";
import { Surface } from "@recanica/ui/components/surface";

export function Hero03() {
  const [sent, setSent] = React.useState(false);
  return (
    <section className="px-gutter py-section-sm">
      <div className="mx-auto grid max-w-content items-center gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <WebHeroTitle>Send invoices your customers can pay in one tap</WebHeroTitle>
          <p className="max-w-lg text-muted-foreground sm:text-lg">FPX, DuitNow and cards on every invoice. SST and e-Invoice handled. Most invoices are paid within 3 days.</p>
          {sent ? (
            <Surface as="p" size="sm" tone="plain" inset="sm" className="flex items-center gap-2 text-sm"><CheckIcon className="size-4" /> Thanks. We&apos;ll email your login link in a minute.</Surface>
          ) : (
            <form className="flex max-w-md flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <Input type="email" required placeholder="Work email" aria-label="Work email" className="h-11" />
              <Button type="submit" size="lg" variant="brand" className="shrink-0">Start free</Button>
            </form>
          )}
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {["Free for 14 days", "No card needed", "Cancel anytime"].map((t) => <li key={t} className="flex items-center gap-1.5"><CheckIcon className="size-3.5" /> {t}</li>)}
          </ul>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border bg-muted" role="img" aria-label="Product screenshot placeholder">
          <div /* recanica-ignore: product screenshot illustration */ className="absolute inset-6 rounded-2xl border bg-panel p-5">
            <div className="h-3 w-24 rounded-full bg-muted" />
            <div className="mt-6 text-metric font-light">RM 14,904</div>
            <div className="mt-2 h-2 w-2/3 rounded-full bg-muted" />
            <div className="mt-8 space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-8 rounded-lg border" />)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero03;
