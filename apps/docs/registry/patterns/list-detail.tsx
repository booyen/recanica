"use client";

import * as React from "react";
import { ArrowLeftIcon, CopyIcon, LinkIcon, PlusIcon } from "lucide-react";
import { Badge } from "@recanica/ui/components/badge";
import { Button } from "@recanica/ui/components/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@recanica/ui/components/empty";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@recanica/ui/components/select";
import { Separator } from "@recanica/ui/components/separator";
import { cn } from "@recanica/ui/lib/utils";

const links = [
  { id: "1", label: "Black Friday", product: "Pro Yearly", visits: 1240, conversions: 86, active: true },
  { id: "2", label: "Newsletter", product: "Pro Monthly", visits: 420, conversions: 31, active: true },
  { id: "3", label: "Partner: Lumen", product: "Team", visits: 96, conversions: 4, active: false },
];

export default function ListDetail() {
  const [selected, setSelected] = React.useState<string | null>(null);
  const link = links.find((l) => l.id === selected);

  return (
    <div className="flex min-h-[560px] flex-col gap-2 p-2 md:flex-row">
      {/* List column: full width on mobile, hidden while a detail is open */}
      <section className={cn("flex flex-col rounded-2xl border bg-panel md:w-80 md:shrink-0", link && "hidden md:flex")}>
        <header className="flex items-center justify-between border-b px-4 py-3">
          <h2>Checkout Links</h2>
          <Button size="icon-sm" aria-label="New link"><PlusIcon /></Button>
        </header>
        <div className="p-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All products</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="team">Team</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ul className="flex flex-col gap-0.5 px-2 pb-2">
          {links.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => setSelected(l.id)}
                className={cn("flex w-full flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-accent", selected === l.id && "bg-accent")}
              >
                <span className="flex items-center justify-between text-sm">
                  {l.label}
                  {!l.active && <Badge variant="muted">Paused</Badge>}
                </span>
                <span className="text-xs text-muted-foreground">{l.product} · {l.conversions} sales</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Detail pane */}
      <section className={cn("flex-1 rounded-2xl border bg-panel", !link && "hidden md:block")}>
        {link ? (
          <div className="space-y-6 p-6">
            <Button variant="ghost" size="sm" className="-ml-2 md:hidden" onClick={() => setSelected(null)}><ArrowLeftIcon /> Back</Button>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-title">{link.label}</h1>
                <p className="text-sm text-muted-foreground">{link.product}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline"><CopyIcon /> Copy link</Button>
                <Button>Edit</Button>
              </div>
            </div>
            <Separator />
            <dl className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              {[["Visits", link.visits.toLocaleString()], ["Sales", link.conversions], ["Conversion", `${((link.conversions / link.visits) * 100).toFixed(1)}%`]].map(([k, v]) => (
                <div key={k as string}>
                  <dt className="text-sm text-muted-foreground">{k}</dt>
                  <dd className="text-metric font-light">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : (
          <Empty className="h-full">
            <EmptyHeader>
              <EmptyMedia variant="icon"><LinkIcon /></EmptyMedia>
              <EmptyTitle>Select a checkout link</EmptyTitle>
              <EmptyDescription>Or create a new one to share with your customers.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent><Button>Create checkout link</Button></EmptyContent>
          </Empty>
        )}
      </section>
    </div>
  );
}
