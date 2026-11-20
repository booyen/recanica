"use client";

import * as React from "react";
import Link from "next/link";
import { CheckIcon, LockIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@recanica/ui/components/button";
import { Progress } from "@recanica/ui/components/progress";
import { Spinner } from "@recanica/ui/components/spinner";
import { Tabs, TabsList, TabsTrigger } from "@recanica/ui/components/tabs";
import { InvoiceDocument } from "@/components/demo/invoice-document";
import { PaymentMethodPicker, methodLabel, type PayMethod } from "@/components/demo/my-ui";
import { FPX_BANKS } from "@/lib/demo/my";
import { dmy, invoiceBalance, invoiceGrand, invoicePaid, money2, nextInstallment, useDemo } from "@/lib/demo/store";
import { Surface } from "@recanica/ui/components/surface";
import { IconBadge } from "@recanica/ui/components/layout";

export default function PayInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { state, dispatch } = useDemo();
  const inv = state.invoices.find((i) => i.id === id);
  const [busy, setBusy] = React.useState(false);
  const [method, setMethod] = React.useState<PayMethod>("fpx");
  const [bank, setBank] = React.useState(FPX_BANKS[0]);
  const [scope, setScope] = React.useState<"next" | "full">("next");

  if (!inv || inv.status === "draft" || inv.status === "void") {
    return <main className="flex min-h-svh items-center justify-center p-6 text-muted-foreground">This invoice isn't available. <Link href="/demo" className="ml-1 underline">Demo home</Link></main>;
  }

  const next = nextInstallment(inv);
  const total = invoiceGrand(inv);
  const paid = invoicePaid(inv);
  const amount = next && scope === "next" ? next.amount : invoiceBalance(inv);

  const pay = () => {
    setBusy(true);
    const label = methodLabel(method, bank);
    setTimeout(() => {
      if (next && scope === "next") dispatch({ type: "payInstallment", id: inv.id, installmentId: next.id, method: label });
      else dispatch({ type: "payInvoice", id: inv.id, method: label });
      setBusy(false);
      toast.success("Payment successful", { description: `${money2(amount)} via ${label}` });
    }, 1400);
  };

  return (
    <main className="min-h-svh bg-sidebar px-gutter py-10">
      <div className="mx-auto grid max-w-content gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="order-2 lg:order-1"><InvoiceDocument invoice={inv} /></div>

        <aside className="order-1 space-y-4 lg:sticky lg:top-6 lg:order-2 lg:self-start">
          <Surface tone="panel" className="space-y-5">
            <div className="flex items-center gap-2 text-sm"><span className="size-5 rounded-md bg-brand text-brand-foreground" /> {state.org.name}</div>
            {inv.status === "paid" ? (
              <div className="space-y-3 text-center">
                <IconBadge className="mx-auto"><CheckIcon className="size-5" /></IconBadge>
                <p className="text-title">Paid in full</p>
                <p className="text-sm text-muted-foreground">Terima kasih! {money2(total)} received{inv.paidAt ? ` on ${dmy(inv.paidAt)}` : ""}.</p>
              </div>
            ) : (
              <>
                {next && (
                  <Tabs value={scope} onValueChange={(v) => setScope(v as "next" | "full")}>
                    <TabsList className="w-full">
                      <TabsTrigger value="next" className="flex-1">{next.label}</TabsTrigger>
                      <TabsTrigger value="full" className="flex-1">Full balance</TabsTrigger>
                    </TabsList>
                  </Tabs>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">{next && scope === "next" ? `${next.label} · due ${dmy(next.dueAt)}` : "Amount due"}</p>
                  <p className="text-metric font-light tabular-nums">{money2(amount)}</p>
                </div>
                {inv.plan && (
                  <div className="space-y-1.5">
                    <Progress value={(paid / total) * 100} className="h-1.5" />
                    <p className="text-xs text-muted-foreground tabular-nums">{money2(paid)} of {money2(total)} paid · {inv.plan.filter((p) => p.paidAt).length}/{inv.plan.length} payments</p>
                  </div>
                )}
                <PaymentMethodPicker amountLabel={money2(amount)} value={method} onChange={setMethod} bank={bank} onBank={setBank} reference={`${inv.number}-${next?.id ?? "full"}`} />
                <Button size="lg" variant="brand" className="w-full" disabled={busy} onClick={pay}>
                  {busy ? <><Spinner /> {method === "fpx" ? `Redirecting to ${bank}…` : "Processing…"}</> : <>Pay {money2(amount)}</>}
                </Button>
                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><LockIcon className="size-3" /> Simulated payment · nothing is charged</p>
              </>
            )}
          </Surface>
        </aside>
      </div>
    </main>
  );
}
