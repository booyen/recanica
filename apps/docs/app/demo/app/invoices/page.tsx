"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileTextIcon, PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "@rekanica/ui/components/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@rekanica/ui/components/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@rekanica/ui/components/input-group";
import { Stat, StatGroup, StatHeader, StatValue } from "@rekanica/ui/components/stat";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@rekanica/ui/components/table";
import { Tabs, TabsList, TabsTrigger } from "@rekanica/ui/components/tabs";
import { InvoiceBadge, PageHeader } from "@/components/demo/ui";
import { currentDue, invoiceBalance, invoiceGrand, invoicePaid, isOverdue, money, money2, shortDate, useDemo } from "@/lib/demo/store";

const TABS = ["all", "draft", "open", "partial", "overdue", "paid", "void"] as const;
const TAB_LABEL: Record<(typeof TABS)[number], string> = { all: "All", draft: "Draft", open: "Open", partial: "Instalments", overdue: "Overdue", paid: "Paid", void: "Void" };

export default function InvoicesPage() {
  const { state } = useDemo();
  const router = useRouter();
  const [tab, setTab] = React.useState<(typeof TABS)[number]>("all");
  const [q, setQ] = React.useState("");

  const match = (i: (typeof state.invoices)[number]) =>
    tab === "all" ? true : tab === "overdue" ? isOverdue(i) : tab === "open" ? i.status === "open" && !isOverdue(i) : tab === "partial" ? !!i.plan && (i.status === "open" || i.status === "partial") : i.status === tab;
  const rows = state.invoices
    .filter(match)
    .filter((i) => `${i.number} ${state.customers.find((c) => c.id === i.customerId)?.name}`.toLowerCase().includes(q.toLowerCase()));

  const total = (f: (i: (typeof state.invoices)[number]) => boolean) => state.invoices.filter(f).reduce((a, i) => a + invoiceBalance(i), 0);
  const collected = state.invoices.reduce((a, i) => a + invoicePaid(i), 0);
  const isOpen = (i: (typeof state.invoices)[number]) => i.status === "open" || i.status === "partial";

  return (
    <>
      <PageHeader
        title="Invoices"
        description="Bill customers and track what you're owed."
        actions={<Button asChild><Link href="/demo/app/invoices/new"><PlusIcon /> New invoice</Link></Button>}
      />
      <StatGroup className="mb-stack">
        <Stat><StatHeader title="Outstanding" /><StatValue value={money(total(isOpen))} caption={`${state.invoices.filter(isOpen).length} open · incl. SST`} /></Stat>
        <Stat><StatHeader title="Overdue" /><StatValue value={<span className={total(isOverdue) ? "text-destructive" : ""}>{money(total(isOverdue))}</span>} caption="needs follow-up" /></Stat>
        <Stat><StatHeader title="Collected" /><StatValue value={<span className="text-metallic">{money(collected)}</span>} caption="incl. instalments" /></Stat>
      </StatGroup>

      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center">
        <div className="-mx-1 overflow-x-auto px-1">
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList>
              {TABS.map((t) => <TabsTrigger key={t} value={t}>{TAB_LABEL[t]}</TabsTrigger>)}
            </TabsList>
          </Tabs>
        </div>
        <InputGroup className="md:ml-auto md:max-w-xs">
          <InputGroupAddon><SearchIcon /></InputGroupAddon>
          <InputGroupInput placeholder="Search invoices" value={q} onChange={(e) => setQ(e.target.value)} />
        </InputGroup>
      </div>

      {state.invoices.length === 0 ? (
        <Empty className="rounded-2xl border">
          <EmptyHeader><EmptyMedia variant="icon"><FileTextIcon /></EmptyMedia><EmptyTitle>No invoices yet</EmptyTitle><EmptyDescription>Bill a customer for custom work.</EmptyDescription></EmptyHeader>
          <EmptyContent><Button asChild><Link href="/demo/app/invoices/new">Create invoice</Link></Button></EmptyContent>
        </Empty>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Invoice</TableHead>
                <TableHead className="hidden sm:table-cell">Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Next due</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((i) => {
                const c = state.customers.find((x) => x.id === i.customerId);
                return (
                  <TableRow key={i.id} className="cursor-pointer" onClick={() => router.push(`/demo/app/invoices/${i.id}`)}>
                    <TableCell className="pl-4">
                      <Link href={`/demo/app/invoices/${i.id}`} onClick={(e) => e.stopPropagation()} className="font-mono text-xs hover:underline">{i.number}</Link>
                      <span className="block text-xs text-muted-foreground sm:hidden">{c?.name}</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{c?.name}<span className="block text-xs text-muted-foreground">{c?.email}</span></TableCell>
                    <TableCell><InvoiceBadge status={i.status} overdue={isOverdue(i)} /></TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {shortDate(currentDue(i))}
                      {i.plan && <span className="block text-xs">{i.plan.filter((p) => p.paidAt).length}/{i.plan.length} paid</span>}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {money2(invoiceGrand(i))}
                      {i.status === "partial" && <span className="block text-xs text-muted-foreground">{money2(invoiceBalance(i))} due</span>}
                    </TableCell>
                  </TableRow>
                );
              })}
              {rows.length === 0 && <TableRow><TableCell colSpan={5} className="h-28 text-center text-muted-foreground">No invoices here.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
