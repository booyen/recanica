"use client";

import { RadioGroup, RadioGroupItem } from "@rekanica/ui/components/radio-group";
import { Label } from "@rekanica/ui/components/label";

export default function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="monthly">
      {["Monthly", "Yearly", "One-time"].map((v) => (
        <div key={v} className="flex items-center gap-2">
          <RadioGroupItem value={v.toLowerCase()} id={`r-${v}`} />
          <Label htmlFor={`r-${v}`}>{v}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}
