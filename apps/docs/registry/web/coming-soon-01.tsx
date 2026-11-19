"use client";

import * as React from "react";
import { Button } from "@rekanica/ui/components/button";
import { Input } from "@rekanica/ui/components/input";

export function ComingSoon01() {
  const [done, setDone] = React.useState(false);
  const [target] = React.useState(() => Date.now() + 18 * 864e5);
  const [now, setNow] = React.useState<number | null>(null);
  React.useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const left = Math.max(0, target - (now ?? target));
  const parts = [["days", Math.floor(left / 864e5)], ["hours", Math.floor(left / 36e5) % 24], ["min", Math.floor(left / 6e4) % 60], ["sec", Math.floor(left / 1e3) % 60]];
  return (
    <div className="flex min-h-[640px] items-center justify-center bg-background px-gutter py-12">
      <div className="w-full max-w-lg space-y-8 text-center">
        <span className="mx-auto block size-10 rounded-xl bg-metallic" />
        <div className="space-y-3">
          <h1 className="text-display-sm tracking-tight">Our online shop opens soon</h1>
          <p className="text-muted-foreground">We&apos;re photographing 40 products and writing the delivery rules. Leave your email and we&apos;ll tell you the day it opens.</p>
        </div>
        <div className="flex justify-center gap-3 tabular-nums">
          {parts.map(([k, v]) => <div key={k as string} className="w-16 rounded-xl border bg-panel py-2"><span className="block text-2xl font-light">{now === null ? "--" : String(v).padStart(2, "0")}</span><span className="text-xs text-muted-foreground">{k}</span></div>)}
        </div>
        {done ? <p className="text-sm">You&apos;re on the list.</p> : (
          <form className="mx-auto flex max-w-sm flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
            <Input type="email" required placeholder="you@example.com" aria-label="Email" />
            <Button type="submit" className="shrink-0">Notify me</Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ComingSoon01;
