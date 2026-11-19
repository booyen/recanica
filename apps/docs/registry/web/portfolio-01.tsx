"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@rekanica/ui/components/tabs";

const work = [
  { title: "Kopi Pak Mat ordering", client: "Kedai Kopi Pak Mat", tag: "Product", year: "2026" },
  { title: "Lumen Labs brand refresh", client: "Lumen Labs", tag: "Brand", year: "2026" },
  { title: "Maju Jaya online store", client: "Syarikat Maju Jaya", tag: "Web", year: "2025" },
  { title: "Northwind dashboard", client: "Northwind Trading", tag: "Product", year: "2025" },
  { title: "Batik festival site", client: "Kraf Collective", tag: "Web", year: "2025" },
  { title: "Penang Hub signage", client: "Penang Hub", tag: "Brand", year: "2024" },
];

export function Portfolio01() {
  const [tag, setTag] = React.useState("All");
  const list = work.filter((w) => tag === "All" || w.tag === tag);
  return (
    <section className="px-gutter py-section-sm">
      <div className="mx-auto max-w-content space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-display-sm tracking-tight">Selected work</h1>
          <Tabs value={tag} onValueChange={setTag}><TabsList>{["All", "Product", "Web", "Brand"].map((t) => <TabsTrigger key={t} value={t}>{t}</TabsTrigger>)}</TabsList></Tabs>
        </div>
        <div className="grid gap-x-6 gap-y-10 md:grid-cols-2">
          {list.map((w) => (
            <a key={w.title} href="#" className="group space-y-3">
              <div className="aspect-[4/3] rounded-3xl border bg-muted transition-transform duration-300 ease-out-soft group-hover:scale-[0.99]" role="img" aria-label={`${w.title} cover`} />
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="group-hover:underline">{w.title}</h2>
                <span className="shrink-0 text-sm text-muted-foreground">{w.tag} · {w.year}</span>
              </div>
              <p className="text-sm text-muted-foreground">{w.client}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Portfolio01;
