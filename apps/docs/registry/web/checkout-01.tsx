"use client";

import * as React from "react";
import { BuildingIcon, CreditCardIcon, QrCodeIcon } from "lucide-react";
import { Button } from "@rekanica/ui/components/button";
import { Field, FieldLabel } from "@rekanica/ui/components/field";
import { Input } from "@rekanica/ui/components/input";
import { NativeSelect, NativeSelectOption } from "@rekanica/ui/components/native-select";
import { Separator } from "@rekanica/ui/components/separator";
import { cn } from "@rekanica/ui/lib/utils";

const STATES = ["Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan", "Pahang", "Perak", "Perlis", "Pulau Pinang", "Sabah", "Sarawak", "Selangor", "Terengganu", "W.P. Kuala Lumpur", "W.P. Labuan", "W.P. Putrajaya"];
const methods = [{ id: "fpx", label: "FPX online banking", icon: BuildingIcon }, { id: "duitnow", label: "DuitNow QR", icon: QrCodeIcon }, { id: "card", label: "Card", icon: CreditCardIcon }];
const items = [["Kopi Ais Blend × 2", 76], ["Enamel Mug", 29], ["Drip Kettle 1L", 149]] as const;

export function Checkout01() {
  const [method, setMethod] = React.useState("fpx");
  const total = items.reduce((a, [, p]) => a + p, 0);
  return (
    <section className="px-gutter py-section-sm">
      <form className="mx-auto grid max-w-content gap-10 lg:grid-cols-[1fr_22rem]" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-10">
          <h1 className="text-title">Checkout</h1>
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-4 text-heading">Contact</legend>
            <Field><FieldLabel htmlFor="co-email">Email</FieldLabel><Input id="co-email" type="email" autoComplete="email" required /></Field>
            <Field><FieldLabel htmlFor="co-phone">Phone</FieldLabel><Input id="co-phone" type="tel" autoComplete="tel" placeholder="+60" required /></Field>
          </fieldset>
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-4 text-heading">Delivery address</legend>
            <Field className="sm:col-span-2"><FieldLabel htmlFor="co-name">Full name</FieldLabel><Input id="co-name" autoComplete="name" required /></Field>
            <Field className="sm:col-span-2"><FieldLabel htmlFor="co-a1">Address</FieldLabel><Input id="co-a1" autoComplete="address-line1" required /></Field>
            <Field><FieldLabel htmlFor="co-pc">Postcode</FieldLabel><Input id="co-pc" inputMode="numeric" maxLength={5} autoComplete="postal-code" required /></Field>
            <Field><FieldLabel htmlFor="co-city">City</FieldLabel><Input id="co-city" autoComplete="address-level2" required /></Field>
            <Field className="sm:col-span-2"><FieldLabel htmlFor="co-state">State</FieldLabel>
              <NativeSelect id="co-state" className="w-full" defaultValue="Selangor">{STATES.map((s) => <NativeSelectOption key={s}>{s}</NativeSelectOption>)}</NativeSelect>
            </Field>
          </fieldset>
          <fieldset>
            <legend className="mb-4 text-heading">Payment</legend>
            <div role="radiogroup" className="grid gap-2">
              {methods.map((m) => (
                <button type="button" key={m.id} role="radio" aria-checked={method === m.id} onClick={() => setMethod(m.id)} className={cn("flex items-center gap-3 rounded-xl border p-4 text-left text-sm transition-colors hover:bg-accent", method === m.id && "border-foreground/40 bg-accent")}>
                  <m.icon className="size-4 text-muted-foreground" /><span className="flex-1">{m.label}</span><span className={cn("size-4 rounded-full border", method === m.id && "border-[5px] border-foreground")} />
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <aside className="h-fit space-y-4 rounded-3xl border bg-card p-6 lg:sticky lg:top-6">
          <h2>Order</h2>
          <ul className="space-y-2 text-sm">{items.map(([n, p]) => <li key={n} className="flex justify-between gap-4"><span className="text-muted-foreground">{n}</span><span className="tabular-nums">RM{p.toFixed(2)}</span></li>)}</ul>
          <Separator />
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Delivery</span><span>Free</span></div>
          <div className="flex items-baseline justify-between"><span>Total</span><span className="text-heading tabular-nums">RM{total.toFixed(2)}</span></div>
          <Button type="submit" variant="brand" className="w-full">Pay RM{total.toFixed(2)}</Button>
          <p className="text-center text-xs text-muted-foreground">You&apos;ll be redirected to your bank or payment app.</p>
        </aside>
      </form>
    </section>
  );
}

export default Checkout01;
