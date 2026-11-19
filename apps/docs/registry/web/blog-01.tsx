"use client";

import * as React from "react";
import { Badge } from "@rekanica/ui/components/badge";
import { Tabs, TabsList, TabsTrigger } from "@rekanica/ui/components/tabs";

const posts = [
  { title: "What changes for small businesses with e-Invoice in 2026", cat: "Tax", date: "12 Nov 2026", read: "6 min", excerpt: "Who needs to comply, by when, and what the validation QR on your invoice actually does." },
  { title: "Deposits and instalments without the awkward follow-ups", cat: "Guides", date: "4 Nov 2026", read: "4 min", excerpt: "How to set up a payment plan your customer agrees to before work starts." },
  { title: "How Studio Aina cut payment time from 11 days to 3", cat: "Stories", date: "28 Oct 2026", read: "5 min", excerpt: "A two-person studio in Kota Bharu on switching from bank transfers to payment links." },
  { title: "FPX or DuitNow QR: which should you offer?", cat: "Guides", date: "15 Oct 2026", read: "3 min", excerpt: "Both. Here's what each costs and when customers prefer one over the other." },
  { title: "Release notes: October", cat: "Product", date: "1 Oct 2026", read: "2 min", excerpt: "Payment plans, faster CSV exports and a new invoice layout." },
  { title: "Pricing your services when costs go up", cat: "Stories", date: "18 Sep 2026", read: "7 min", excerpt: "Five owners on how they told clients about a price change." },
];
const cats = ["All", "Guides", "Tax", "Stories", "Product"];

function Cover({ className = "" }: { className?: string }) {
  return <div className={`rounded-2xl border bg-muted ${className}`} role="img" aria-label="Article cover placeholder" />;
}

export function Blog01() {
  const [cat, setCat] = React.useState("All");
  const [featured, ...rest] = posts;
  const list = rest.filter((p) => cat === "All" || p.cat === cat);
  return (
    <section className="px-gutter py-section-sm">
      <div className="mx-auto max-w-content space-y-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><h1 className="text-display-sm tracking-tight">Blog</h1><p className="mt-2 text-muted-foreground">Guides on billing, tax and running a small business in Malaysia.</p></div>
          <div className="-mx-1 overflow-x-auto px-1">
            <Tabs value={cat} onValueChange={setCat}><TabsList>{cats.map((c) => <TabsTrigger key={c} value={c}>{c}</TabsTrigger>)}</TabsList></Tabs>
          </div>
        </div>
        {cat === "All" && (
          <a href="#" className="group grid gap-6 lg:grid-cols-2 lg:items-center">
            <Cover className="aspect-[16/10]" />
            <div className="space-y-3">
              <Badge variant="outline">{featured.cat}</Badge>
              <h2 className="text-heading text-balance group-hover:underline sm:text-title">{featured.title}</h2>
              <p className="text-muted-foreground">{featured.excerpt}</p>
              <p className="text-sm text-muted-foreground">{featured.date} · {featured.read} read</p>
            </div>
          </a>
        )}
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <a key={p.title} href="#" className="group space-y-3">
              <Cover className="aspect-[16/10]" />
              <p className="text-xs text-muted-foreground">{p.cat} · {p.date}</p>
              <h3 className="text-balance group-hover:underline">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.excerpt}</p>
            </a>
          ))}
          {list.length === 0 && <p className="text-sm text-muted-foreground">No posts in this category yet.</p>}
        </div>
      </div>
    </section>
  );
}

export default Blog01;
