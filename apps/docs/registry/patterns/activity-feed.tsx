"use client";

import { CreditCardIcon, RefreshCwIcon, UserPlusIcon, XCircleIcon } from "lucide-react";
import { Badge } from "@rekanica/ui/components/badge";
import { Button } from "@rekanica/ui/components/button";

const days = [
  {
    label: "Today",
    events: [
      { icon: CreditCardIcon, title: "Order paid", who: "Nadia Rahman", meta: "Pro Yearly · $480.00", time: "2:14 PM" },
      { icon: UserPlusIcon, title: "New customer", who: "Arjun Mehta", meta: "via Black Friday link", time: "1:02 PM" },
      { icon: XCircleIcon, title: "Subscription canceled", who: "Sam Ortiz", meta: "Ends 18 Dec", time: "9:40 AM", tone: "destructive" as const },
    ],
  },
  {
    label: "Yesterday",
    events: [
      { icon: RefreshCwIcon, title: "Subscription renewed", who: "Leo Tan", meta: "Pro Monthly · $48.00", time: "6:30 PM" },
      { icon: CreditCardIcon, title: "Order paid", who: "Mei Kato", meta: "Starter · $12.00", time: "11:05 AM" },
    ],
  },
];

export default function ActivityFeed() {
  return (
    <div className="mx-auto max-w-narrow space-y-8 px-gutter py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-title">Activity</h1>
        <Button variant="outline" size="sm">Export</Button>
      </div>
      {days.map((d) => (
        <section key={d.label}>
          <h2 className="mb-3 text-sm text-muted-foreground">{d.label}</h2>
          <ol className="relative space-y-1 before:absolute before:top-2 before:bottom-2 before:left-[17px] before:w-px before:bg-border">
            {d.events.map((e, i) => (
              <li key={i} className="relative flex gap-4 rounded-xl py-2 pr-2">
                <span className="z-10 flex size-9 shrink-0 items-center justify-center rounded-full border bg-panel">
                  <e.icon className="size-4 text-muted-foreground" />
                </span>
                <div className="min-w-0 flex-1 pt-1">
                  <p className="flex flex-wrap items-center gap-x-2 text-sm">
                    {e.title} <span className="text-muted-foreground">{e.who}</span>
                    {e.tone && <Badge variant="destructive">Churn</Badge>}
                  </p>
                  <p className="text-xs text-muted-foreground">{e.meta}</p>
                </div>
                <time className="shrink-0 pt-1 text-xs text-muted-foreground tabular-nums">{e.time}</time>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
