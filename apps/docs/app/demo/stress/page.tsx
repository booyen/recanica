"use client";

/**
 * Stress page: real compositions fed with worst-case content.
 * Used by tests/layout.spec.ts. If something only breaks "when combined", it should break here first.
 */
import { MoreHorizontalIcon, PlusIcon } from "lucide-react";
import { Badge } from "@rekanica/ui/components/badge";
import { Button } from "@rekanica/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@rekanica/ui/components/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@rekanica/ui/components/empty";
import { BarRow, Stat, StatGroup, StatHeader, StatList, StatRow, StatValue } from "@rekanica/ui/components/stat";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@rekanica/ui/components/table";
import { InvoiceDocument } from "@/components/demo/invoice-document";
import { PageHeader } from "@/components/demo/ui";
import { seed } from "@/lib/demo/seed";
import type { Customer, Invoice, Org } from "@/lib/demo/types";

const LONG = "Syarikat Perniagaan Teknologi Maklumat Dan Perkhidmatan Digital Antarabangsa Berhad";
const EMAIL = "accounts.payable.department+invoices-2026@a-very-long-company-domain-name.example";

const org: Org = {
  ...seed.org,
  legalName: `${LONG} (Cawangan Wilayah Persekutuan Kuala Lumpur)`,
  brn: "202401012345678 (1556789-XYZ-001)",
  sstNo: "W10-2401-32000123-EXTRA-LONG-SUFFIX",
  msicDesc: "Other information technology and computer service activities not elsewhere classified",
  address: { line1: "Lot 12-34A, Level 56, Tower 7, Menara Perkhidmatan Bersepadu Antarabangsa", line2: "Jalan Tun Dr. Ismail Ke Persiaran Damansara", postcode: "50450", city: "Kuala Lumpur", state: "W.P. Kuala Lumpur" },
  email: EMAIL,
};
const customer: Customer = { id: "cus_x", name: LONG, email: EMAIL, country: "MY", createdAt: seed.org.email, kind: "business", regNo: "199901234567 (123456-ABCDEFG)", tin: "C1234567890123456" };
const minimalCustomer: Customer = { id: "cus_y", name: "Ali", email: "a@b.example", country: "MY", createdAt: "" };

const invoice: Invoice = {
  id: "inv_x", number: "INV-2026-000000123456", customerId: "cus_x", tax: "service-8", status: "partial",
  createdAt: "2026-11-01T00:00:00Z", issuedAt: "2026-11-01T00:00:00Z", dueAt: "2027-05-01T00:00:00Z",
  notes: "Bayaran hendaklah dibuat dalam tempoh 14 hari. ".repeat(4),
  items: Array.from({ length: 9 }, (_, i) => ({
    description: i % 3 === 0 ? `Pembangunan sistem pengurusan inventori berasaskan awan termasuk integrasi API pihak ketiga, fasa ${i + 1}` : `Item ${i + 1}`,
    qty: i % 4 === 0 ? 1200 : 1, unit: i === 0 ? 1234567.89 : 450.5,
  })),
  plan: Array.from({ length: 6 }, (_, i) => ({ id: `p${i}`, label: i === 0 ? "Deposit (bayaran pendahuluan)" : `Instalment ${i}`, amount: 250000.12, dueAt: `2026-${String(11 + i > 12 ? i - 1 : 11 + i).padStart(2, "0")}-01T00:00:00Z`, paidAt: i < 2 ? "2026-11-02T00:00:00Z" : undefined })),
  einvoice: { uuid: "7Q4K1M9ZPR2X8D6T0VBN3HJC5W7Q4K1M9ZPR2X8D6T0VBN3HJC5W", longId: "X", status: "valid", submittedAt: "2026-11-01T00:00:00Z", validatedAt: "2026-11-01T00:01:00Z" },
};
const minimalInvoice: Invoice = { id: "inv_y", number: "1", customerId: "cus_y", tax: "none", status: "open", createdAt: "2026-11-01T00:00:00Z", dueAt: "2026-11-15T00:00:00Z", notes: "", items: [{ description: "A", qty: 1, unit: 1 }] };

function Frame({ label, width, children }: { label: string; width?: number; children: React.ReactNode }) {
  return (
    <section data-stress={label} className="space-y-2">
      <p className="font-mono text-xs text-muted-foreground">{label}{width ? ` · ${width}px` : ""}</p>
      <div className="overflow-hidden rounded-2xl border border-dashed p-2" style={width ? { maxWidth: width } : undefined}>{children}</div>
    </section>
  );
}

export default function StressPage() {
  return (
    <main className="mx-auto max-w-content space-y-12 bg-background px-gutter py-10">
      <h1 className="text-title">Layout stress test</h1>

      <Frame label="invoice · worst case"><InvoiceDocument invoice={invoice} org={org} customer={customer} /></Frame>
      <Frame label="invoice · worst case" width={360}><InvoiceDocument invoice={invoice} org={org} customer={customer} /></Frame>
      <Frame label="invoice · minimal"><InvoiceDocument invoice={minimalInvoice} org={org} customer={minimalCustomer} /></Frame>

      <Frame label="page header · long title + many actions" width={480}>
        <PageHeader
          title={LONG}
          description={EMAIL}
          actions={<><Button variant="outline">Export everything</Button><Button variant="outline">Duplicate</Button><Button><PlusIcon /> New invoice for customer</Button><Button variant="ghost" size="icon" aria-label="More"><MoreHorizontalIcon /></Button></>}
        />
      </Frame>

      <Frame label="stat group · big numbers">
        <StatGroup>
          {["Revenue (gross, before refunds and fees)", "Outstanding", "Collected", "Average order value"].map((t, i) => (
            <Stat key={t}>
              <StatHeader title={t} href="#" />
              <StatValue value={`RM ${(123456789.12 * (i + 1)).toLocaleString("en-MY")}`} caption="last twelve months, all channels" />
              <StatList>
                <BarRow label="Nov" value="RM 12,345,678" percent={100} active />
                <StatRow primary={LONG} secondary={EMAIL} trailing="12 months ago" />
              </StatList>
            </Stat>
          ))}
        </StatGroup>
      </Frame>

      <Frame label="table · long cells" width={420}>
        <Table>
          <TableHeader><TableRow><TableHead>Customer</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
          <TableBody>
            {[0, 1].map((i) => (
              <TableRow key={i}>
                <TableCell>{LONG}<span className="block text-xs text-muted-foreground">{EMAIL}</span></TableCell>
                <TableCell><Badge variant="warning">Partially paid · instalment 3 of 12</Badge></TableCell>
                <TableCell className="text-right tabular-nums">RM 1,234,567,890.12</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Frame>

      <Frame label="card + badges + buttons · narrow" width={300}>
        <Card>
          <CardHeader><CardTitle>{LONG}</CardTitle><CardDescription>{EMAIL}</CardDescription></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge>Supercalifragilisticexpialidocious</Badge><Badge variant="success">Active</Badge><Badge variant="outline">{EMAIL}</Badge>
          </CardContent>
          <CardFooter className="flex-wrap gap-2"><Button><span className="truncate">A very long primary action label that should not overflow</span></Button></CardFooter>
        </Card>
      </Frame>

      <Frame label="empty · long copy" width={320}>
        <Empty><EmptyHeader><EmptyTitle>{LONG}</EmptyTitle><EmptyDescription>{EMAIL} {LONG}</EmptyDescription></EmptyHeader><EmptyContent><Button>Create</Button></EmptyContent></Empty>
      </Frame>
    </main>
  );
}
