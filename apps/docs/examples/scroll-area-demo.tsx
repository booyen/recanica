"use client";

import { ScrollArea } from "@recanica/ui/components/scroll-area";
import { Separator } from "@recanica/ui/components/separator";

const tags = Array.from({ length: 30 }).map((_, i) => `v1.${30 - i}.0`);

export default function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-64 w-48 rounded-2xl border">
      <div className="p-4 text-sm">
        <p className="mb-3">Releases</p>
        {tags.map((t) => (
          <div key={t}><p className="text-muted-foreground">{t}</p><Separator className="my-2" /></div>
        ))}
      </div>
    </ScrollArea>
  );
}
