"use client";

import { Label } from "@recanica/ui/components/label";
import { Input } from "@recanica/ui/components/input";

export default function LabelDemo() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="org">Organization name</Label>
      <Input id="org" placeholder="Acme Studio" />
    </div>
  );
}
