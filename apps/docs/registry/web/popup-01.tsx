"use client";

import * as React from "react";
import { Button } from "@recanica/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@recanica/ui/components/dialog";
import { Input } from "@recanica/ui/components/input";

export function Popup01() {
  const [open, setOpen] = React.useState(true);
  const [done, setDone] = React.useState(false);
  return (
    <div className="flex min-h-[560px] items-center justify-center bg-background p-6">
      <Button variant="outline" onClick={() => { setDone(false); setOpen(true); }}>Show popup</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-md">
          <div className="h-28 bg-brand text-brand-foreground" aria-hidden />
          <div className="space-y-4 p-6">
            <DialogHeader>
              <DialogTitle>{done ? "Check your inbox" : "RM20 off your first order"}</DialogTitle>
              <DialogDescription>
                {done ? "Your code is on its way. It's valid for 14 days." : "Join the newsletter for the code, plus one email a month on new arrivals. Unsubscribe anytime."}
              </DialogDescription>
            </DialogHeader>
            {done ? (
              <Button className="w-full" onClick={() => setOpen(false)}>Continue shopping</Button>
            ) : (
              <form className="flex flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
                <Input type="email" required placeholder="you@example.com" aria-label="Email" />
                <Button type="submit" className="shrink-0">Get my code</Button>
              </form>
            )}
            {!done && <button onClick={() => setOpen(false)} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">No thanks</button>}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Popup01;
