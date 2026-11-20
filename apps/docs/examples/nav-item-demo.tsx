"use client";

import * as React from "react";
import { HomeIcon, InboxIcon, SettingsIcon } from "lucide-react";
import { NavItem } from "@recanica/ui/components/nav-item";

export default function NavItemDemo() {
  const [active, setActive] = React.useState("Inbox");
  const items = [["Home", HomeIcon], ["Inbox", InboxIcon], ["Settings", SettingsIcon]] as const;
  return (
    <div className="grid w-full max-w-xl gap-6 sm:grid-cols-2">
      <nav aria-label="Rows" className="flex flex-col gap-0.5">
        {items.map(([l, I]) => <NavItem key={l} active={active === l} onClick={() => setActive(l)} className="items-center"><I className="size-4" /> {l}</NavItem>)}
      </nav>
      <nav aria-label="Pills" className="flex flex-wrap gap-1">
        {items.map(([l]) => <NavItem key={l} variant="pill" active={active === l} onClick={() => setActive(l)}>{l}</NavItem>)}
      </nav>
    </div>
  );
}
