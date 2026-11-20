"use client";

import * as React from "react";
import { MenuIcon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@recanica/ui/components/sheet";
import { TopBar } from "@recanica/ui/components/layout";

const links = [["Features", "#features"], ["Pricing", "#pricing"], ["FAQ", "#faq"]];

export function Navbar01() {
  const [open, setOpen] = React.useState(false);
  return (
    <TopBar>
      <div className="mx-auto flex h-16 max-w-content items-center gap-8 px-gutter">
        <a href="/" className="flex items-center gap-2">
          <span className="size-6 rounded-md bg-brand text-brand-foreground" />
          <span className="font-medium">Aturanica</span>
        </a>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {links.map(([l, href]) => <a key={l} href={href} className="whitespace-nowrap transition-colors hover:text-foreground">{l}</a>)}
        </nav>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Button variant="ghost">Sign in</Button>
          <Button variant="brand">Get started</Button>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-auto md:hidden" aria-label="Open menu"><MenuIcon /></Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs">
            <SheetHeader><SheetTitle>Menu</SheetTitle></SheetHeader>
            <nav className="flex flex-col px-4">
              {links.map(([l, href]) => (
                <a key={l} href={href} onClick={() => setOpen(false)} className="border-b py-3 text-lg last:border-b-0">{l}</a>
              ))}
            </nav>
            <div className="mt-auto grid gap-2 p-4">
              <Button variant="outline">Sign in</Button>
              <Button variant="brand">Get started</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </TopBar>
  );
}

export default Navbar01;
