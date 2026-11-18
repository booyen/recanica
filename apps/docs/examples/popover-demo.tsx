"use client";

import { Button } from "@rekanica/ui/components/button";
import { Input } from "@rekanica/ui/components/input";
import { Label } from "@rekanica/ui/components/label";
import { Popover, PopoverContent, PopoverTrigger } from "@rekanica/ui/components/popover";

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild><Button variant="outline">Set limit</Button></PopoverTrigger>
      <PopoverContent className="grid gap-3">
        <div><p className="text-sm">Usage limit</p><p className="text-xs text-muted-foreground">Cap redemptions for this discount.</p></div>
        <div className="grid grid-cols-3 items-center gap-2"><Label htmlFor="pv-max">Max</Label><Input id="pv-max" defaultValue="100" className="col-span-2 h-8" /></div>
      </PopoverContent>
    </Popover>
  );
}
