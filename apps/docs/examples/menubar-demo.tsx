"use client";

import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "@rekanica/ui/components/menubar";

export default function MenubarDemo() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New product <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
          <MenubarItem>Duplicate <MenubarShortcut>⌘D</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Export CSV</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent><MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem><MenubarItem>Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem></MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent><MenubarItem>Toggle sidebar <MenubarShortcut>⌘B</MenubarShortcut></MenubarItem></MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
