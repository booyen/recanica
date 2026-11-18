"use client";

import { DownloadIcon, PrinterIcon, SendIcon } from "lucide-react";
import { Badge } from "@rekanica/ui/components/badge";
import { Button } from "@rekanica/ui/components/button";
import { Separator } from "@rekanica/ui/components/separator";

const invoice = {
  number: "INV-2026-0042",
  status: "Due" as "Paid" | "Due" | "Overdue",
  issued: "18 Nov 2026",
  due: "2 Dec 2026",
  from: { name: "Acme Studio Sdn. Bhd.", lines: ["BRN 202401012345 (1556789-X)", "TIN C25845632020 · SST W10-2401-32000123", "Level 12, Menara Contoh, Jalan Ampang", "50450 Kuala Lumpur", "billing@acme.example"] },
  to: { name: "Lumen Labs Sdn. Bhd.", lines: ["BRN 201901023456 (1321456-W)", "TIN C24890123050", "Unit 3A-5, Bayan Point, Jalan Mahsuri", "11950 Bayan Lepas, Pulau Pinang", "finance@lumenlabs.example"] },
  items: [
    { description: "Pro plan · annual", detail: "1 Dec 2026 – 30 Nov 2027", qty: 1, unit: 1990 },
    { description: "Additional seats", detail: "Pro, annual", qty: 5, unit: 399 },
    { description: "Onboarding workshop", detail: "2 × 90-minute sessions", qty: 1, unit: 1500 },
  ],
  discount: 0.1,
  taxRate: 0.08,
  currency: "MYR",
};

const money = (n: number) => new Intl.NumberFormat("en-MY", { style: "currency", currency: invoice.currency }).format(n);

export function Invoice01() {
  const subtotal = invoice.items.reduce((s, i) => s + i.qty * i.unit, 0);
  const discount = subtotal * invoice.discount;
  const tax = (subtotal - discount) * invoice.taxRate;
  const total = subtotal - discount + tax;

  return (
    <div className="min-h-svh bg-sidebar px-gutter py-8 print:bg-white print:p-0">
      {/* Toolbar: hidden when printing */}
      <div className="mx-auto mb-4 flex max-w-narrow flex-wrap items-center gap-2 print:hidden">
        <Badge variant={invoice.status === "Paid" ? "success" : invoice.status === "Overdue" ? "destructive" : "warning"}>{invoice.status}</Badge>
        <span className="text-sm text-muted-foreground">Due {invoice.due}</span>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="icon" aria-label="Print" onClick={() => window.print()}><PrinterIcon /></Button>
          <Button variant="outline" size="icon" aria-label="Download PDF"><DownloadIcon /></Button>
          <Button><SendIcon /> Send</Button>
        </div>
      </div>

      <article className="mx-auto max-w-narrow rounded-2xl border bg-panel p-6 sm:p-10 print:max-w-none print:rounded-none print:border-0 print:text-black">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="size-7 rounded-lg bg-metallic print:bg-black" />
            <span className="text-lg">Acme Studio</span>
          </div>
          <div className="sm:text-right">
            <h1 className="text-title">Tax Invoice</h1>
            <p className="font-mono text-sm text-muted-foreground">{invoice.number}</p>
          </div>
        </header>

        <div className="mt-10 grid gap-8 text-sm sm:grid-cols-3">
          <div>
            <p className="mb-2 text-xs text-muted-foreground">From</p>
            <p>{invoice.from.name}</p>
            {invoice.from.lines.map((l) => <p key={l} className="text-muted-foreground">{l}</p>)}
          </div>
          <div>
            <p className="mb-2 text-xs text-muted-foreground">Bill to</p>
            <p>{invoice.to.name}</p>
            {invoice.to.lines.map((l) => <p key={l} className="text-muted-foreground">{l}</p>)}
          </div>
          <dl className="grid grid-cols-2 content-start gap-x-4 gap-y-3 self-start sm:grid-cols-1 sm:text-right">
            <div><dt className="text-xs text-muted-foreground">Issued</dt><dd>{invoice.issued}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Due</dt><dd>{invoice.due}</dd></div>
          </dl>
        </div>

        {/* Line items: table on sm+, stacked rows on phones */}
        <div className="mt-10">
          <div className="hidden grid-cols-[1fr_4rem_6rem_6rem] gap-4 border-b pb-2 text-xs text-muted-foreground sm:grid">
            <span>Description</span><span className="text-right">Qty</span><span className="text-right">Unit</span><span className="text-right">Amount</span>
          </div>
          <ul className="divide-y">
            {invoice.items.map((i) => (
              <li key={i.description} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 py-4 text-sm sm:grid-cols-[1fr_4rem_6rem_6rem] sm:items-baseline">
                <div>
                  <p>{i.description}</p>
                  <p className="text-xs text-muted-foreground">{i.detail}</p>
                </div>
                <span className="col-start-1 text-xs text-muted-foreground sm:col-start-auto sm:text-right sm:text-sm sm:text-foreground">
                  <span className="sm:hidden">{i.qty} × {money(i.unit)}</span>
                  <span className="hidden tabular-nums sm:inline">{i.qty}</span>
                </span>
                <span className="hidden text-right tabular-nums sm:block">{money(i.unit)}</span>
                <span className="col-start-2 row-start-1 text-right tabular-nums sm:col-start-auto sm:row-start-auto">{money(i.qty * i.unit)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-2 flex justify-end">
          <dl className="w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="tabular-nums">{money(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Discount ({invoice.discount * 100}%)</dt><dd className="tabular-nums">−{money(discount)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">SST {invoice.taxRate * 100}% (service tax)</dt><dd className="tabular-nums">{money(tax)}</dd></div>
            <Separator />
            <div className="flex items-baseline justify-between pt-1">
              <dt>Total due</dt>
              <dd className="text-metric font-light tabular-nums">{money(total)}</dd>
            </div>
          </dl>
        </div>

        <footer className="mt-12 grid gap-6 border-t pt-6 text-sm sm:grid-cols-2">
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Payment</p>
            <p>Pay online by FPX or DuitNow QR at <span className="underline underline-offset-4">pay.acme.example/{invoice.number}</span></p>
            <p className="text-muted-foreground">or bank transfer · Maybank · 5140 1234 5678 · DuitNow ID 202401012345</p>
          </div>
          <div className="sm:text-right">
            <p className="mb-1 text-xs text-muted-foreground">Notes</p>
            <p className="text-muted-foreground">Terima kasih. Payment terms: net 14. This is a computer-generated invoice; no signature is required.</p>
          </div>
        </footer>
      </article>
    </div>
  );
}

export default Invoice01;
