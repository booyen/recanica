"use client";

import * as React from "react";
import { BoxIcon, LayoutGridIcon, UsersIcon } from "lucide-react";
import { AppPanel, AppShell, AppSidebar, AppSidebarHeader, AppSidebarSub } from "@recanica/ui/components/app-shell";
import { NavItem } from "@recanica/ui/components/nav-item";

export default function AppShellDemo() {
  const [active, setActive] = React.useState("Catalogue");
  return (
    <div className="@container w-full overflow-hidden rounded-2xl border [&>[data-slot=app-shell]]:h-80">
      <AppShell
        sidebar={
          <aside className="hidden w-52 shrink-0 @lg:block">
            <AppSidebar>
              <AppSidebarHeader><span className="size-5 rounded-md bg-brand" aria-label="Logo" /></AppSidebarHeader>
              <NavItem variant="sidebar" active={active === "Overview"} onClick={() => setActive("Overview")}><LayoutGridIcon className="size-4" /> Overview</NavItem>
              <NavItem variant="sidebar" active={["Catalogue", "Discounts"].includes(active)} onClick={() => setActive("Catalogue")}><BoxIcon className="size-4" /> Products</NavItem>
              <AppSidebarSub>
                {["Catalogue", "Discounts"].map((c) => <NavItem key={c} variant="sub" active={active === c} onClick={() => setActive(c)}>{c}</NavItem>)}
              </AppSidebarSub>
              <NavItem variant="sidebar" active={active === "Customers"} onClick={() => setActive("Customers")}><UsersIcon className="size-4" /> Customers</NavItem>
            </AppSidebar>
          </aside>
        }
      >
        <div className="flex min-w-0 flex-1 flex-col p-2 @lg:pl-0">
          <AppPanel className="flex items-center justify-center text-sm text-muted-foreground">{active}</AppPanel>
        </div>
      </AppShell>
    </div>
  );
}
