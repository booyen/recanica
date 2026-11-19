"use client";

import * as React from "react";
import Link from "next/link";
import { DownloadIcon, LogOutIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@rekanica/ui/components/badge";
import { Button } from "@rekanica/ui/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@rekanica/ui/components/tabs";
import { InvoiceBadge } from "@/components/demo/ui";
import { date, dmy, invoiceBalance, invoiceGrand, isOverdue, money2, price, useDemo } from "@/lib/demo/store";

// Customer-facing portal: what Syarikat Maju Jaya sees when they sign in to pay Acme Studio.
const CUSTOMER = "cus_3";

export default function PortalPage() {
  const { state, dispatch } = useDemo();
  const c = state.customers.find((x) => x.id === CUSTOMER);
  const invoices = state.invoices.filter((i) => i.customerId === CUSTOMER && i.status !== "draft");
  const subs = state.subscriptions.filter((s) => s.customerId === CUSTOMER);
  const orders = state.orders.filter((o) => o.customerId === CUSTOMER);
  const due = invoices.reduce((a, i) => a + invoiceBalance(i), 0);
  if (!c) return null;
  return (
    <div className="min-h-svh bg-background">
      <header className="border-b px-gutter">
        <div className="mx-auto flex h-16 max-w-narrow items-center gap-3">
          <span className="size-6 rounded-md bg-metallic" /><span>{state.org.name}</span><span className="text-sm text-muted-foreground">· Customer portal</span>
          <Button variant="ghost" size="icon" className="ml-auto" aria-label="Sign out" asChild><Link href="/demo"><LogOutIcon /></Link></Button>
        </div>
      </header>
      <main className="mx-auto max-w-narrow space-y-8 px-gutter py-10">
        <div>
          <p className="text-sm text-muted-foreground">Signed in as {c.email}</p>
          <h1 className="text-title">{c.name}</h1>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:flex-row sm:items-center">
          <div className="flex-1"><p className="text-sm text-muted-foreground">Amount due</p><p className="text-metric font-light tabular-nums">{money2(due)}</p></div>
          {due > 0 && <Button asChild variant="brand"><Link href={`/demo/pay/${invoices.find((i) => invoiceBalance(i) > 0)?.id}`}>Pay now</Link></Button>}
        </div>
        <Tabs defaultValue="invoices">
          <TabsList><TabsTrigger value="invoices">Invoices</TabsTrigger><TabsTrigger value="subscriptions">Subscriptions</TabsTrigger><TabsTrigger value="orders">Orders</TabsTrigger></TabsList>
          <TabsContent value="invoices" className="mt-4">
            <ul className="divide-y rounded-2xl border bg-card">
              {invoices.map((i) => (
                <li key={i.id} className="flex flex-wrap items-center gap-3 p-4 text-sm">
                  <div className="flex-1"><p className="font-mono text-xs">{i.number}</p><p className="text-muted-foreground">Issued {dmy(i.issuedAt)}</p></div>
                  <InvoiceBadge status={i.status} overdue={isOverdue(i)} />
                  <span className="w-28 text-right tabular-nums">{money2(invoiceGrand(i))}</span>
                  <Button variant="ghost" size="icon-sm" aria-label="Download PDF" onClick={() => toast("PDF download is simulated")}><DownloadIcon /></Button>
                  {invoiceBalance(i) > 0 && <Button size="sm" asChild><Link href={`/demo/pay/${i.id}`}>Pay</Link></Button>}
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="subscriptions" className="mt-4">
            <ul className="divide-y rounded-2xl border bg-card">
              {subs.map((s) => {
                const p = state.products.find((x) => x.id === s.productId);
                return (
                  <li key={s.id} className="flex flex-wrap items-center gap-3 p-4 text-sm">
                    <div className="flex-1"><p>{p?.name}</p><p className="text-muted-foreground">{p && price(p)} · {s.status === "active" ? `renews ${date(s.renewsAt)}` : `ends ${date(s.renewsAt)}`}</p></div>
                    <Badge variant={s.status === "active" ? "success" : "muted"}>{s.status === "active" ? "Active" : "Canceled"}</Badge>
                    {s.status === "active" && <Button variant="outline" size="sm" onClick={() => { dispatch({ type: "cancelSubscription", id: s.id }); toast("Subscription canceled. Access continues until the end of the period."); }}>Cancel</Button>}
                  </li>
                );
              })}
            </ul>
          </TabsContent>
          <TabsContent value="orders" className="mt-4">
            <ul className="divide-y rounded-2xl border bg-card">
              {orders.map((o) => <li key={o.id} className="flex justify-between gap-3 p-4 text-sm"><span>{state.products.find((p) => p.id === o.productId)?.name}<span className="block text-muted-foreground">{dmy(o.createdAt)}</span></span><span className="tabular-nums">{money2(o.amount)}</span></li>)}
            </ul>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
