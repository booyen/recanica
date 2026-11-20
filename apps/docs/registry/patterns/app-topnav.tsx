"use client";

import * as React from "react";
import { BellIcon, ChevronDownIcon, MenuIcon, SearchIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@recanica/ui/components/avatar";
import { Button } from "@recanica/ui/components/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@recanica/ui/components/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@recanica/ui/components/sheet";
import { cn } from "@recanica/ui/lib/utils";
import { NavItem } from "@recanica/ui/components/nav-item";

const items = ["Overview", "Products", "Customers", "Invoices", "Analytics", "Sales", "Finance", "Settings"];

/**
 * Priority+ navigation: items stay on one line and never wrap.
 * Whatever does not fit moves into a "More" menu, measured live with a ResizeObserver,
 * so the bar works in any container width, not just at fixed breakpoints.
 */
function usePriorityNav(count: number) {
  const bar = React.useRef<HTMLDivElement>(null);
  const measure = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(count);

  React.useLayoutEffect(() => {
    const el = bar.current;
    const m = measure.current;
    if (!el || !m) return;
    const fit = () => {
      const widths = Array.from(m.children).map((c) => (c as HTMLElement).offsetWidth);
      const more = widths.pop() ?? 0; // last child is the "More" button
      const gap = 4;
      const available = el.clientWidth;
      let used = 0;
      let n = 0;
      for (const w of widths) {
        const next = used + w + (n ? gap : 0);
        const needMore = n + 1 < widths.length;
        if (next + (needMore ? more + gap : 0) > available) break;
        used = next;
        n++;
      }
      setVisible(n);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [count]);

  return { bar, measure, visible };
}

const itemClass = (on: boolean) =>
  cn(
    "shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
    on && "bg-accent text-foreground"
  );

export default function AppTopNav() {
  const [active, setActive] = React.useState("Invoices");
  const [sheet, setSheet] = React.useState(false);
  const { bar, measure, visible } = usePriorityNav(items.length);
  const shown = items.slice(0, visible);
  const overflow = items.slice(visible);
  const activeInOverflow = overflow.includes(active);

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-content items-center gap-3 px-gutter">
          <Sheet open={sheet} onOpenChange={setSheet}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu" className="md:hidden"><MenuIcon /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-3">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <nav className="mt-10 flex flex-col gap-0.5">
                {items.map((i) => (
                  <NavItem key={i} active={active === i} onClick={() => { setActive(i); setSheet(false); }} className="py-2">
                    {i}
                  </NavItem>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <span className="size-6 shrink-0 rounded-md bg-brand" aria-label="Aturanica" />

          {/* Measuring row: same items, invisible, used to decide what fits. */}
          <div ref={measure} aria-hidden className="pointer-events-none invisible absolute flex gap-1">
            {items.map((i) => <span key={i} className={itemClass(false)}>{i}</span>)}
            <span className={cn(itemClass(false), "inline-flex items-center gap-1")}>More <ChevronDownIcon className="size-3.5" /></span>
          </div>

          <nav ref={bar} aria-label="Main" className="hidden min-w-0 flex-1 items-center gap-1 overflow-hidden md:flex">
            {shown.map((i) => (
              <NavItem key={i} variant="pill" active={active === i} onClick={() => setActive(i)}>
                {i}
              </NavItem>
            ))}
            {overflow.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger className={cn(itemClass(activeInOverflow), "inline-flex items-center gap-1")}>
                  {activeInOverflow ? active : "More"} <ChevronDownIcon className="size-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {overflow.map((i) => <DropdownMenuItem key={i} onSelect={() => setActive(i)}>{i}</DropdownMenuItem>)}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          <span className="flex-1 truncate text-sm md:hidden">{active}</span>
          <div className="flex shrink-0 items-center gap-1">
            <Button size="icon-sm" variant="ghost" aria-label="Search"><SearchIcon /></Button>
            <Button size="icon-sm" variant="ghost" aria-label="Notifications"><BellIcon /></Button>
            <Avatar className="ml-1 size-7"><AvatarFallback>AS</AvatarFallback></Avatar>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-content flex-1 px-gutter py-8">
        <div className="flex min-h-64 items-center justify-center rounded-2xl border bg-panel text-sm text-muted-foreground">{active}</div>
      </main>
    </div>
  );
}
