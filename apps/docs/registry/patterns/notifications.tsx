"use client";

import * as React from "react";
import { BellIcon, CheckCheckIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@rekanica/ui/components/avatar";
import { Button } from "@rekanica/ui/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@rekanica/ui/components/popover";
import { ScrollArea } from "@rekanica/ui/components/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@rekanica/ui/components/tabs";
import { cn } from "@rekanica/ui/lib/utils";

const seed = [
  { id: 1, who: "Nadia Rahman", initials: "NR", text: "purchased Pro Yearly", time: "2m", unread: true },
  { id: 2, who: "Leo Tan", initials: "LT", text: "renewed Pro Monthly", time: "1h", unread: true },
  { id: 3, who: "Sam Ortiz", initials: "SO", text: "canceled their subscription", time: "3h", unread: false },
  { id: 4, who: "Payouts", initials: "$", text: "$1,206 is on its way", time: "1d", unread: false },
];

export default function Notifications() {
  const [items, setItems] = React.useState(seed);
  const [tab, setTab] = React.useState("all");
  const unread = items.filter((i) => i.unread).length;
  const shown = tab === "unread" ? items.filter((i) => i.unread) : items;

  return (
    <div className="flex min-h-[520px] items-start justify-center px-gutter pt-10">
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="relative" aria-label="Notifications">
            <BellIcon />
            {unread > 0 && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-foreground" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[min(22rem,calc(100vw-2rem))] p-0" align="center">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <p className="text-sm">Notifications</p>
            <Button variant="ghost" size="sm" disabled={!unread} onClick={() => setItems((x) => x.map((i) => ({ ...i, unread: false })))}>
              <CheckCheckIcon /> Mark all read
            </Button>
          </div>
          <div className="px-4 pt-3">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread {unread > 0 && `(${unread})`}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <ScrollArea className="h-72">
            <ul className="p-2">
              {shown.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => setItems((x) => x.map((i) => (i.id === n.id ? { ...i, unread: false } : i)))}
                    className="flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-accent"
                  >
                    <Avatar className="size-8"><AvatarFallback>{n.initials}</AvatarFallback></Avatar>
                    <span className="flex-1 text-sm">
                      <span>{n.who}</span> <span className="text-muted-foreground">{n.text}</span>
                      <span className="block text-xs text-muted-foreground">{n.time} ago</span>
                    </span>
                    <span className={cn("mt-1.5 size-2 rounded-full", n.unread ? "bg-foreground" : "bg-transparent")} />
                  </button>
                </li>
              ))}
              {shown.length === 0 && <li className="py-12 text-center text-sm text-muted-foreground">You're all caught up.</li>}
            </ul>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}
