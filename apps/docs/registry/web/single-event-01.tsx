"use client";

import * as React from "react";
import { CalendarIcon, CheckIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@recanica/ui/components/avatar";
import { Badge } from "@recanica/ui/components/badge";
import { Button } from "@recanica/ui/components/button";
import { Input } from "@recanica/ui/components/input";

const agenda = [
  ["2:00pm", "Arrival and coffee"], ["2:20pm", "What e-Invoice means for your business"], ["3:00pm", "Hands-on: set up your first validated invoice"], ["4:00pm", "Q&A with the LHDN-certified consultant"],
];
const speakers = [["Tan Wei Ming", "CTO, Acme"], ["Aisyah Karim", "Tax consultant"]];

export function SingleEvent01() {
  const [done, setDone] = React.useState(false);
  return (
    <section className="px-gutter py-section-sm">
      <div className="mx-auto grid max-w-content gap-10 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-10">
          <header className="space-y-4">
            <Badge variant="outline">Workshop</Badge>
            <h1 className="text-display-sm tracking-tight text-balance">e-Invoice clinic for small businesses</h1>
            <p className="max-w-copy text-muted-foreground">Bring your laptop and your last three invoices. You&apos;ll leave with e-Invoice set up and a checklist for your accountant.</p>
          </header>
          <div className="aspect-[16/9] rounded-3xl border bg-muted" role="img" aria-label="Venue photo" />
          <section>
            <h2 className="text-heading">Agenda</h2>
            <ol className="mt-4 divide-y border-y">{agenda.map(([t, a]) => <li key={t} className="flex gap-6 py-3 text-sm"><span className="w-16 shrink-0 font-mono text-muted-foreground">{t}</span>{a}</li>)}</ol>
          </section>
          <section>
            <h2 className="text-heading">Speakers</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">{speakers.map(([n, r]) => <li key={n} className="flex items-center gap-3 rounded-2xl border p-4"><Avatar className="size-10"><AvatarFallback>{n.split(" ").map((p) => p[0]).join("")}</AvatarFallback></Avatar><span className="text-sm">{n}<span className="block text-muted-foreground">{r}</span></span></li>)}</ul>
          </section>
        </div>
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="space-y-5 rounded-3xl border bg-card p-6">
            <dl className="space-y-3 text-sm">
              <div className="flex gap-3"><CalendarIcon className="size-4 text-muted-foreground" /><dd>Thu, 4 Dec 2026 · 2:00–4:30pm</dd></div>
              <div className="flex gap-3"><MapPinIcon className="size-4 text-muted-foreground" /><dd>Acme office, Level 12, Menara Contoh, Kuala Lumpur</dd></div>
              <div className="flex gap-3"><UsersIcon className="size-4 text-muted-foreground" /><dd>12 of 30 seats left</dd></div>
            </dl>
            <p className="text-metric font-light">Free</p>
            {done ? (
              <p className="flex items-center gap-2 text-sm"><CheckIcon className="size-4" /> You&apos;re registered. Details sent to your email.</p>
            ) : (
              <form className="grid gap-2" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
                <Input type="email" required placeholder="you@example.com" aria-label="Email" />
                <Button type="submit" variant="brand">Reserve a seat</Button>
              </form>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default SingleEvent01;
