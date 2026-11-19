"use client";

import * as React from "react";
import { MailIcon, MenuIcon, PhoneIcon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";
import { Separator } from "@recanica/ui/components/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@recanica/ui/components/sheet";

const groups = [
  { title: "Shop", links: [["All products", "/site/shop"], ["Kopi Ais Blend", "/site/shop/kopi-ais-blend"], ["Cart", "/site/shop/cart"]] },
  { title: "Company", links: [["About", "/site/about"], ["Careers", "/site/careers"], ["Work", "/site/work"], ["Contact", "/site/contact"]] },
  { title: "Read", links: [["Blog", "/site/blog"], ["Events", "/site/events"]] },
];

export function Offcanvas01() {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="min-h-[560px] bg-background">
      <header className="flex h-16 items-center gap-3 border-b px-gutter">
        <span className="size-6 rounded-md bg-brand text-brand-foreground" />
        <span className="font-medium">Acme</span>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild><Button variant="outline" size="icon" className="ml-auto" aria-label="Open menu"><MenuIcon /></Button></SheetTrigger>
          <SheetContent side="right" className="w-full gap-0 sm:max-w-sm">
            <SheetHeader className="border-b"><SheetTitle>Menu</SheetTitle></SheetHeader>
            <nav className="flex-1 space-y-6 overflow-y-auto p-4">
              {groups.map((g) => (
                <div key={g.title}>
                  <p className="mb-2 text-xs text-muted-foreground">{g.title}</p>
                  <ul>{g.links.map(([l, href]) => <li key={href}><a href={href} className="block rounded-lg py-2 text-lg hover:text-muted-foreground">{l}</a></li>)}</ul>
                </div>
              ))}
              <Separator />
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><PhoneIcon className="size-4" /> +60 3-2711 0000</p>
                <p className="flex items-center gap-2"><MailIcon className="size-4" /> hello@acme.example</p>
              </div>
            </nav>
            <div className="grid gap-2 border-t p-4">
              <Button>Start free</Button>
              <Button variant="outline">Sign in</Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </div>
  );
}

export default Offcanvas01;
