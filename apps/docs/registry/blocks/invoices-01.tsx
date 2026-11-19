"use client";

import * as React from "react";
import { BellIcon, CopyIcon, DownloadIcon, MoreHorizontalIcon, PlusIcon, SearchIcon, SendIcon } from "lucide-react";
import { Badge } from "@recanica/ui/components/badge";
import { Button } from "@recanica/ui/components/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@recanica/ui/components/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@recanica/ui/components/input-group";
import { Separator } from "@recanica/ui/components/separator";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@recanica/ui/components/sheet";
import { Stat, StatGroup, StatHeader, StatValue } from "@recanica/ui/components/stat";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@recanica/ui/components/table";
import { Tabs, TabsList, TabsTrigger } from "@recanica/ui/components/tabs";

type Status = "Draft" | "Open" | "Paid" | "Overdue" | "Void";
type Invoice = { id: string; customer: string; email: string; status: Status; issued: string; due: string; amount: number };

const invoices: Invoice[] = [
  { id: "INV-0042", customer: "Lumen Labs Sdn. Bhd.", email: "finance@lumenlabs.example", status: "Open", issued: "18 Nov", due: "2 Dec", amount: 1290.6 },
  { id: "INV-0041", customer: "Northwind Trading", email: "finance@northwind.example", status: "Paid", issued: "12 Nov", due: "26 Nov", amount: 480 },
  { id: "INV-0040", customer: "Globex", email: "billing@globex.example", status: "Overdue", issued: "28 Oct", due: "11 Nov", amount: 2400 },
  { id: "INV-0039", customer: "Initech", email: "ap@initech.example", status: "Paid", issued: "20 Oct", due: "3 Nov", amount: 960 },
  { id: "INV-0038", customer: "Umbrella", email: "accounts@umbrella.example", status: "Draft", issued: "—", due: "—", amount: 350 },
  { id: "INV-0037", customer: "Acme Corp", email: "pay@acme.example", status: "Overdue", issued: "15 Oct", due: "29 Oct", amount: 1180 },
  { id: "INV-0036", customer: "Hooli", email: "ap@hooli.example", status: "Void", issued: "10 Oct", due: "24 Oct", amount: 120 },
];

const tone: Record<Status, "muted" | "warning" | "success" | "destructive" | "outline"> = {
  Draft: "outline", Open: "warning", Paid: "success", Overdue: "destructive", Void: "muted",
};
const tabs = ["All", "Draft", "Open", "Overdue", "Paid"] as const;
const money = (n: number) => new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR" }).format(n);
const sum = (s: Status) => invoices.filter((i) => i.status === s).reduce((a, i) => a + i.amount, 0);

export function Invoices01() {
  const [tab, setTab] = React.useState<(typeof tabs)[number]>("All");
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState<Invoice | null>(null);

  const rows = invoices.filter(
    (i) => (tab === "All" || i.status === tab) && `${i.id} ${i.customer} ${i.email}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-content space-y-stack px-gutter py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-title">Invoices</h1>
          <p className="mt-1 text-sm text-muted-foreground">Bill customers and track what you're owed.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="hidden sm:inline-flex"><DownloadIcon /> Export</Button>
          <Button className="flex-1 sm:flex-none"><PlusIcon /> New invoice</Button>
        </div>
      </div>

      <StatGroup>
        <Stat>
          <StatHeader title="Outstanding" />
          <StatValue value={money(sum("Open") + sum("Overdue"))} caption={`${invoices.filter((i) => i.status === "Open" || i.status === "Overdue").length} invoices`} />
        </Stat>
        <Stat>
          <StatHeader title="Overdue" />
          <StatValue value={<span className="text-destructive">{money(sum("Overdue"))}</span>} caption="needs follow-up" />
        </Stat>
        <Stat>
          <StatHeader title="Paid" />
          <StatValue value={<span className="text-brand">{money(sum("Paid"))}</span>} caption="last 30 days" />
        </Stat>
      </StatGroup>

      <div className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="-mx-1 overflow-x-auto px-1">
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
              <TabsList>
                {tabs.map((t) => (
                  <TabsTrigger key={t} value={t}>
                    {t}
                    {t !== "All" && <span className="text-xs text-muted-foreground tabular-nums">{invoices.filter((i) => i.status === t).length}</span>}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <InputGroup className="md:ml-auto md:max-w-xs">
            <InputGroupAddon><SearchIcon /></InputGroupAddon>
            <InputGroupInput placeholder="Search invoices" value={query} onChange={(e) => setQuery(e.target.value)} />
          </InputGroup>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Invoice</TableHead>
                <TableHead className="hidden sm:table-cell">Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Due</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((i) => (
                <TableRow key={i.id} className="cursor-pointer" onClick={() => setOpen(i)}>
                  <TableCell className="pl-4">
                    <span className="font-mono text-xs">{i.id}</span>
                    <span className="block text-xs text-muted-foreground sm:hidden">{i.customer}</span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {i.customer}
                    <span className="block text-xs text-muted-foreground">{i.email}</span>
                  </TableCell>
                  <TableCell><Badge variant={tone[i.status]}>{i.status}</Badge></TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{i.due}</TableCell>
                  <TableCell className="text-right tabular-nums">{money(i.amount)}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${i.id}`}><MoreHorizontalIcon /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setOpen(i)}>View</DropdownMenuItem>
                        <DropdownMenuItem><CopyIcon /> Copy payment link</DropdownMenuItem>
                        {i.status === "Overdue" && <DropdownMenuItem><BellIcon /> Send reminder</DropdownMenuItem>}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" disabled={i.status === "Paid" || i.status === "Void"}>Void</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No invoices found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Detail sheet */}
      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {open && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <SheetTitle className="font-mono">{open.id}</SheetTitle>
                  <Badge variant={tone[open.status]}>{open.status}</Badge>
                </div>
                <SheetDescription>{open.customer} · {open.email}</SheetDescription>
              </SheetHeader>
              <div className="space-y-6 px-4">
                <p className="text-metric font-light tabular-nums">{money(open.amount)}</p>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div><dt className="text-muted-foreground">Issued</dt><dd>{open.issued}</dd></div>
                  <div><dt className="text-muted-foreground">Due</dt><dd>{open.due}</dd></div>
                </dl>
                <Separator />
                <ol className="space-y-3 text-sm">
                  {[["Created", open.issued], ["Sent to customer", open.issued], ...(open.status === "Paid" ? [["Paid in full", open.due]] : [])].map(([t, d]) => (
                    <li key={t} className="flex items-center gap-3">
                      <span className="size-2 rounded-full bg-foreground" /> {t}
                      <span className="ml-auto text-muted-foreground">{d}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <SheetFooter>
                {open.status === "Overdue" && <Button><BellIcon /> Send reminder</Button>}
                {open.status === "Draft" && <Button><SendIcon /> Send invoice</Button>}
                <Button variant="outline"><DownloadIcon /> Download PDF</Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Invoices01;
