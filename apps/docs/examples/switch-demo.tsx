"use client";

import { Switch } from "@rekanica/ui/components/switch";
import { Label } from "@rekanica/ui/components/label";

export default function SwitchDemo() {
  return (
    <div className="flex items-center gap-3">
      <Switch id="s1" defaultChecked />
      <Label htmlFor="s1">Email notifications</Label>
    </div>
  );
}
