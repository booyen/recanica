"use client";

import { ChevronDownIcon } from "lucide-react";
import { Button } from "@rekanica/ui/components/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@rekanica/ui/components/dropdown-menu";

export default function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="outline">Actions <ChevronDownIcon /></Button></DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Pro Yearly</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>Edit <DropdownMenuShortcut>⌘E</DropdownMenuShortcut></DropdownMenuItem>
          <DropdownMenuItem>Duplicate <DropdownMenuShortcut>⌘D</DropdownMenuShortcut></DropdownMenuItem>
          <DropdownMenuItem>Copy checkout link</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>Visible in storefront</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Archive</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
