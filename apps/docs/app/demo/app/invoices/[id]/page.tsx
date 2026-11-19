"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { BanIcon, CopyIcon, ExternalLinkIcon, ReceiptIcon, SendIcon, ShieldCheckIcon } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@recanica/ui/components/alert-dialog";
import { Badge } from "@recanica/ui/components/badge";
import { Button } from "@recanica/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@recanica/ui/components/dialog";
import { Field, FieldLabel } from "@recanica/ui/components/field";
import { NativeSelect, NativeSelectOption } from "@recanica/ui/components/native-select";
import { Progress } from "@recanica/ui/components/progress";
import { InvoiceDocument } from "@/components/demo/invoice-document";
import { InvoiceBadge, NotFound, PageHeader } from "@/components/demo/ui";
import { date, dmy, invoiceBalance, invoiceGrand, invoicePaid, isOverdue, money2, nextInstallment, useDemo } from "@/lib/demo/store";

const METHODS = ["FPX · Maybank2u", "FPX · CIMB Clicks", "DuitNow QR", "DuitNow Transfer", "JomPAY", "Bank transfer (IBG)", "Cash", "Cheque"];

function RecordPayment({ invoiceId, open, onOpenChange }: { invoiceId: string; open: boolean; onOpenChange: (o: boolean) => void }) {
  const { state, dispatch } = useDemo();
  const inv = state.invoices.find((i) => i.id === invoiceId)!;
  const next = nextInstallment(inv);
  const [method, setMethod] = React.useState(METHODS[0]);
  const [what, setWhat] = React.useState<"next" | "full">("next");
  const amount = next && what === "next" ? next.amount : invoiceBalance(inv);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record payment</DialogTitle>
          <DialogDescription>For payments received outside the payment link (bank transfer, cash, cheque).</DialogDescription>
        </DialogHeader>
        {next && (
          <Field>
            <FieldLabel>Amount</FieldLabel>
            <NativeSelect value={what} onChange={(e) => setWhat(e.target.value as "next" | "full")} className="w-full">
              <NativeSelectOption value="next">{next.label} · {money2(next.amount)}</NativeSelectOption>
              <NativeSelectOption value="full">Full balance · {money2(invoiceBalance(inv))}</NativeSelectOption>
            </NativeSelect>
          </Field>
        )}
        <Field>
          <FieldLabel>Method</FieldLabel>
          <NativeSelect value={method} onChange={(e) => setMethod(e.target.value)} className="w-full">
            {METHODS.map((m) => <NativeSelectOption key={m} value={m}>{m}</NativeSelectOption>)}
          </NativeSelect>
        </Field>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (next && what === "next") dispatch({ type: "payInstallment", id: inv.id, installmentId: next.id, method });
              else dispatch({ type: "payInvoice", id: inv.id, method });
              toast.success(`Recorded ${money2(amount)}`, { description: method });
              onOpenChange(false);
            }}
          >
            Record {money2(amount)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { state, dispatch } = useDemo();
  const [recording, setRecording] = React.useState(false);
  const inv = state.invoices.find((i) => i.id === id);

  // Simulate LHDN validation a moment after submission.
  React.useEffect(() => {
    if (inv?.einvoice?.status !== "submitted") return;
    const t = setTimeout(() => { dispatch({ type: "validateEinvoice", id }); toast.success("e-Invoice validated by LHDN", { description: inv.number }); }, 2200);
    return () => clearTimeout(t);
  }, [inv?.einvoice?.status, id, dispatch, inv?.number]);

  if (!inv) return <NotFound what="Invoice" href="/demo/app/invoices" />;
  const c = state.customers.find((x) => x.id === inv.customerId);
  const payUrl = typeof window !== "undefined" ? `${window.location.origin}/demo/pay/${inv.id}` : "";
  const total = invoiceGrand(inv);
  const paid = invoicePaid(inv);
  const payable = inv.status === "open" || inv.status === "partial";

  const timeline = [
    { label: "Created", at: inv.createdAt },
    ...(inv.issuedAt ? [{ label: `Sent to ${c?.email}`, at: inv.issuedAt }] : []),
    ...(inv.einvoice ? [{ label: "Submitted to MyInvois", at: inv.einvoice.submittedAt }] : []),
    ...(inv.einvoice?.validatedAt ? [{ label: "Validated by LHDN", at: inv.einvoice.validatedAt }] : []),
    ...(inv.plan ?? []).filter((p) => p.paidAt).map((p) => ({ label: `${p.label} paid · ${p.method ?? ""}`, at: p.paidAt })),
    ...(!inv.plan && inv.paidAt ? [{ label: `Paid in full · ${inv.paidMethod ?? ""}`, at: inv.paidAt }] : []),
    ...(inv.status === "void" ? [{ label: "Voided", at: undefined }] : []),
  ].sort((a, b) => (a.at ?? "9").localeCompare(b.at ?? "9"));

  return (
    <>
      <PageHeader
        back={{ href: "/demo/app/invoices", label: "Invoices" }}
        title={<span className="flex flex-wrap items-center gap-2"><span className="font-mono">{inv.number}</span><InvoiceBadge status={inv.status} overdue={isOverdue(inv)} /></span>}
        description={<>{c ? <Link href={`/demo/app/customers/${c.id}`} className="hover:text-foreground">{c.name}</Link> : "—"} · {money2(total)} · due {date(inv.dueAt)}</>}
        actions={
          <>
            {inv.status === "draft" && <Button onClick={() => { dispatch({ type: "sendInvoice", id }); toast.success("Invoice sent", { description: state.org.einvoice ? "Submitted to MyInvois for validation" : c?.email }); }}><SendIcon /> Send</Button>}
            {payable && (
              <>
                <Button variant="outline" onClick={() => { navigator.clipboard?.writeText(payUrl).catch(() => {}); toast("Payment link copied"); }}><CopyIcon /> Copy pay link</Button>
                <Button variant="outline" asChild><a href={`/demo/pay/${inv.id}`} target="_blank" rel="noreferrer"><ExternalLinkIcon /> Customer view</a></Button>
                <Button onClick={() => setRecording(true)}><ReceiptIcon /> Record payment</Button>
              </>
            )}
            {(inv.status === "draft" || inv.status === "open") && (
              <AlertDialog>
                <AlertDialogTrigger asChild><Button variant="ghost" size="icon" aria-label="Void invoice"><BanIcon /></Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Void {inv.number}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      The customer can no longer pay it.{inv.einvoice ? " A validated e-Invoice must also be cancelled in MyInvois within 72 hours, or a credit note issued." : ""}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => { dispatch({ type: "voidInvoice", id }); toast("Invoice voided"); }}>Void invoice</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <InvoiceDocument invoice={inv} />
        <aside className="space-y-6">
          <section className="space-y-3 rounded-2xl border bg-card p-5">
            <div className="flex items-baseline justify-between text-sm"><span className="text-muted-foreground">Paid</span><span className="tabular-nums">{money2(paid)} / {money2(total)}</span></div>
            <Progress value={total ? (paid / total) * 100 : 0} className="h-1.5" />
            {inv.plan && (
              <ol className="space-y-2 pt-2 text-sm">
                {inv.plan.map((p) => (
                  <li key={p.id} className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${p.paidAt ? "bg-foreground" : "border border-muted-foreground"}`} />
                    <span className="flex-1">{p.label}<span className="block text-xs text-muted-foreground">{dmy(p.dueAt)}</span></span>
                    <span className="tabular-nums">{money2(p.amount)}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {inv.einvoice && (
            <section className="space-y-2 rounded-2xl border bg-card p-5 text-sm">
              <p className="flex items-center gap-2"><ShieldCheckIcon className="size-4" /> MyInvois</p>
              {inv.einvoice.status === "valid"
                ? <Badge variant="success">Valid</Badge>
                : <Badge variant="warning">Submitted · validating…</Badge>}
              <p className="font-mono text-xs break-all text-muted-foreground">{inv.einvoice.uuid}</p>
            </section>
          )}

          <section className="space-y-3">
            <h2 className="text-sm text-muted-foreground">Timeline</h2>
            <ol className="space-y-3 text-sm">
              {timeline.map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-foreground" />
                  <span>{t.label}<span className="block text-xs text-muted-foreground">{date(t.at)}</span></span>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
      {payable && <RecordPayment invoiceId={inv.id} open={recording} onOpenChange={setRecording} />}
    </>
  );
}
