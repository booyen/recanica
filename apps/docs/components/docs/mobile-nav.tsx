"use client";

import * as React from "react";
import { MenuIcon } from "lucide-react";
import { Button } from "@rekanica/ui/components/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@rekanica/ui/components/sheet";
import { DocsNav } from "./docs-nav";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu"><MenuIcon /></Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] max-w-xs gap-0 p-0">
        <SheetHeader className="border-b"><SheetTitle>Rekanica</SheetTitle></SheetHeader>
        <div className="overflow-y-auto px-2 pt-4">
          <DocsNav onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
