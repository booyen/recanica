"use client";

import { Checkbox } from "@recanica/ui/components/checkbox";
import { Label } from "@recanica/ui/components/label";

export default function CheckboxDemo() {
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2"><Checkbox id="c1" defaultChecked /><Label htmlFor="c1">Send receipts by email</Label></div>
      <div className="flex items-center gap-2"><Checkbox id="c2" /><Label htmlFor="c2">Collect tax ID at checkout</Label></div>
      <div className="flex items-center gap-2"><Checkbox id="c3" disabled /><Label htmlFor="c3">Require phone number</Label></div>
    </div>
  );
}
