"use client";

import { PlusIcon, StarIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@recanica/ui/components/badge";
import { Button } from "@recanica/ui/components/button";
import { WebSectionTitle } from "@recanica/ui/components/web-section";

export const products = [
  { id: "p1", name: "Kopi Ais Blend, 500g", price: 38, rating: 4.8, reviews: 214, tag: "Bestseller" },
  { id: "p2", name: "Pandan Kaya Jar", price: 16, rating: 4.9, reviews: 98 },
  { id: "p3", name: "Enamel Mug, Grey", price: 29, rating: 4.6, reviews: 41 },
  { id: "p4", name: "Drip Kettle 1L", price: 149, was: 189, rating: 4.7, reviews: 63, tag: "Sale" },
  { id: "p5", name: "Single-origin Sabah, 250g", price: 45, rating: 4.5, reviews: 27, tag: "New" },
  { id: "p6", name: "Cold Brew Bottle", price: 59, rating: 4.4, reviews: 19 },
  { id: "p7", name: "Batik Tote Bag", price: 35, rating: 4.9, reviews: 52 },
  { id: "p8", name: "Gift Box, Small", price: 89, rating: 4.8, reviews: 33 },
];
export const rm = (n: number) => `RM${n.toLocaleString("en-MY", { minimumFractionDigits: n % 1 ? 2 : 0 })}`;

/** `titleAs="h1"` when this section is the top of its page (every page needs one h1). */
export function Products01({ titleAs: Title = "h2" }: { titleAs?: "h1" | "h2" }) {
  return (
    <section className="px-gutter py-section-sm">
      <div className="mx-auto max-w-content">
        <div className="flex items-end justify-between gap-4">
          <WebSectionTitle as={Title}>Shop</WebSectionTitle>
          <a href="/site/shop" className="-my-1 py-1 text-sm text-muted-foreground hover:text-foreground">View all</a>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <li key={p.id} className="group">
              <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted" role="img" aria-label={p.name}>
                {p.tag && <Badge variant={p.tag === "Sale" ? "destructive" : "secondary"} className="absolute top-3 left-3">{p.tag}</Badge>}
                <Button size="icon-sm" className="absolute right-3 bottom-3 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100" aria-label={`Add ${p.name} to cart`} onClick={() => toast.success("Added to cart", { description: p.name })}>
                  <PlusIcon />
                </Button>
              </div>
              <a href="/site/shop/kopi-ais-blend" className="mt-2 block py-1 text-sm hover:underline">{p.name}</a>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><StarIcon className="size-3 fill-current" /> {p.rating} ({p.reviews})</p>
              <p className="mt-1 text-sm tabular-nums">{rm(p.price)} {p.was && <span className="text-muted-foreground line-through">{rm(p.was)}</span>}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Products01;
