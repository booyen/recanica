"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon, LogOutIcon, PlusIcon, SettingsIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@recanica/ui/components/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuShortcut, DropdownMenuTrigger,
} from "@recanica/ui/components/dropdown-menu";

const orgs = [
  { name: "Acme Studio", initials: "AS", plan: "Pro" },
  { name: "Lumen Labs", initials: "LL", plan: "Starter" },
  { name: "Personal", initials: "NR", plan: "Free" },
];

export default function AccountSwitcher() {
  const [current, setCurrent] = React.useState(orgs[0]);
  return (
    <div className="flex min-h-[420px] items-start justify-center px-gutter pt-10">
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger className="flex w-64 items-center gap-3 rounded-xl border bg-card px-3 py-2 text-left text-sm transition-colors hover:bg-accent">
          <Avatar className="size-7"><AvatarFallback>{current.initials}</AvatarFallback></Avatar>
          <span className="flex-1 truncate">{current.name}</span>
          <ChevronsUpDownIcon className="size-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="start">
          <DropdownMenuLabel className="text-xs text-muted-foreground">nadia@example.com</DropdownMenuLabel>
          <DropdownMenuGroup>
            {orgs.map((o) => (
              <DropdownMenuItem key={o.name} onSelect={() => setCurrent(o)}>
                <Avatar className="size-6"><AvatarFallback>{o.initials}</AvatarFallback></Avatar>
                <span className="flex-1">{o.name}<span className="block text-xs text-muted-foreground">{o.plan}</span></span>
                {current.name === o.name && <CheckIcon />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem><PlusIcon /> New organization</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem><SettingsIcon /> Settings <DropdownMenuShortcut>⌘,</DropdownMenuShortcut></DropdownMenuItem>
          <DropdownMenuItem><LogOutIcon /> Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
