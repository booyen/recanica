"use client";

import * as React from "react";
import { Calendar } from "@recanica/ui/components/calendar";
import { PageHeader } from "@/components/demo/ui";
import { dmy, invoiceGrand, money2, useDemo } from "@/lib/demo/store";

export default function CalendarPage() {
  const { state } = useDemo();
  const [day, setDay] = React.useState<Date | undefined>(new Date(2026, 11, 1));
  const items = [
    ...state.invoices.filter((i) => i.status === "open" || i.status === "partial").flatMap((i) => (i.plan ? i.plan.filter((p) => !p.paidAt).map((p) => ({ date: p.dueAt, title: `${i.number} · ${p.label}`, amount: p.amount })) : [{ date: i.dueAt, title: `${i.number} due`, amount: invoiceGrand(i) }])),
    ...state.subscriptions.filter((s) => s.status === "active").map((s) => ({ date: s.renewsAt, title: `Renewal · ${state.products.find((p) => p.id === s.productId)?.name}`, amount: state.products.find((p) => p.id === s.productId)?.price ?? 0 })),
  ];
  const same = (a: Date, iso: string) => { const b = new Date(iso); return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); };
  const onDay = day ? items.filter((i) => same(day, i.date)) : [];
  const upcoming = items.filter((i) => new Date(i.date).getTime() >= Date.now() - 864e5).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 8);
  return (
    <>
      <PageHeader title="Calendar" description="Invoice due dates, instalments and subscription renewals." />
      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <Calendar mode="single" selected={day} onSelect={setDay} defaultMonth={day} modifiers={{ due: items.map((i) => new Date(i.date)) }} modifiersClassNames={{ due: "font-medium underline underline-offset-4" }} className="rounded-2xl border bg-card" />
        <div className="space-y-6">
          <section>
            <h2 className="mb-2 text-sm text-muted-foreground">{day ? dmy(day.toISOString()) : "Pick a day"}</h2>
            {onDay.length ? <ul className="divide-y rounded-2xl border bg-card">{onDay.map((i) => <li key={i.title} className="flex justify-between gap-4 p-4 text-sm"><span>{i.title}</span><span className="tabular-nums">{money2(i.amount)}</span></li>)}</ul> : <p className="text-sm text-muted-foreground">Nothing due.</p>}
          </section>
          <section>
            <h2 className="mb-2 text-sm text-muted-foreground">Upcoming</h2>
            <ul className="divide-y rounded-2xl border bg-card">{upcoming.map((i) => <li key={i.title + i.date} className="flex gap-4 p-4 text-sm"><span className="w-24 shrink-0 text-muted-foreground tabular-nums">{dmy(i.date)}</span><span className="flex-1">{i.title}</span><span className="tabular-nums">{money2(i.amount)}</span></li>)}</ul>
          </section>
        </div>
      </div>
    </>
  );
}
