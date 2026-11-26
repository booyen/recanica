"use client";

import { CheckIcon } from "lucide-react";
import { Badge } from "@recanica/ui/components/badge";
import { DemoQr } from "@/components/demo/my-ui";
import { TAX, amountInWords } from "@/lib/demo/my";
import { dmy, invoiceGrand, invoiceTax, invoiceTotal, money2, useDemo } from "@/lib/demo/store";
import type { Address, Customer, Invoice, Org } from "@/lib/demo/types";

const addr = (a?: Address) => (a ? [a.line1, a.line2, `${a.postcode} ${a.city}`, a.state].filter(Boolean) : []);

/**
 * Keep identifiers intact when wrapping: "BRN 202401012345 (1556789-X)" may break
 * between tokens, never inside "202401012345" or "(1556789-X)".
 */
function Unbreakable({ text }: { text: string }) {
  const tokens = text.split(/(\s+)/);
  // Keep IDs and short words whole; tokens longer than a line (long emails) may break anywhere.
  return <>{tokens.map((t, i) => (/^\s+$/.test(t) || t.length > 24 ? t : <span key={i} className="whitespace-nowrap">{t}</span>))}</>;
}

function Party({ title, lines }: { title: string; lines: (string | undefined | false)[] }) {
  const [first, ...rest] = lines.filter(Boolean) as string[];
  return (
    <div className="min-w-0 space-y-0.5 text-sm [overflow-wrap:anywhere]">
      <p className="mb-2 text-xs text-muted-foreground">{title}</p>
      <p>{first}</p>
      {rest.map((l, i) => <p key={i} className="text-muted-foreground"><Unbreakable text={l} /></p>)}
    </div>
  );
}

