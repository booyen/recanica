"use client";

import * as React from "react";
import { SearchIcon } from "lucide-react";
import { Badge } from "@recanica/ui/components/badge";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@recanica/ui/components/input-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@recanica/ui/components/table";
import { PageHeader } from "@/components/demo/ui";

const log = [
  ["18 Nov 2026, 14:20", "Nadia Rahman", "invoice.sent", "INV-2026-0010", "175.141.22.8"],
  ["18 Nov 2026, 11:02", "Tan Wei Ming", "product.updated", "Pro Yearly: price RM450 → RM490", "60.53.18.40"],
  ["17 Nov 2026, 16:45", "Hana Lee", "payout.requested", "RM2,400.00 to Maybank •••• 5678", "175.141.22.9"],
  ["17 Nov 2026, 09:13", "Nadia Rahman", "team.invited", "arjun@acme.example as Viewer", "175.141.22.8"],
  ["16 Nov 2026, 22:31", "API key sk_live_…4f2a", "customer.created", "Kedai Kopi Pak Mat", "52.77.10.4"],
  ["15 Nov 2026, 10:00", "System", "einvoice.validated", "INV-2026-0009", "—"],
  ["14 Nov 2026, 18:22", "Tan Wei Ming", "settings.changed", "MyInvois enabled", "60.53.18.40"],
];

export default function AuditPage() {
  const [q, setQ] = React.useState("");
  const rows = log.filter((r) => r.join(" ").toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader title="Audit log" description="Every change made in this organization, kept for 2 years." />
      <InputGroup className="mb-4 sm:max-w-sm"><InputGroupAddon><SearchIcon /></InputGroupAddon><InputGroupInput placeholder="Filter by person, action or object" aria-label="Filter by person, action or object" value={q} onChange={(e) => setQ(e.target.value)} /></InputGroup>
      <div className="overflow-hidden rounded-2xl border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead className="pl-4">When</TableHead><TableHead>Actor</TableHead><TableHead>Action</TableHead><TableHead className="hidden md:table-cell">Details</TableHead><TableHead className="hidden lg:table-cell">IP</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r[0] + r[2]}>
                <TableCell className="pl-4 text-muted-foreground tabular-nums">{r[0]}</TableCell>
                <TableCell>{r[1]}</TableCell>
                <TableCell><Badge variant="outline" className="font-mono">{r[2]}</Badge></TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">{r[3]}</TableCell>
                <TableCell className="hidden font-mono text-xs text-muted-foreground lg:table-cell">{r[4]}</TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No matching entries.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
