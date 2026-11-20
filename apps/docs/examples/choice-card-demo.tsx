"use client";

import * as React from "react";
import { ChoiceCard, ChoiceIndicator } from "@recanica/ui/components/choice-card";

export default function ChoiceCardDemo() {
  const [v, setV] = React.useState("fpx");
  const opts = [["fpx", "FPX online banking"], ["duitnow", "DuitNow QR"], ["card", "Card"]];
  return (
    <div role="radiogroup" aria-label="Payment method" className="grid w-full max-w-sm gap-2">
      {opts.map(([id, label]) => (
        <ChoiceCard key={id} checked={v === id} onSelect={() => setV(id)}>
          <span className="flex-1">{label}</span>
          <ChoiceIndicator checked={v === id} />
        </ChoiceCard>
      ))}
    </div>
  );
}
