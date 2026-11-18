"use client";

import * as React from "react";
import { CheckIcon, SparklesIcon } from "lucide-react";
import { Button } from "@rekanica/ui/components/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@rekanica/ui/components/dropdown-menu";

export const FINISHES = [
  { value: "flat", label: "Flat", hint: "Solid brand color" },
  { value: "mesh", label: "Mesh", hint: "Soft silver mesh" },
  { value: "chrome", label: "Chrome", hint: "Linear brushed chrome" },
] as const;
export type Finish = (typeof FINISHES)[number]["value"];

const KEY = "rekanica-finish";

/** Inline script for <head>: restores the finish before paint. */
export const finishScript = `try{var f=localStorage.getItem("${KEY}");if(f)document.documentElement.dataset.finish=f}catch(e){}`;

export function useFinish() {
  const [finish, setState] = React.useState<Finish>("flat");
  React.useEffect(() => {
    setState((document.documentElement.dataset.finish as Finish) || "flat");
  }, []);
  const setFinish = (f: Finish) => {
    document.documentElement.dataset.finish = f;
    try { localStorage.setItem(KEY, f); } catch {}
    // Let same-origin preview iframes follow along.
    document.querySelectorAll("iframe").forEach((el) => {
      try { if (el.contentDocument) el.contentDocument.documentElement.dataset.finish = f; } catch {}
    });
    setState(f);
  };
  return { finish, setFinish };
}

export function FinishSwitcher() {
  const { finish, setFinish } = useFinish();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Brand finish"><SparklesIcon /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Brand finish</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {FINISHES.map((f) => (
          <DropdownMenuItem key={f.value} onSelect={() => setFinish(f.value)}>
            <span data-finish={f.value} className="size-4 rounded-full bg-metallic" />
            <span className="flex-1">
              {f.label}
              <span className="block text-xs text-muted-foreground">{f.hint}</span>
            </span>
            {finish === f.value && <CheckIcon />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
