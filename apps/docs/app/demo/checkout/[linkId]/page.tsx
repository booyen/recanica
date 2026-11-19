"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckIcon, LockIcon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@recanica/ui/components/empty";
import { Field, FieldError, FieldLabel, FieldMessage } from "@recanica/ui/components/field";
import { focusFirstInvalid } from "@/components/demo/ui";
import { Input } from "@recanica/ui/components/input";
import { NativeSelect, NativeSelectOption } from "@recanica/ui/components/native-select";
import { Separator } from "@recanica/ui/components/separator";
import { Spinner } from "@recanica/ui/components/spinner";
import { COUNTRIES } from "@/lib/demo/countries";
import { money2, price, uid, useDemo } from "@/lib/demo/store";

export default function CheckoutPage({ params }: { params: Promise<{ linkId: string }> }) {
  const { linkId } = React.use(params);
  const { state, dispatch } = useDemo();
  const router = useRouter();
  const link = state.links.find((l) => l.id === linkId);
  const product = link && state.products.find((p) => p.id === link.productId);

  const counted = React.useRef(false);
  React.useEffect(() => {
    if (link && !counted.current) { counted.current = true; dispatch({ type: "visitLink", id: link.id }); }
  }, [link, dispatch]);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [country, setCountry] = React.useState("MY");
  const [busy, setBusy] = React.useState(false);
  const [touched, setTouched] = React.useState(false);
  const errors = { name: !name.trim() ? "Enter your name." : "", email: !/^\S+@\S+\.\S+$/.test(email) ? "Enter a valid email." : "" };

  if (!link || !product || !link.active || product.archived) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background px-gutter">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>This checkout is closed</EmptyTitle>
            <EmptyDescription>The link is paused or no longer exists. <Link href="/demo" className="underline">Demo home</Link></EmptyDescription>
          </EmptyHeader>
        </Empty>
      </main>
    );
  }

  const pay = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (errors.name || errors.email) { focusFirstInvalid(e.currentTarget as HTMLElement); return; }
    setBusy(true);
    const orderId = uid("ord");
    setTimeout(() => {
      dispatch({ type: "checkout", linkId: link.id, productId: product.id, name: name.trim(), email: email.trim(), country, orderId });
      router.push(`/demo/checkout/success?order=${orderId}`);
    }, 1400);
  };

  return (
    <main className="min-h-svh bg-background lg:grid lg:grid-cols-2">
      {/* Summary */}
      <section className="border-b bg-sidebar px-gutter py-10 lg:border-r lg:border-b-0 lg:py-16">
        <div className="mx-auto max-w-md space-y-8 lg:mr-0 lg:ml-auto lg:pr-12">
          <div className="flex items-center gap-2"><span className="size-6 rounded-md bg-brand text-brand-foreground" /><span>{state.org.name}</span></div>
          <div>
            <p className="text-sm text-muted-foreground">{product.name}</p>
            <p className="mt-1 text-display-sm font-light tracking-tight tabular-nums">
              {money2(product.price)}
              {product.interval && <span className="text-base text-muted-foreground"> / {product.interval}</span>}
            </p>
            {product.description && <p className="mt-3 text-sm text-muted-foreground">{product.description}</p>}
          </div>
          {product.benefits.length > 0 && (
            <ul className="space-y-2 text-sm">
              {product.benefits.map((b) => <li key={b} className="flex items-center gap-2"><CheckIcon className="size-4" /> {b}</li>)}
            </ul>
          )}
          <Separator />
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="tabular-nums">{money2(product.price)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Tax</dt><dd className="text-muted-foreground">Included</dd></div>
            <div className="flex justify-between pt-2"><dt>Due today</dt><dd className="tabular-nums">{money2(product.price)}</dd></div>
          </dl>
        </div>
      </section>

      {/* Payment */}
      <section className="px-gutter py-10 lg:py-16">
        <form onSubmit={pay} noValidate className="mx-auto grid max-w-md gap-5 lg:mr-auto lg:ml-0 lg:pl-12">
          <h1 className="text-heading">Pay {state.org.name}</h1>
          <Field data-invalid={touched && !!errors.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="off" />
            {touched && errors.email && <FieldError>{errors.email}</FieldError>}
          </Field>
          <Field data-invalid={touched && !!errors.name}>
            <FieldLabel htmlFor="name">Full name</FieldLabel>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
            {touched && errors.name && <FieldError>{errors.name}</FieldError>}
          </Field>
          <Field>
            <FieldLabel htmlFor="country">Country</FieldLabel>
            <NativeSelect id="country" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full">
              {COUNTRIES.map(([v, l]) => <NativeSelectOption key={v} value={v}>{l}</NativeSelectOption>)}
            </NativeSelect>
          </Field>
          <div className="space-y-2">
            <p className="text-sm">Payment</p>
            <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
              Simulated card · nothing is charged. Payment details are not collected in this demo.
            </div>
          </div>
          {touched && (errors.name || errors.email) && (
            <FieldMessage tone="error">Check the {[errors.email, errors.name].filter(Boolean).length === 2 ? "2 highlighted fields" : "highlighted field"} before paying.</FieldMessage>
          )}
          <Button type="submit" size="lg" variant="brand" disabled={busy} className="w-full">
            {busy ? <><Spinner /> Processing…</> : <>Pay {money2(product.price)}</>}
          </Button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><LockIcon className="size-3" /> Demo checkout powered by Recanica · {price(product)}</p>
        </form>
      </section>
    </main>
  );
}
