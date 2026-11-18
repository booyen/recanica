"use client";

import { ChevronsUpDownIcon } from "lucide-react";
import { Button } from "@rekanica/ui/components/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@rekanica/ui/components/collapsible";

export default function CollapsibleDemo() {
  return (
    <Collapsible className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between rounded-xl border px-4 py-2 text-sm">
        3 benefits included
        <CollapsibleTrigger asChild><Button variant="ghost" size="icon-sm" aria-label="Toggle"><ChevronsUpDownIcon /></Button></CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        {["Discord role", "GitHub repository access", "License key"].map((b) => (
          <div key={b} className="rounded-xl border px-4 py-2 text-sm text-muted-foreground">{b}</div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
