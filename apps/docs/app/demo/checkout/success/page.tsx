"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckIcon, CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@rekanica/ui/components/button";
import { Separator } from "@rekanica/ui/components/separator";
import { date, money2, useDemo } from "@/lib/demo/store";

function licenseKey(orderId: string) {
  const s = orderId.replace(/[^a-z0-9]/gi, "").toUpperCase().padEnd(8, "X");
  return `ATN-${s.slice(-8, -4)}-${s.slice(-4)}-DEMO`;
}

function SuccessInner() {
  const { state } = useDemo();
  const order = state.orders.find((o) => o.id === useSearchParams().get("order"));
  const product = order && state.products.find((p) => p.id === order.productId);
  const customer = order && state.customers.find((c) => c.id === order.customerId);

  if (!order || !product || !customer) {
    return <p className="text-center text-muted-foreground">Order not found. <Link href="/demo" className="underline">Demo home</Link></p>;
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-3 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-metallic"><CheckIcon className="size-5" /></span>
        <h1 className="text-title">Thanks, {customer.name.split(" ")[0]}!</h1>
        <p className="text-muted-foreground">Your payment to {state.org.name} was successful. A receipt is on its way to {customer.email}.</p>
      </div>
      <div className="rounded-2xl border bg-card p-6 text-sm">
        <div className="flex justify-between"><span>{product.name}</span><span className="tabular-nums">{money2(order.amount)}</span></div>
        <Separator className="my-4" />
        <dl className="space-y-2 text-muted-foreground">
          <div className="flex justify-between"><dt>Order</dt><dd className="font-mono text-xs">{order.id}</dd></div>
          <div className="flex justify-between"><dt>Date</dt><dd>{date(order.createdAt)}</dd></div>
        </dl>
        {product.benefits.includes("License key") && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border bg-panel p-3">
            <span className="flex-1 font-mono text-xs">{licenseKey(order.id)}</span>
            <Button size="icon-sm" variant="ghost" aria-label="Copy license key" onClick={() => { navigator.clipboard?.writeText(licenseKey(order.id)).catch(() => {}); toast("License key copied"); }}><CopyIcon /></Button>
          </div>
        )}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button asChild variant="outline"><Link href="/demo">Demo home</Link></Button>
        <Button asChild><Link href={state.signedIn ? "/demo/app/sales" : "/demo/sign-in"}>See it in the dashboard</Link></Button>
      </div>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-gutter py-12">
      <React.Suspense><SuccessInner /></React.Suspense>
    </main>
  );
}
