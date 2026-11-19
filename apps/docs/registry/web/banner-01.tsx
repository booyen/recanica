"use client";

import * as React from "react";
import { ArrowRightIcon, XIcon } from "lucide-react";
import { Button } from "@rekanica/ui/components/button";

function useCountdown(target: number) {
  const [now, setNow] = React.useState<number | null>(null);
  React.useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const left = Math.max(0, target - (now ?? target));
  return { d: Math.floor(left / 864e5), h: Math.floor(left / 36e5) % 24, m: Math.floor(left / 6e4) % 60, s: Math.floor(left / 1e3) % 60, ready: now !== null };
}

export function Banner01() {
  const [open, setOpen] = React.useState(true);
  const [target] = React.useState(() => Date.now() + 2 * 864e5 + 5 * 36e5);
  const t = useCountdown(target);
  return (
    <div className="space-y-10">
      {open && (
        <div className="flex items-center gap-3 border-b bg-foreground px-gutter py-2 text-sm text-background">
          <p className="flex-1 text-center">
            Year-end sale: 20% off all annual plans until 31 December. <a href="#" className="underline underline-offset-4">See plans</a>
          </p>
          <button aria-label="Dismiss announcement" onClick={() => setOpen(false)} className="rounded-full p-1 opacity-70 hover:opacity-100"><XIcon className="size-4" /></button>
        </div>
      )}
      <section className="px-gutter">
        <div className="mx-auto flex max-w-content flex-col gap-6 rounded-3xl border bg-card p-6 sm:p-10 md:flex-row md:items-center">
          <div className="flex-1 space-y-2">
            <p className="text-sm text-muted-foreground">Ends in</p>
            <div className="flex gap-3 tabular-nums" aria-live="polite">
              {[["d", t.d], ["h", t.h], ["m", t.m], ["s", t.s]].map(([k, v]) => (
                <div key={k as string} className="min-w-14 rounded-xl border bg-panel px-3 py-2 text-center">
                  <span className="block text-2xl font-light">{t.ready ? String(v).padStart(2, "0") : "--"}</span>
                  <span className="text-xs text-muted-foreground">{k}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <h2 className="text-heading">Annual plans, 20% off</h2>
            <p className="text-muted-foreground">Lock in this year&apos;s price for the next 12 months. Applies to new and upgrading customers.</p>
            <Button variant="brand">Claim the discount <ArrowRightIcon /></Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Banner01;
