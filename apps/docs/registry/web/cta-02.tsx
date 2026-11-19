"use client";

import * as React from "react";
import { Button } from "@rekanica/ui/components/button";
import { Input } from "@rekanica/ui/components/input";

export function Cta02() {
  const [done, setDone] = React.useState(false);
  return (
    <section className="px-gutter py-section-sm">
      <div className="mx-auto flex max-w-content flex-col gap-6 rounded-3xl border bg-card p-6 sm:p-10 md:flex-row md:items-center">
        <div className="flex-1">
          <h2 className="text-heading">One useful email a month</h2>
          <p className="mt-1 text-sm text-muted-foreground">Tax deadlines, product updates and one customer story. No spam.</p>
        </div>
        {done ? (
          <p className="text-sm">You&apos;re subscribed. See you next month.</p>
        ) : (
          <form className="flex w-full flex-col gap-2 sm:flex-row md:w-auto" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
            <Input type="email" required placeholder="you@example.com" aria-label="Email" className="md:w-64" />
            <Button type="submit" className="shrink-0">Subscribe</Button>
          </form>
        )}
      </div>
    </section>
  );
}

export default Cta02;