/** Malaysian tax invoice, MyInvois-ready layout. */
export function InvoiceDocument({ invoice, org, customer }: { invoice: Invoice; org?: Org; customer?: Customer }) {
  const { state } = useDemo();
  const o = org ?? state.org;
  const c = customer ?? state.customers.find((x) => x.id === invoice.customerId);
  const subtotal = invoiceTotal(invoice.items);
  const tax = invoiceTax(invoice);
  const total = invoiceGrand(invoice);
  const ei = invoice.einvoice;

  return (
    <article /* recanica-ignore: printable invoice document with print styles */ className="@container rounded-2xl border bg-card p-6 text-card-foreground @2xl:p-10">
      <header className="flex flex-col gap-6 @xl:flex-row @xl:items-start @xl:justify-between">
        <div className="flex items-center gap-2"><span className="size-7 rounded-lg bg-brand text-brand-foreground" /><span className="text-lg">{o.name}</span></div>
        <div className="@xl:text-right">
          <div className="flex items-center gap-2 @xl:justify-end">
            <p className="text-title">{tax > 0 ? "Tax Invoice" : "Invoice"}</p>
            {ei && <Badge variant="outline">e-Invoice</Badge>}
          </div>
          <p className="font-mono text-sm text-muted-foreground">{invoice.number}</p>
        </div>
      </header>

      <div className="mt-10 grid gap-8 @xl:grid-cols-2 @4xl:grid-cols-3">
        <Party
          title="Supplier"
          lines={[o.legalName, `BRN ${o.brn}`, `TIN ${o.tin}`, o.sstNo && `SST ${o.sstNo}`, `MSIC ${o.msic} · ${o.msicDesc}`, ...addr(o.address), o.phone, o.email]}
        />
        <Party
          title="Buyer"
          lines={[
            c?.name,
            c?.regNo && `${c.kind === "business" ? "BRN" : "MyKad / Passport"} ${c.regNo}`,
            c?.tin && `TIN ${c.tin}`,
            ...addr(c?.address),
            c?.phone,
            c?.email,
          ]}
        />
        {/* self-start + content-start: don't stretch to the height of the address columns */}
        <dl className="grid grid-cols-2 content-start gap-x-4 gap-y-4 self-start text-sm @md:grid-cols-3 @xl:col-span-2 @4xl:col-span-1 @4xl:grid-cols-1 @4xl:text-right">
          <div><dt className="text-xs text-muted-foreground">Invoice date</dt><dd>{dmy(invoice.issuedAt ?? invoice.createdAt)}</dd></div>
          <div><dt className="text-xs text-muted-foreground">{invoice.plan ? "Final instalment due" : "Due date"}</dt><dd>{dmy(invoice.dueAt)}</dd></div>
          <div><dt className="text-xs text-muted-foreground">Currency</dt><dd>MYR</dd></div>
        </dl>
      </div>

      {/* Line items: table on sm+, stacked on phones */}
      {/* One column template for header and rows (subgrid); number columns size to their longest value, never a fixed width. */}
      <div className="mt-10 @2xl:grid @2xl:grid-cols-[2rem_1fr_auto_auto_auto] @2xl:gap-x-3">
        <div className="hidden col-span-full grid-cols-subgrid border-b pb-2 text-xs text-muted-foreground @2xl:grid">
          <span>No.</span><span>Description</span><span className="text-right">Qty</span><span className="text-right">Unit (RM)</span><span className="text-right">Amount (RM)</span>
        </div>
        <ul className="divide-y @2xl:col-span-full @2xl:grid @2xl:grid-cols-subgrid">
          {invoice.items.map((i, k) => (
            <li key={k} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 py-3 text-sm @2xl:col-span-full @2xl:grid-cols-subgrid @2xl:items-baseline">
              <span className="hidden text-muted-foreground @2xl:block">{k + 1}</span>
              <span className="min-w-0 [overflow-wrap:anywhere]">{i.description}<span className="block text-xs text-muted-foreground @2xl:hidden">{i.qty} × {money2(i.unit)}</span></span>
              <span className="hidden text-right tabular-nums @2xl:block">{i.qty}</span>
              <span className="hidden text-right tabular-nums @2xl:block">{i.unit.toLocaleString("en-MY", { minimumFractionDigits: 2 })}</span>
              <span className="text-right tabular-nums">{(i.qty * i.unit).toLocaleString("en-MY", { minimumFractionDigits: 2 })}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-2 flex justify-end">
        <dl className="w-full max-w-sm space-y-2 text-sm">
          <div className="flex justify-between border-t pt-3"><dt className="text-muted-foreground">Subtotal (excl. SST)</dt><dd className="tabular-nums">{money2(subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">{TAX[invoice.tax].label}</dt><dd className="tabular-nums">{money2(tax)}</dd></div>
          <div className="flex items-baseline justify-between border-t pt-3"><dt>Total payable</dt><dd className="text-metric font-light tabular-nums">{money2(total)}</dd></div>
          <dd className="text-right text-xs text-muted-foreground">{amountInWords(total)}</dd>
        </dl>
      </div>

      {invoice.plan && (
        <section className="mt-10">
          <p className="mb-2 text-xs text-muted-foreground">Payment schedule</p>
          <ol className="divide-y rounded-xl border">
            {invoice.plan.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 text-sm">
                <span className="flex-1">{p.label}</span>
                <span className="text-muted-foreground tabular-nums">due {dmy(p.dueAt)}</span>
                <span className="min-w-28 text-right tabular-nums">{money2(p.amount)}</span>
                {p.paidAt ? <Badge variant="success"><CheckIcon /> Paid {dmy(p.paidAt)}</Badge> : <Badge variant="outline">Unpaid</Badge>}
              </li>
            ))}
          </ol>
        </section>
      )}

      <footer className="mt-10 grid gap-8 border-t pt-6 text-sm [overflow-wrap:anywhere] @xl:grid-cols-2">
        <div className="space-y-1">
          <p className="mb-2 text-xs text-muted-foreground">Payment details</p>
          <p>{o.bank.name} · {o.bank.account}</p>
          <p className="text-muted-foreground">Account name: {o.bank.holder}</p>
          <p className="text-muted-foreground">DuitNow ID: {o.duitnowId}</p>
          <p className="text-muted-foreground">Reference: {invoice.number}</p>
          <p className="text-muted-foreground">Or pay online by FPX / DuitNow QR via the payment link.</p>
        </div>
        {ei ? (
          <div className="flex flex-col-reverse gap-4 @md:flex-row @xl:justify-end">
            <div className="min-w-0 space-y-1 @xl:text-right">
              <p className="mb-2 text-xs text-muted-foreground">LHDN MyInvois</p>
              <p className="font-mono text-xs break-all">UUID {ei.uuid}</p>
              <p className="text-xs text-muted-foreground">
                {ei.status === "valid" ? `Validated ${dmy(ei.validatedAt)}` : "Submitted · pending validation"}
              </p>
            </div>
            <DemoQr value={ei.uuid} size={88} label="MyInvois validation QR (demo)" className={ei.status !== "valid" ? "opacity-30" : ""} />
          </div>
        ) : (
          <p className="text-xs text-muted-foreground sm:text-right">Not submitted to MyInvois.</p>
        )}
      </footer>

      {invoice.notes && <p className="mt-6 text-sm text-muted-foreground">{invoice.notes}</p>}
      <p className="mt-6 text-center text-xs text-muted-foreground">This is a computer-generated invoice. No signature is required.</p>
    </article>
  );
}
