"use client";

import { Separator } from "@rekanica/ui/components/separator";

export default function SeparatorDemo() {
  return (
    <div className="w-full max-w-sm text-sm">
      <p>Rekanica</p>
      <p className="text-muted-foreground">Tokens, components and patterns.</p>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-muted-foreground">
        <span>Docs</span><Separator orientation="vertical" /><span>Components</span><Separator orientation="vertical" /><span>Patterns</span>
      </div>
    </div>
  );
}
