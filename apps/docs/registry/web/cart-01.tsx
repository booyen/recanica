"use client";

import * as React from "react";
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";
import { Input } from "@recanica/ui/components/input";
import { Separator } from "@recanica/ui/components/separator";
import { Heading } from "@recanica/ui/components/page";
import { SplitLayout } from "@recanica/ui/components/layout";

const initial = [
  { id: "p1", name: "Kopi Ais Blend", variant: "500g · Whole beans", price: 38, qty: 2 },
  { id: "p3", name: "Enamel Mug", variant: "Grey", price: 29, qty: 1 },
  { id: "p4", name: "Drip Kettle 1L", variant: "Matte black", price: 149, qty: 1 },
];
const rm = (n: number) => `RM${n.toFixed(2)}`;

export function Cart01() {
  const [items, setItems] = React.useState(initial);
  const [code, setCode] = React.useState("");
  const [discount, setDiscount] = React.useState(0);
  const sub = items.reduce((a, i) => a + i.price * i.qty, 0);
  const ship = sub - discount >= 100 || sub === 0 ? 0 : 8;
  const total = sub - discount + ship;
  const setQty = (id: string, d: number) => setItems((x) => x.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i)));
  return (
    <section className="px-gutter py-section-sm">
      <SplitLayout>
        <div>
          <Heading level={1}>Your cart</Heading>
          {items.length === 0 ? (
            <p className="mt-8 text-muted-foreground">Your cart is empty. <a href="/site/shop" className="text-foreground underline underline-offset-4">Continue shopping</a></p>
          ) : (
            <ul className="mt-6 divide-y border-y">
              {items.map((i) => (
                <li key={i.id} className="flex gap-4 py-5">
                  <div className="size-20 shrink-0 rounded-xl border bg-muted sm:size-24" role="img" aria-label={i.name} />
                  <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-start">
                    <div className="flex-1"><p>{i.name}</p><p className="text-sm text-muted-foreground">{i.variant}</p></div>
                    <div className="flex items-center rounded-full border">
                      <Button variant="ghost" size="icon-sm" aria-label="Decrease" onClick={() => setQty(i.id, -1)}><MinusIcon /></Button>
                      <span className="w-6 text-center text-sm tabular-nums">{i.qty}</span>
                      <Button variant="ghost" size="icon-sm" aria-label="Increase" onClick={() => setQty(i.id, 1)}><PlusIcon /></Button>
                    </div>
                    <p className="w-24 text-sm tabular-nums sm:text-right">{rm(i.price * i.qty)}</p>
                  </div>
                  <Button variant="ghost" size="icon-sm" aria-label={`Remove ${i.name}`} onClick={() => setItems((x) => x.filter((y) => y.id !== i.id))}><Trash2Icon /></Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <aside className="h-fit space-y-4 rounded-3xl border bg-card p-6 lg:sticky lg:top-6">
          <h2>Order summary</h2>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setDiscount(code.trim().toUpperCase() === "KOPI10" ? Math.round(sub * 0.1 * 100) / 100 : 0); }}>
            <Input placeholder="Voucher code" aria-label="Voucher code" value={code} onChange={(e) => setCode(e.target.value)} />
            <Button type="submit" variant="outline">Apply</Button>
          </form>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="tabular-nums">{rm(sub)}</dd></div>
            {discount > 0 && <div className="flex justify-between"><dt className="text-muted-foreground">Voucher KOPI10</dt><dd className="tabular-nums">−{rm(discount)}</dd></div>}
            <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd className="tabular-nums">{ship ? rm(ship) : "Free"}</dd></div>
            <Separator />
            <div className="flex items-baseline justify-between"><dt>Total</dt><dd className="text-heading tabular-nums">{rm(total)}</dd></div>
            <p className="text-xs text-muted-foreground">Prices include SST where applicable.</p>
          </dl>
          <Button variant="brand" className="w-full" disabled={!items.length}>Checkout</Button>
        </aside>
      </SplitLayout>
    </section>
  );
}

export default Cart01;
