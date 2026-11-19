"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, CodeIcon, MonitorIcon, SmartphoneIcon, TabletIcon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";
import { ToggleGroup, ToggleGroupItem } from "@recanica/ui/components/toggle-group";
import type { CatalogItem } from "@/lib/docs";

const widths = { mobile: 375, tablet: 768, desktop: 0 } as const;

/** One web section on its own page, rendered in an isolated frame at a chosen width. */
export function SectionViewer({ item, prev, next, index, total }: { item: CatalogItem; prev: CatalogItem; next: CatalogItem; index: number; total: number }) {
  const [size, setSize] = React.useState<keyof typeof widths>("desktop");
  const w = widths[size];
  return (
    <div className="flex h-svh flex-col bg-sidebar">
      <header className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b bg-background px-4 py-2.5">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/site/sections" aria-label="All sections"><ArrowLeftIcon /> <span className="hidden sm:inline">All sections</span></Link>
        </Button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm">{item.title}</p>
          <p className="truncate text-xs text-muted-foreground">{item.category} · {index} of {total}</p>
        </div>
        <ToggleGroup type="single" value={size} onValueChange={(v) => v && setSize(v as keyof typeof widths)} variant="outline" size="sm" className="hidden md:flex" aria-label="Preview width">
          <ToggleGroupItem value="mobile" aria-label="Mobile, 375px"><SmartphoneIcon /></ToggleGroupItem>
          <ToggleGroupItem value="tablet" aria-label="Tablet, 768px"><TabletIcon /></ToggleGroupItem>
          <ToggleGroupItem value="desktop" aria-label="Full width"><MonitorIcon /></ToggleGroupItem>
        </ToggleGroup>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" asChild><Link href={`/site/sections/${prev.slug}`} aria-label={`Previous: ${prev.title}`} title={prev.title}><ChevronLeftIcon /></Link></Button>
          <Button variant="ghost" size="icon-sm" asChild><Link href={`/site/sections/${next.slug}`} aria-label={`Next: ${next.title}`} title={next.title}><ChevronRightIcon /></Link></Button>
          <Button variant="outline" size="sm" asChild><Link href={`/docs/web/${item.slug}`}><CodeIcon /> Code</Link></Button>
        </div>
      </header>
      <div className="flex min-h-0 flex-1 justify-center overflow-auto p-2 sm:p-3">
        <iframe
          key={item.slug}
          src={`/view/web/${item.slug}`}
          title={item.title}
          className="h-full rounded-2xl border bg-background transition-[width] duration-200"
          style={{ width: w ? `${w}px` : "100%", maxWidth: "100%" }}
        />
      </div>
    </div>
  );
}
