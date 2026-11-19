"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeftIcon, CheckIcon, LayoutGridIcon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@recanica/ui/components/command";
import { Kbd } from "@recanica/ui/components/kbd";
import { demoGroups } from "@/lib/demo-pages";

/**
 * Floating page menu for the demos: one button, bottom right, on every demo page.
 * Opens a searchable list of every page (website, dashboard, customer side, UI kit, sections). ⌘J / Ctrl+J toggles it.
 */
export function PageMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen((o) => !o); }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const current = demoGroups.flatMap((g) => g.pages).find((p) => p.href === pathname);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        aria-label="All demo pages (⌘J)"
        className="fixed right-4 bottom-4 z-50 size-11 rounded-full p-0 shadow-float lg:w-auto lg:gap-2 lg:pr-3 lg:pl-3.5"
        data-page-menu
      >
        <LayoutGridIcon />
        <span className="hidden max-w-40 truncate lg:inline">{current?.label ?? "Pages"}</span>
        <Kbd className="hidden bg-primary-foreground/15 text-primary-foreground lg:inline-flex">⌘J</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="All demo pages" description="Jump to any page in the demos">
        <CommandInput placeholder="Find a page: invoice, pricing, forms…" />
        <CommandList className="max-h-[min(28rem,70svh)]">
          <CommandEmpty>No page found.</CommandEmpty>
          <CommandGroup>
            <CommandItem value="back design system docs home" onSelect={() => { setOpen(false); router.push("/docs"); }}>
              <ArrowLeftIcon /> Back to the design system
            </CommandItem>
          </CommandGroup>
          {demoGroups.map((g) => (
            <CommandGroup key={g.title} heading={g.title}>
              {g.pages.map((p) => (
                <CommandItem key={p.href} value={`${g.title} ${p.label} ${p.href}`} onSelect={() => { setOpen(false); router.push(p.href); }}>
                  <span className="truncate">{p.label}</span>
                  {p.href === pathname && <CheckIcon className="ml-auto" />}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
