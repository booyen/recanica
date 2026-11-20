"use client";

import * as React from "react";
import { CheckIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@recanica/ui/components/avatar";
import { Badge } from "@recanica/ui/components/badge";
import { Button } from "@recanica/ui/components/button";
import { Input } from "@recanica/ui/components/input";
import { Textarea } from "@recanica/ui/components/textarea";
import { Heading } from "@recanica/ui/components/page";
import { SurfaceGrid } from "@recanica/ui/components/surface";

const facts = [["Price", "RM 1,280,000"], ["Bedrooms", "3"], ["Bathrooms", "2"], ["Built-up", "1,420 sqft"], ["Tenure", "Freehold"], ["Furnishing", "Partly furnished"]];
const amenities = ["24-hour security", "Swimming pool", "Gym", "2 car parks", "Near international schools", "5 min to Publika"];

export function SingleProperty01() {
  const [sent, setSent] = React.useState(false);
  return (
    <section className="px-gutter py-section-sm">
      <div className="mx-auto max-w-content space-y-8">
        <div className="grid gap-3 md:grid-cols-[2fr_1fr] md:grid-rows-2">
          <div className="aspect-[4/3] rounded-3xl border bg-muted md:row-span-2 md:aspect-auto" role="img" aria-label="Living room" />
          <div className="hidden aspect-[4/3] rounded-3xl border bg-muted md:block" role="img" aria-label="Kitchen" />
          <div className="hidden aspect-[4/3] rounded-3xl border bg-muted md:block" role="img" aria-label="Bedroom" />
        </div>
        <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-8">
            <div className="space-y-2">
              <Badge variant="outline">For sale</Badge>
              <Heading level={1}>Corner unit at Mont Kiara</Heading>
              <p className="text-muted-foreground">Jalan Kiara 3, Mont Kiara, 50480 Kuala Lumpur</p>
            </div>
            <SurfaceGrid as="dl" className="grid-cols-2 sm:grid-cols-3">
              {facts.map(([k, v]) => <div key={k} className="bg-background p-4"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-1">{v}</dd></div>)}
            </SurfaceGrid>
            <div className="space-y-3">
              <Heading level={2}>About this home</Heading>
              <p className="max-w-copy text-muted-foreground">A bright corner unit on the 18th floor with windows on two sides. Renovated kitchen, built-in wardrobes and a balcony facing the Kiara hills. Walking distance to cafés and the international school.</p>
            </div>
            <div className="space-y-3">
              <Heading level={2}>Amenities</Heading>
              <ul className="grid gap-2 text-sm sm:grid-cols-2">{amenities.map((a) => <li key={a} className="flex items-center gap-2"><CheckIcon className="size-4" /> {a}</li>)}</ul>
            </div>
          </div>
          <aside className="h-fit space-y-5 rounded-3xl border bg-card p-6 lg:sticky lg:top-6">
            <div className="flex items-center gap-3"><Avatar className="size-10"><AvatarFallback>AK</AvatarFallback></Avatar><div className="text-sm">Aisyah Karim<span className="block text-muted-foreground">REN 31245 · Kiara Realty</span></div></div>
            {sent ? (
              <p className="text-sm">Thanks. Aisyah will contact you within a day.</p>
            ) : (
              <form className="grid gap-2" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <Input required placeholder="Name" aria-label="Name" />
                <Input required type="tel" placeholder="Phone" aria-label="Phone" />
                <Textarea placeholder="I'd like to view this unit on…" aria-label="Message" />
                <Button type="submit">Request a viewing</Button>
                <Button type="button" variant="outline">WhatsApp agent</Button>
              </form>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

export default SingleProperty01;
