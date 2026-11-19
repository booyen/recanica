"use client";

import { Separator } from "@recanica/ui/components/separator";

export default function SeparatorDemo() {
  return (
    <div className="w-full max-w-sm text-sm">
      <p>Recanica</p>
      <p className="text-muted-foreground">Tokens, components and patterns.</p>
      <Separator className="my-4" />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground [&>[data-slot=separator]]:h-4">
        <span>Docs</span><Separator orientation="vertical" /><span>Components</span><Separator orientation="vertical" /><span>Patterns</span>
      </div>
    </div>
  );
}
