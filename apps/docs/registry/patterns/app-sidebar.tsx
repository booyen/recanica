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
    <div className="flex h-full flex-col gap-1 p-3">
      <div className="mb-4 flex items-center justify-between px-2 py-1">
        <span className="size-6 rounded-md bg-brand text-brand-foreground" aria-label="Aturanica" />
        <div className="flex">
          <Button size="icon-sm" variant="ghost" aria-label="Notifications"><BellIcon /></Button>
          <Button size="icon-sm" variant="ghost" aria-label="Search"><SearchIcon /></Button>
          {onHide && <Button size="icon-sm" variant="ghost" aria-label="Hide sidebar (⌘B)" title="Hide sidebar (⌘B)" onClick={onHide}><PanelLeftCloseIcon /></Button>}
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
          <a href="#" className="mt-3 inline-block font-medium text-brand">Upgrade</a>
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
        <main className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto rounded-2xl border bg-panel p-6 text-sm text-muted-foreground">
          {active}
        </main>
      </div>
    </div>
  );
}
