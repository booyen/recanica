"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCheckIcon } from "lucide-react";
import { Button } from "@rekanica/ui/components/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@rekanica/ui/components/empty";
import { Tabs, TabsList, TabsTrigger } from "@rekanica/ui/components/tabs";
import { cn } from "@rekanica/ui/lib/utils";
import { PageHeader } from "@/components/demo/ui";
import { ago, useDemo } from "@/lib/demo/store";

export default function NotificationsPage() {
  const { state } = useDemo();
  const [read, setRead] = React.useState<Set<string>>(new Set());
  const [tab, setTab] = React.useState("all");
  const list = state.events.filter((e) => tab === "all" || (tab === "unread" ? !read.has(e.id) : e.type.startsWith(tab)));
  return (
    <>
      <PageHeader title="Notifications" actions={<Button variant="outline" onClick={() => setRead(new Set(state.events.map((e) => e.id)))}><CheckCheckIcon /> Mark all read</Button>} />
      <Tabs value={tab} onValueChange={setTab} className="mb-4"><TabsList>
        <TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="unread">Unread</TabsTrigger><TabsTrigger value="order">Orders</TabsTrigger><TabsTrigger value="invoice">Invoices</TabsTrigger>
      </TabsList></Tabs>
      {list.length === 0 ? (
        <Empty className="rounded-2xl border"><EmptyHeader><EmptyTitle>You&apos;re all caught up</EmptyTitle><EmptyDescription>New activity will show here.</EmptyDescription></EmptyHeader></Empty>
      ) : (
        <ul className="divide-y rounded-2xl border bg-card">
          {list.map((e) => {
            const unread = !read.has(e.id);
            const body = (
              <span className="flex items-start gap-3 p-4 text-sm">
                <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", unread ? "bg-foreground" : "bg-transparent")} aria-label={unread ? "Unread" : undefined} />
                <span className="flex-1">{e.title} {e.who && <span className="text-muted-foreground">· {e.who}</span>}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{ago(e.at)}</span>
              </span>
            );
            return (
              <li key={e.id} onClick={() => setRead((s) => new Set(s).add(e.id))}>
                {e.href ? <Link href={e.href} className="block hover:bg-accent/40">{body}</Link> : <div className="cursor-default">{body}</div>}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
