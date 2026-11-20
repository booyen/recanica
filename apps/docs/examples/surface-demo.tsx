"use client";

import { Surface, SurfaceGrid } from "@recanica/ui/components/surface";

export default function SurfaceDemo() {
  return (
    <div className="@container grid w-full max-w-xl gap-4">
      <Surface>Card tone, default inset.</Surface>
      <Surface tone="panel" inset="lg">Panel tone, large inset.</Surface>
      <Surface size="sm" inset="sm" dashed tone="plain">Small, dashed, plain.</Surface>
      <SurfaceGrid className="@sm:grid-cols-3">
        {["Paid", "Overdue", "Draft"].map((x) => <div key={x} className="p-(--spacing-inset) text-sm">{x}</div>)}
      </SurfaceGrid>
    </div>
  );
}
