"use client";

import { AspectRatio } from "@rekanica/ui/components/aspect-ratio";

export default function AspectRatioDemo() {
  return (
    <div className="w-full max-w-md">
      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-2xl border bg-muted">
        <div className="flex size-full items-center justify-center text-sm text-muted-foreground">16 / 9</div>
      </AspectRatio>
    </div>
  );
}
