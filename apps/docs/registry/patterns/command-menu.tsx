"use client";

import * as React from "react";
import {
  BoxIcon, CreditCardIcon, LayoutGridIcon, LinkIcon, MoonIcon, SearchIcon, SettingsIcon, UsersIcon,
} from "lucide-react";
import { Button } from "@rekanica/ui/components/button";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut,
} from "@rekanica/ui/components/command";
import { Kbd, KbdGroup } from "@rekanica/ui/components/kbd";

export default function CommandMenu() {
  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen((o) => !o); }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="flex min-h-[480px] items-start justify-center px-gutter pt-10">
      <Button variant="secondary" onClick={() => setOpen(true)} className="w-full max-w-xs justify-start text-muted-foreground">
        <SearchIcon /> <span className="flex-1 text-left font-normal">Search…</span>
        <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Create">
            <CommandItem><BoxIcon /> New product <CommandShortcut>C P</CommandShortcut></CommandItem>
            <CommandItem><LinkIcon /> New checkout link <CommandShortcut>C L</CommandShortcut></CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Go to">
            <CommandItem><LayoutGridIcon /> Overview <CommandShortcut>G O</CommandShortcut></CommandItem>
            <CommandItem><UsersIcon /> Customers <CommandShortcut>G C</CommandShortcut></CommandItem>
            <CommandItem><CreditCardIcon /> Finance <CommandShortcut>G F</CommandShortcut></CommandItem>
            <CommandItem><SettingsIcon /> Settings <CommandShortcut>G S</CommandShortcut></CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Preferences">
            <CommandItem><MoonIcon /> Toggle theme</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
