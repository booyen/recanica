"use client";

import { use } from "react";
import Link from "next/link";
import { FileTextIcon, MailIcon } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@recanica/ui/components/alert-dialog";
import { Avatar, AvatarFallback } from "@recanica/ui/components/avatar";
import { Badge } from "@recanica/ui/components/badge";
import { Button } from "@recanica/ui/components/button";
import { Stat, StatGroup, StatHeader, StatValue } from "@recanica/ui/components/stat";
import { InvoiceBadge, NotFound, PageHeader, Section } from "@/components/demo/ui";
import { date, initials, invoiceGrand, invoicePaid, isOverdue, money, price, shortDate, useDemo } from "@/lib/demo/store";

export default function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { state, dispatch } = useDemo();
  const c = state.customers.find((x) => x.id === id);
  if (!c) return <NotFound what="Customer" href="/demo/app/customers" />;

  const orders = state.orders.filter((o) => o.customerId === id);
  const subs = state.subscriptions.filter((s) => s.customerId === id);
  const invoices = state.invoices.filter((i) => i.customerId === id);
  const spent = orders.filter((o) => o.status === "paid").reduce((a, o) => a + o.amount, 0) + invoices.reduce((a, i) => a + invoicePaid(i), 0);

  return (
    <>
      <PageHeader
        back={{ href: "/demo/app/customers", label: "Customers" }}
        title={<span className="flex items-center gap-3"><Avatar className="size-10"><AvatarFallback className="text-xs">{initials(c.name)}</AvatarFallback></Avatar>{c.name}</span>}
        description={<span className="flex flex-wrap items-center gap-x-1.5"><MailIcon className="size-3.5" /> {c.email} · Customer since {date(c.createdAt)}{c.tin && <> · TIN {c.tin}</>}{c.regNo && <> · {c.kind === "business" ? "BRN" : "MyKad"} {c.regNo}</>}</span>}
        actions={<Button asChild><Link href={`/demo/app/invoices/new?customer=${c.id}`}><FileTextIcon /> New invoice</Link></Button>}
      />

      <StatGroup>
        <Stat><StatHeader title="Lifetime value" /><StatValue value={<span className="text-brand">{money(spent)}</span>} /></Stat>
        <Stat><StatHeader title="Orders" /><StatValue value={orders.length} /></Stat>
        <Stat><StatHeader title="Active subscriptions" /><StatValue value={subs.filter((s) => s.status === "active").length} /></Stat>
      </StatGroup>

      <Section title="Subscriptions">
        {subs.length ? (
          <ul className="divide-y rounded-2xl border bg-card">
            {subs.map((s) => {
              const p = state.products.find((x) => x.id === s.productId);
              return (
                <li key={s.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <p className="flex items-center gap-2">{p?.name} <Badge variant={s.status === "active" ? "success" : "muted"}>{s.status === "active" ? "Active" : "Canceled"}</Badge></p>
                    <p className="text-sm text-muted-foreground">{p && price(p)} · {s.status === "active" ? `renews ${date(s.renewsAt)}` : `ends ${date(s.renewsAt)}`}</p>
                  </div>
                  {s.status === "active" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="outline" size="sm">Cancel subscription</Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel {c.name}'s subscription?</AlertDialogTitle>
                          <AlertDialogDescription>They keep access until {date(s.renewsAt)}. No further charges.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep it</AlertDialogCancel>
                          <AlertDialogAction onClick={() => { dispatch({ type: "cancelSubscription", id: s.id }); toast("Subscription canceled"); }}>Cancel subscription</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </li>
              );
            })}
          </ul>
        ) : <p className="text-sm text-muted-foreground">No subscriptions.</p>}
      </Section>

      <div className="grid gap-x-6 lg:grid-cols-2">
        <Section title="Orders">
          {orders.length ? (
            <ul className="divide-y rounded-2xl border bg-card">
              {orders.map((o) => (
                <li key={o.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                  <span className="flex-1">{state.products.find((p) => p.id === o.productId)?.name}</span>
                  {o.status === "refunded" && <Badge variant="muted">Refunded</Badge>}
                  <span className="tabular-nums">{money(o.amount)}</span>
                  <span className="w-14 text-right text-muted-foreground">{shortDate(o.createdAt)}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-muted-foreground">No orders.</p>}
        </Section>
        <Section title="Invoices">
          {invoices.length ? (
            <ul className="divide-y rounded-2xl border bg-card">
              {invoices.map((i) => (
                <li key={i.id}>
                  <Link href={`/demo/app/invoices/${i.id}`} className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-accent/50">
                    <span className="flex-1 font-mono text-xs">{i.number}</span>
                    <InvoiceBadge status={i.status} overdue={isOverdue(i)} />
                    <span className="tabular-nums">{money(invoiceGrand(i))}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-muted-foreground">No invoices.</p>}
        </Section>
      </div>
    </>
  );
}
