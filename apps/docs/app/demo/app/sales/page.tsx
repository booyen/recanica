"use client";

import * as React from "react";
import Link from "next/link";
import { MoreHorizontalIcon, SearchIcon } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@recanica/ui/components/alert-dialog";
import { Badge } from "@recanica/ui/components/badge";
import { Button } from "@recanica/ui/components/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@recanica/ui/components/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@recanica/ui/components/input-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@recanica/ui/components/table";
import { Tabs, TabsList, TabsTrigger } from "@recanica/ui/components/tabs";
import { PageHeader } from "@/components/demo/ui";
import { money2, shortDate, useDemo } from "@/lib/demo/store";

export default function SalesPage() {
  const { state, dispatch } = useDemo();
  const [tab, setTab] = React.useState("all");
  const [q, setQ] = React.useState("");
  const [refunding, setRefunding] = React.useState<string | null>(null);

  const rows = state.orders
    .map((o) => ({ o, c: state.customers.find((c) => c.id === o.customerId), p: state.products.find((p) => p.id === o.productId) }))
    .filter(({ o }) => tab === "all" || o.status === tab)
    .filter(({ c, p, o }) => `${c?.name} ${c?.email} ${p?.name} ${o.id}`.toLowerCase().includes(q.toLowerCase()));
  const target = state.orders.find((o) => o.id === refunding);

  return (
    <>
      <PageHeader title="Orders" description="Every payment from checkout links and storefront." />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="refunded">Refunded</TabsTrigger>
          </TabsList>
        </Tabs>
        <InputGroup className="sm:ml-auto sm:max-w-xs">
          <InputGroupAddon><SearchIcon /></InputGroupAddon>
          <InputGroupInput placeholder="Search orders" aria-label="Search orders" value={q} onChange={(e) => setQ(e.target.value)} />
        </InputGroup>
      </div>
      <div className="overflow-hidden rounded-2xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Customer</TableHead>
              <TableHead className="hidden md:table-cell">Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ o, c, p }) => (
              <TableRow key={o.id}>
                <TableCell className="pl-4">
                  {c ? <Link href={`/demo/app/customers/${c.id}`} className="hover:underline">{c.name}</Link> : "—"}
                  <span className="block text-xs text-muted-foreground md:hidden">{p?.name}</span>
                </TableCell>
                <TableCell className="hidden md:table-cell">{p?.name}</TableCell>
                <TableCell><Badge variant={o.status === "paid" ? "success" : "muted"}>{o.status === "paid" ? "Paid" : "Refunded"}</Badge></TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">{shortDate(o.createdAt)}</TableCell>
                <TableCell className="text-right tabular-nums">{money2(o.amount)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm" aria-label="Order actions"><MoreHorizontalIcon /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {c && <DropdownMenuItem asChild><Link href={`/demo/app/customers/${c.id}`}>View customer</Link></DropdownMenuItem>}
                      <DropdownMenuItem onSelect={() => { navigator.clipboard?.writeText(o.id).catch(() => {}); toast("Order ID copied"); }}>Copy ID</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" disabled={o.status === "refunded"} onSelect={() => setRefunding(o.id)}>Refund</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && <TableRow><TableCell colSpan={6} className="h-28 text-center text-muted-foreground">No orders.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!refunding} onOpenChange={(o) => !o && setRefunding(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Refund {target && money2(target.amount)}?</AlertDialogTitle>
            <AlertDialogDescription>The customer gets their money back in 5–10 days. This demo just marks it refunded.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (refunding) { dispatch({ type: "refund", orderId: refunding }); toast.success("Order refunded"); } setRefunding(null); }}>Refund</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
