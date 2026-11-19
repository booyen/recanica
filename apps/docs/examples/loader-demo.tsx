"use client";

import { LOADER_ANIMATIONS, Loader } from "@recanica/ui/components/loader";

export default function LoaderDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-6">
        {LOADER_ANIMATIONS.map((a) => (
          <figure key={a} className="flex flex-col items-center gap-3">
            <Loader animation={a} size="lg" label={`Loading (${a})`} />
            <figcaption className="text-xs text-muted-foreground">{a}</figcaption>
          </figure>
        ))}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-6 border-t pt-6">
        {(["pulse", "breathe", "bounce", "sway"] as const).map((a) => (
          <figure key={a} className="flex flex-col items-center gap-3">
            <Loader logo="shapes" animation={a} size="lg" label={`Loading (shapes, ${a})`} />
            <figcaption className="text-xs text-muted-foreground">shapes · {a}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
