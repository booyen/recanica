"use client";

import { Badge } from "@rekanica/ui/components/badge";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@rekanica/ui/components/table";

const rows = [
  { id: "INV-001", customer: "Nadia Rahman", status: "Paid", amount: 250 },
  { id: "INV-002", customer: "Leo Tan", status: "Pending", amount: 150 },
  { id: "INV-003", customer: "Sam Ortiz", status: "Refunded", amount: 350 },
  { id: "INV-004", customer: "Mei Kato", status: "Paid", amount: 450 },
];

export default function TableDemo() {
  return (
    <Table className="text-left">
      <TableCaption>Recent invoices.</TableCaption>
      <TableHeader>
        <TableRow><TableHead>Invoice</TableHead><TableHead>Customer</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead></TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-mono text-xs">{r.id}</TableCell>
            <TableCell>{r.customer}</TableCell>
            <TableCell><Badge variant={r.status === "Paid" ? "success" : r.status === "Pending" ? "warning" : "muted"}>{r.status}</Badge></TableCell>
            <TableCell className="text-right tabular-nums">${r.amount.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow><TableCell colSpan={3}>Total</TableCell><TableCell className="text-right tabular-nums">$1,200.00</TableCell></TableRow>
      </TableFooter>
    </Table>
  );
}
