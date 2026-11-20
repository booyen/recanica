"use client";

import * as React from "react";
import { MinusIcon, PlusIcon, StarIcon, TruckIcon } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@recanica/ui/components/accordion";
import { Button } from "@recanica/ui/components/button";
import { ToggleGroup, ToggleGroupItem } from "@recanica/ui/components/toggle-group";
import { cn } from "@recanica/ui/lib/utils";
import { Heading } from "@recanica/ui/components/page";
import { ChoiceCard } from "@recanica/ui/components/choice-card";

export function SingleProduct01() {
  const [img, setImg] = React.useState(0);
  const [grind, setGrind] = React.useState("beans");
  const [size, setSize] = React.useState("500g");
  const [qty, setQty] = React.useState(1);
  const price = size === "1kg" ? 68 : 38;
  return (
    <section className="px-gutter py-section-sm">
      <div className="mx-auto grid max-w-content gap-10 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex aspect-square items-center justify-center rounded-3xl border bg-muted text-sm text-muted-foreground" role="img" aria-label={`Product image ${img + 1}`}>Image {img + 1}</div>
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => <ChoiceCard key={i} variant="media" checked={img === i} onSelect={() => setImg(i)} aria-label={`Show image ${i + 1}`} className="aspect-square" />)}
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Heading level={1}>Kopi Ais Blend</Heading>
            <p className="flex items-center gap-1 text-sm text-muted-foreground"><StarIcon className="size-3.5 fill-current" /> 4.8 · 214 reviews</p>
            <p className="text-metric font-light tabular-nums">RM{price}</p>
            <p className="text-muted-foreground">Robusta and liberica roasted with butter and sugar, the way kopitiams have done it for decades. Made for iced coffee.</p>
          </div>
          <div className="space-y-2"><p className="text-sm">Grind</p>
            <ToggleGroup type="single" value={grind} onValueChange={(v) => v && setGrind(v)} variant="outline" spacing={2} className="flex-wrap">
              <ToggleGroupItem value="beans">Whole beans</ToggleGroupItem><ToggleGroupItem value="filter">Filter</ToggleGroupItem><ToggleGroupItem value="sock">Kopi sock</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="space-y-2"><p className="text-sm">Size</p>
            <ToggleGroup type="single" value={size} onValueChange={(v) => v && setSize(v)} variant="outline" spacing={2} className="flex-wrap">
              <ToggleGroupItem value="500g">500g</ToggleGroupItem><ToggleGroupItem value="1kg">1kg</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center rounded-full border">
              <Button variant="ghost" size="icon" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}><MinusIcon /></Button>
              <span className="w-8 text-center tabular-nums" aria-live="polite">{qty}</span>
              <Button variant="ghost" size="icon" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}><PlusIcon /></Button>
            </div>
            <Button variant="brand" className="flex-1" onClick={() => toast.success("Added to cart", { description: `${qty} × Kopi Ais Blend ${size}` })}>Add to cart · RM{price * qty}</Button>
          </div>
          <p className="flex items-center gap-2 text-sm text-muted-foreground"><TruckIcon className="size-4" /> Free delivery in Peninsular Malaysia over RM100.</p>
          <Accordion type="single" collapsible defaultValue="details">
            <AccordionItem value="details"><AccordionTrigger>Details</AccordionTrigger><AccordionContent className="text-muted-foreground">Roasted in Johor every Monday. Best within 6 weeks of roasting.</AccordionContent></AccordionItem>
            <AccordionItem value="brew"><AccordionTrigger>How to brew</AccordionTrigger><AccordionContent className="text-muted-foreground">3 tablespoons per 250ml hot water. Steep 4 minutes, strain, add condensed milk and ice.</AccordionContent></AccordionItem>
            <AccordionItem value="returns"><AccordionTrigger>Delivery and returns</AccordionTrigger><AccordionContent className="text-muted-foreground">Ships in 1–2 business days. Unopened bags can be returned within 14 days.</AccordionContent></AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export default SingleProduct01;
