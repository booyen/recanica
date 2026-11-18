"use client";

import * as React from "react";
import {
  ArrowUpRightIcon, BellIcon, BoxIcon, ChevronDownIcon, DollarSignIcon, LayoutGridIcon, LifeBuoyIcon, MenuIcon,
  SearchIcon, ShoppingBagIcon, SlidersHorizontalIcon, TrendingUpIcon, UsersIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@rekanica/ui/components/avatar";
import { Button } from "@rekanica/ui/components/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@rekanica/ui/components/sheet";
import { cn } from "@rekanica/ui/lib/utils";

const nav = [
  { label: "Overview", icon: LayoutGridIcon },
  { label: "Products", icon: BoxIcon, children: ["Catalogue", "Checkout Links", "Discounts", "Benefits", "Meters"] },
  { label: "Customers", icon: UsersIcon },
  { label: "Analytics", icon: TrendingUpIcon },
  { label: "Sales", icon: ShoppingBagIcon },
  { label: "Finance", icon: DollarSignIcon },
  { label: "Settings", icon: SlidersHorizontalIcon },
];

function SidebarContents({ active, onSelect }: { active: string; onSelect: (v: string) => void }) {
  return (
    <div className="flex h-full flex-col gap-1 p-3">
      <div className="mb-4 flex items-center justify-between px-2 py-1">
        <span className="size-6 rounded-md bg-metallic" aria-label="Aturanica" />
        <div className="flex">
          <Button size="icon-sm" variant="ghost" aria-label="Notifications"><BellIcon /></Button>
          <Button size="icon-sm" variant="ghost" aria-label="Search"><SearchIcon /></Button>
        </div>
      </div>
      <nav className="flex flex-col gap-0.5">
        {nav.map((n) => {
          const open = n.label === active || n.children?.includes(active);
          return (
            <div key={n.label}>
              <button
                onClick={() => onSelect(n.children ? n.children[0] : n.label)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-sidebar-foreground transition-colors hover:text-foreground",
                  open && "bg-sidebar-accent text-foreground"
                )}
              >
                <n.icon className="size-4" /> {n.label}
              </button>
              {n.children && open && (
                <div className="my-1 ml-5 flex flex-col border-l pl-3">
                  {n.children.map((c) => (
                    <button
                      key={c}
                      onClick={() => onSelect(c)}
                      className={cn("py-1.5 text-left text-sm text-sidebar-foreground transition-colors hover:text-foreground", active === c && "text-foreground")}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="mt-auto space-y-1 pt-6">
        <div className="mb-3 rounded-xl border bg-panel p-4 text-sm">
          <p>Introducing Aturanica Pro</p>
          <p className="mt-1 text-muted-foreground">Lower fees with a subscription plan.</p>
          <a href="#" className="mt-3 inline-block font-medium text-metallic">Upgrade</a>
        </div>
        <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:text-foreground"><LifeBuoyIcon className="size-4" /> Support</a>
        <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:text-foreground"><ArrowUpRightIcon className="size-4" /> Documentation</a>
        <button className="mt-2 flex w-full items-center gap-3 border-t px-2 pt-3 text-sm">
          <Avatar className="size-7"><AvatarFallback>AS</AvatarFallback></Avatar>
          <span className="truncate">Acme Studio</span>
          <ChevronDownIcon className="ml-auto size-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

export default function AppSidebar() {
  const [active, setActive] = React.useState("Checkout Links");
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex h-svh overflow-hidden bg-sidebar">
      <aside className="hidden h-full w-sidebar shrink-0 overflow-y-auto md:block">
        <SidebarContents active={active} onSelect={setActive} />
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col p-2 md:pl-0">
        <header className="flex shrink-0 items-center gap-2 px-2 pb-2 md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild><Button variant="ghost" size="icon" aria-label="Open menu"><MenuIcon /></Button></SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarContents active={active} onSelect={(v) => { setActive(v); setOpen(false); }} />
            </SheetContent>
          </Sheet>
          <span className="size-5 rounded-md bg-metallic" />
          <span className="text-sm">{active}</span>
        </header>
        <main className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto rounded-2xl border bg-panel p-6 text-sm text-muted-foreground">
          {active}
        </main>
      </div>
    </div>
  );
}
