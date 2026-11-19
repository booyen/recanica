"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@recanica/ui/components/command";
import { Kbd, KbdGroup } from "@recanica/ui/components/kbd";
import { nav } from "@/lib/docs";

export function SearchCommand() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !(e.target instanceof HTMLInputElement))) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setOpen(true)}
        aria-label="Search docs (⌘K)"
        className="h-9 w-9 justify-center px-0 text-muted-foreground sm:w-56 sm:justify-start sm:px-3 md:w-64"
      >
        <SearchIcon />
        <span className="hidden flex-1 text-left font-normal sm:inline">Search docs…</span>
        <KbdGroup className="hidden sm:flex"><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search components, patterns, blocks…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          {nav.map((s) => (
            <CommandGroup key={s.title} heading={s.title}>
              {s.groups.flatMap((g) => g.items).map((l) => (
                <CommandItem key={l.href} value={`${s.title} ${l.title}`} onSelect={() => { setOpen(false); router.push(l.href); }}>
                  {l.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
