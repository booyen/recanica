"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";
import { Dialog, DialogContent, DialogTitle } from "@recanica/ui/components/dialog";
import { WebSectionTitle } from "@recanica/ui/components/web-section";
import { Surface } from "@recanica/ui/components/surface";

const shots = [
  { label: "Office, level 12", ratio: "aspect-[4/5]" }, { label: "Team lunch", ratio: "aspect-square" }, { label: "Workshop room", ratio: "aspect-[4/3]" },
  { label: "Penang hub", ratio: "aspect-[4/3]" }, { label: "Launch night", ratio: "aspect-[4/5]" }, { label: "Customer meetup", ratio: "aspect-square" },
  { label: "Whiteboard session", ratio: "aspect-[4/5]" }, { label: "Rooftop", ratio: "aspect-[4/3]" },
];

export function Gallery01() {
  const [open, setOpen] = React.useState<number | null>(null);
  const go = (d: number) => setOpen((i) => (i === null ? i : (i + d + shots.length) % shots.length));
  return (
    <section className="px-gutter py-section-sm">
      <div className="mx-auto max-w-content">
        <WebSectionTitle>Life at Acme</WebSectionTitle>
        <div className="mt-10 columns-2 gap-3 md:columns-3 lg:columns-4">
          {shots.map((s, i) => (
            <Surface as="button" type="button" key={s.label} onClick={() => setOpen(i)} tone="muted" inset="none" className={`mb-3 block w-full break-inside-avoid ${s.ratio} text-xs text-muted-foreground transition-opacity hover:opacity-80`} aria-label={`Open ${s.label}`}>
              {s.label}
            </Surface>
          ))}
        </div>
      </div>
      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogTitle>{open !== null ? shots[open].label : ""}</DialogTitle>
          <div className="flex aspect-[16/10] items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">Image {open !== null ? open + 1 : ""} of {shots.length}</div>
          <div className="flex justify-between">
            <Button variant="outline" size="icon" aria-label="Previous" onClick={() => go(-1)}><ChevronLeftIcon /></Button>
            <Button variant="outline" size="icon" aria-label="Next" onClick={() => go(1)}><ChevronRightIcon /></Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default Gallery01;
