"use client";

import * as React from "react";
import { ListFilterIcon, MoreHorizontalIcon, SearchIcon } from "lucide-react";
import { Badge } from "@recanica/ui/components/badge";
import { Button } from "@recanica/ui/components/button";
import { Checkbox } from "@recanica/ui/components/checkbox";
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@recanica/ui/components/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@recanica/ui/components/input-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@recanica/ui/components/table";

type Status = "Paid" | "Pending" | "Refunded" | "Failed";
type Order = { id: string; customer: string; email: string; product: string; status: Status; amount: number; date: string };

const orders: Order[] = [
  { id: "ord_9f2a", customer: "Nadia Rahman", email: "nadia@example.com", product: "Pro Yearly", status: "Paid", amount: 480, date: "18 Nov" },
  { id: "ord_8c1b", customer: "Leo Tan", email: "leo@example.com", product: "Pro Monthly", status: "Paid", amount: 48, date: "18 Nov" },
  { id: "ord_7d3e", customer: "Sam Ortiz", email: "sam@example.com", product: "Starter", status: "Refunded", amount: 12, date: "17 Nov" },
  { id: "ord_6a4f", customer: "Mei Kato", email: "mei@example.com", product: "Pro Yearly", status: "Pending", amount: 480, date: "17 Nov" },
  { id: "ord_5b5c", customer: "Arjun Mehta", email: "arjun@example.com", product: "Team", status: "Paid", amount: 240, date: "16 Nov" },
  { id: "ord_4e6d", customer: "Chloe Martin", email: "chloe@example.com", product: "Pro Monthly", status: "Failed", amount: 48, date: "16 Nov" },
  { id: "ord_3f7a", customer: "Hana Lee", email: "hana@example.com", product: "Starter", status: "Paid", amount: 12, date: "15 Nov" },
];

const tone: Record<Status, "success" | "warning" | "muted" | "destructive"> = {
  Paid: "success", Pending: "warning", Refunded: "muted", Failed: "destructive",
};
const statuses: Status[] = ["Paid", "Pending", "Refunded", "Failed"];

export default function DataTable() {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<Status[]>([]);
  const [selected, setSelected] = React.useState<string[]>([]);

  const rows = orders.filter(
    (o) =>
      (filter.length === 0 || filter.includes(o.status)) &&
      `${o.customer} ${o.email} ${o.product} ${o.id}`.toLowerCase().includes(query.toLowerCase())
  );
  const allSelected = rows.length > 0 && rows.every((r) => selected.includes(r.id));

  return (
    <div className="mx-auto max-w-content space-y-4 px-gutter py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <InputGroup className="sm:max-w-xs">
          <InputGroupAddon><SearchIcon /></InputGroupAddon>
          <InputGroupInput placeholder="Search orders" value={query} onChange={(e) => setQuery(e.target.value)} />
        </InputGroup>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="sm:w-auto">
              <ListFilterIcon /> Status {filter.length > 0 && <Badge variant="secondary">{filter.length}</Badge>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statuses.map((s) => (
              <DropdownMenuCheckboxItem
                key={s}
                checked={filter.includes(s)}
                onCheckedChange={(c) => setFilter((f) => (c ? [...f, s] : f.filter((x) => x !== s)))}
                onSelect={(e) => e.preventDefault()}
              >
                {s}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {selected.length > 0 && (
          <div className="flex items-center gap-2 text-sm sm:ml-auto">
            <span className="text-muted-foreground">{selected.length} selected</span>
            <Button size="sm" variant="outline">Refund</Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected([])}>Clear</Button>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 pl-4">
                <Checkbox
                  aria-label="Select all"
                  checked={allSelected}
                  onCheckedChange={(c) => setSelected(c ? rows.map((r) => r.id) : [])}
                />
              </TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((o) => (
              <TableRow key={o.id} data-state={selected.includes(o.id) ? "selected" : undefined}>
                <TableCell className="pl-4">
                  <Checkbox
                    aria-label={`Select ${o.customer}`}
                    checked={selected.includes(o.id)}
                    onCheckedChange={(c) => setSelected((s) => (c ? [...s, o.id] : s.filter((x) => x !== o.id)))}
                  />
                </TableCell>
                <TableCell>
                  <div>{o.customer}</div>
                  <div className="text-xs text-muted-foreground">{o.email}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{o.product}</TableCell>
                <TableCell><Badge variant={tone[o.status]}>{o.status}</Badge></TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">{o.date}</TableCell>
                <TableCell className="text-right tabular-nums">${o.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label="Row actions"><MoreHorizontalIcon /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View order</DropdownMenuItem>
                      <DropdownMenuItem>Copy ID</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">Refund</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={7} className="h-32 text-center text-muted-foreground">No orders match your filters.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{rows.length} of {orders.length} orders</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
}
