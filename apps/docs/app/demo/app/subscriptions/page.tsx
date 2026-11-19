"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@recanica/ui/components/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@recanica/ui/components/table";
import { Tabs, TabsList, TabsTrigger } from "@recanica/ui/components/tabs";
import { PageHeader } from "@/components/demo/ui";
import { metrics, money, price, shortDate, useDemo } from "@/lib/demo/store";

export default function SubscriptionsPage() {
  const { state } = useDemo();
  const [tab, setTab] = React.useState("active");
  const m = metrics(state);
  const rows = state.subscriptions.filter((s) => tab === "all" || s.status === tab);

  return (
    <>
      <PageHeader title="Subscriptions" description={<>MRR <span className="text-foreground">{money(Math.round(m.mrr))}</span> across {m.activeSubs} active subscriptions.</>} />
      <Tabs value={tab} onValueChange={setTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="canceled">Canceled</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="overflow-hidden rounded-2xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Customer</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden text-right md:table-cell">Renews</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((s) => {
              const c = state.customers.find((x) => x.id === s.customerId);
              const p = state.products.find((x) => x.id === s.productId);
              return (
                <TableRow key={s.id}>
                  <TableCell className="pl-4">{c ? <Link className="hover:underline" href={`/demo/app/customers/${c.id}`}>{c.name}</Link> : "—"}</TableCell>
                  <TableCell>{p?.name}<span className="block text-xs text-muted-foreground">{p && price(p)}</span></TableCell>
                  <TableCell className="hidden sm:table-cell"><Badge variant={s.status === "active" ? "success" : "muted"}>{s.status === "active" ? "Active" : "Canceled"}</Badge></TableCell>
                  <TableCell className="hidden text-right text-muted-foreground md:table-cell">{s.status === "active" ? shortDate(s.renewsAt) : "—"}</TableCell>
                </TableRow>
              );
            })}
            {rows.length === 0 && <TableRow><TableCell colSpan={4} className="h-28 text-center text-muted-foreground">Nothing here.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">Cancel a subscription from the customer's page.</p>
    </>
  );
}
