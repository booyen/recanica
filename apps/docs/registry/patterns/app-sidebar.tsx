"use client";

import * as React from "react";
import {
  ArrowUpRightIcon, BellIcon, BoxIcon, ChevronDownIcon, DollarSignIcon, LayoutGridIcon, LifeBuoyIcon, MenuIcon, PanelLeftCloseIcon, PanelLeftOpenIcon,
  SearchIcon, ShoppingBagIcon, SlidersHorizontalIcon, TrendingUpIcon, UsersIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@recanica/ui/components/avatar";
import { Button } from "@recanica/ui/components/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@recanica/ui/components/sheet";
import { cn } from "@recanica/ui/lib/utils";
import { Surface } from "@recanica/ui/components/surface";
import { NavItem } from "@recanica/ui/components/nav-item";
import { AppSidebar as SidebarColumn, AppSidebarHeader, AppSidebarSub } from "@recanica/ui/components/app-shell";

const nav = [
  { label: "Overview", icon: LayoutGridIcon },
  { label: "Products", icon: BoxIcon, children: ["Catalogue", "Checkout Links", "Discounts", "Benefits", "Meters"] },
  { label: "Customers", icon: UsersIcon },
  { label: "Analytics", icon: TrendingUpIcon },
  { label: "Sales", icon: ShoppingBagIcon },
  { label: "Finance", icon: DollarSignIcon },
  { label: "Settings", icon: SlidersHorizontalIcon },
];

function SidebarContents({ active, onSelect, onHide }: { active: string; onSelect: (v: string) => void; onHide?: () => void }) {
  return (
    <SidebarColumn>
      <AppSidebarHeader>
        <span className="size-6 rounded-md bg-brand text-brand-foreground" aria-label="Aturanica" />
        <div className="flex">
          <Button size="icon-sm" variant="ghost" aria-label="Notifications"><BellIcon /></Button>
          <Button size="icon-sm" variant="ghost" aria-label="Search"><SearchIcon /></Button>
          {onHide && <Button size="icon-sm" variant="ghost" aria-label="Hide sidebar (⌘B)" title="Hide sidebar (⌘B)" onClick={onHide}><PanelLeftCloseIcon /></Button>}
        </div>
      </AppSidebarHeader>
      <nav className="flex flex-col gap-0.5">
        {nav.map((n) => {
          const open = n.label === active || n.children?.includes(active);
          return (
            <div key={n.label}>
              <NavItem variant="sidebar" active={open} onClick={() => onSelect(n.children ? n.children[0] : n.label)}>
                <n.icon className="size-4" /> {n.label}
              </NavItem>
              {n.children && open && (
                <AppSidebarSub>
                  {n.children.map((c) => (
                    <NavItem key={c} variant="sub" active={active === c} onClick={() => onSelect(c)}>
                      {c}
                    </NavItem>
                  ))}
                </AppSidebarSub>
              )}
            </div>
          );
        })}
      </nav>
      <div className="mt-auto space-y-1 pt-6">
        <Surface size="sm" tone="panel" inset="sm" className="mb-3 text-sm">
          <p>Introducing Aturanica Pro</p>
          <p className="mt-1 text-muted-foreground">Lower fees with a subscription plan.</p>
          <a href="/demo/app/settings" className="mt-3 inline-block font-medium text-brand">Upgrade</a>
        </Surface>
        <NavItem variant="sidebar" as="a" href="/demo/app/support"><LifeBuoyIcon className="size-4" /> Support</NavItem>
        <NavItem variant="sidebar" as="a" href="/docs"><ArrowUpRightIcon className="size-4" /> Documentation</NavItem>
        <NavItem variant="sidebar" className="mt-2 rounded-none border-t px-2 pt-3">
          <Avatar className="size-7"><AvatarFallback>AS</AvatarFallback></Avatar>
          <span className="truncate">Acme Studio</span>
          <ChevronDownIcon className="ml-auto size-4 text-muted-foreground" />
        </NavItem>
      </div>
    </SidebarColumn>
  );
}

export default function AppSidebar() {
  const [active, setActive] = React.useState("Checkout Links");
  const [open, setOpen] = React.useState(false);
  // Desktop: the sidebar can be hidden to give the content full width. ⌘B / Ctrl+B toggles it.
  const [hidden, setHidden] = React.useState(false);
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "b" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setHidden((h) => !h); }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  return (
    <div className="flex h-svh overflow-hidden bg-sidebar">
      <aside
        inert={hidden || undefined}
        className={cn("hidden h-full shrink-0 overflow-hidden transition-[width] duration-200 ease-out motion-reduce:transition-none md:block", hidden ? "w-0" : "w-sidebar")}
      >
        <div className="h-full w-sidebar overflow-y-auto">
          <SidebarContents active={active} onSelect={setActive} onHide={() => setHidden(true)} />
        </div>
      </aside>
      <div className={cn("flex min-h-0 min-w-0 flex-1 flex-col p-2", !hidden && "md:pl-0")}>
        <header className={cn("flex shrink-0 items-center gap-2 px-2 pb-2", !hidden && "md:hidden")}>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild><Button variant="ghost" size="icon" aria-label="Open menu" className="md:hidden"><MenuIcon /></Button></SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarContents active={active} onSelect={(v) => { setActive(v); setOpen(false); }} />
            </SheetContent>
          </Sheet>
          <Button variant="ghost" size="icon" aria-label="Show sidebar (⌘B)" title="Show sidebar (⌘B)" className="hidden md:inline-flex" onClick={() => setHidden(false)}><PanelLeftOpenIcon /></Button>
          <span className="size-5 rounded-md bg-brand text-brand-foreground" />
          <span className="text-sm">{active}</span>
        </header>
        <main /* recanica-ignore: app shell content panel */ className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto rounded-2xl border bg-panel p-6 text-sm text-muted-foreground">
          {active}
        </main>
      </div>
    </div>
  );
}
