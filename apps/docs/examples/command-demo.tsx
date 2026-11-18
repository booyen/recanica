"use client";

import { BoxIcon, CreditCardIcon, SettingsIcon, UserIcon } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@rekanica/ui/components/command";

export default function CommandDemo() {
  return (
    <Command className="w-full max-w-md rounded-2xl border">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Create">
          <CommandItem><BoxIcon /> New product</CommandItem>
          <CommandItem><CreditCardIcon /> New checkout link</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Go to">
          <CommandItem><UserIcon /> Customers <CommandShortcut>G C</CommandShortcut></CommandItem>
          <CommandItem><SettingsIcon /> Settings <CommandShortcut>G S</CommandShortcut></CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
