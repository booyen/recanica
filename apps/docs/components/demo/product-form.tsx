"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@rekanica/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@rekanica/ui/components/card";
import { Checkbox } from "@rekanica/ui/components/checkbox";
import { Field, FieldDescription, FieldError, FieldLabel } from "@rekanica/ui/components/field";
import { Input } from "@rekanica/ui/components/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@rekanica/ui/components/input-group";
import { Label } from "@rekanica/ui/components/label";
import { Textarea } from "@rekanica/ui/components/textarea";
import { ToggleGroup, ToggleGroupItem } from "@rekanica/ui/components/toggle-group";
import { uid, useDemo } from "@/lib/demo/store";
import type { Interval, Product, ProductType } from "@/lib/demo/types";

const BENEFITS = ["License key", "Discord role", "GitHub repository access", "File downloads"];

export function ProductForm({ product }: { product?: Product }) {
  const { dispatch } = useDemo();
  const router = useRouter();
  const [name, setName] = React.useState(product?.name ?? "");
  const [description, setDescription] = React.useState(product?.description ?? "");
  const [type, setType] = React.useState<ProductType>(product?.type ?? "recurring");
  const [interval, setInterval] = React.useState<Interval>(product?.interval ?? "month");
  const [priceText, setPriceText] = React.useState(product ? String(product.price) : "");
  const [benefits, setBenefits] = React.useState<string[]>(product?.benefits ?? []);
  const [touched, setTouched] = React.useState(false);

  const price = Number(priceText);
  const errors = {
    name: !name.trim() ? "Give your product a name." : "",
    price: !priceText || Number.isNaN(price) || price <= 0 ? "Enter a price above RM0." : "",
  };
  const valid = !errors.name && !errors.price;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    const next: Product = {
      id: product?.id ?? uid("prod"),
      name: name.trim(),
      description: description.trim(),
      type,
      price,
      interval: type === "recurring" ? interval : null,
      benefits,
      archived: product?.archived ?? false,
      createdAt: product?.createdAt ?? new Date().toISOString(),
    };
    dispatch({ type: "upsertProduct", product: next });
    toast.success(product ? "Product updated" : "Product created", { description: next.name });
    router.push(`/demo/app/products/${next.id}`);
  };

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]" noValidate>
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent className="grid gap-5">
            <Field data-invalid={touched && !!errors.name}>
              <FieldLabel htmlFor="p-name">Name</FieldLabel>
              <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Pro" aria-invalid={touched && !!errors.name} autoFocus={!product} />
              {touched && errors.name && <FieldError>{errors.name}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="p-desc">Description</FieldLabel>
              <Textarea id="p-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does the customer get?" />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pricing</CardTitle><CardDescription>Recurring creates a subscription on purchase.</CardDescription></CardHeader>
          <CardContent className="grid gap-5">
            <ToggleGroup type="single" value={type} onValueChange={(v) => v && setType(v as ProductType)} variant="outline" className="w-full sm:w-fit">
              <ToggleGroupItem value="recurring" className="flex-1 sm:flex-none">Recurring</ToggleGroupItem>
              <ToggleGroupItem value="one-time" className="flex-1 sm:flex-none">One-time</ToggleGroupItem>
            </ToggleGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={touched && !!errors.price}>
                <FieldLabel htmlFor="p-price">Price</FieldLabel>
                <InputGroup>
                  <InputGroupAddon><InputGroupText>RM</InputGroupText></InputGroupAddon>
                  <InputGroupInput id="p-price" inputMode="decimal" value={priceText} onChange={(e) => setPriceText(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0.00" aria-invalid={touched && !!errors.price} />
                  <InputGroupAddon align="inline-end"><InputGroupText>MYR</InputGroupText></InputGroupAddon>
                </InputGroup>
                {touched && errors.price && <FieldError>{errors.price}</FieldError>}
              </Field>
              {type === "recurring" && (
                <Field>
                  <FieldLabel>Billing interval</FieldLabel>
                  <ToggleGroup type="single" value={interval} onValueChange={(v) => v && setInterval(v as Interval)} variant="outline" className="w-full">
                    <ToggleGroupItem value="month" className="flex-1">Monthly</ToggleGroupItem>
                    <ToggleGroupItem value="year" className="flex-1">Yearly</ToggleGroupItem>
                  </ToggleGroup>
                </Field>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Benefits</CardTitle><CardDescription>Granted automatically on purchase.</CardDescription></CardHeader>
          <CardContent className="grid gap-3">
            {BENEFITS.map((b, i) => (
              <div key={b} className="flex items-center gap-2">
                <Checkbox id={`b-${i}`} checked={benefits.includes(b)} onCheckedChange={(c) => setBenefits((x) => (c ? [...x, b] : x.filter((y) => y !== b)))} />
                <Label htmlFor={`b-${i}`}>{b}</Label>
              </div>
            ))}
            <FieldDescription>Fulfilment is simulated in this demo.</FieldDescription>
          </CardContent>
        </Card>
        <div className="flex gap-2 lg:flex-col">
          <Button type="submit" className="flex-1">{product ? "Save changes" : "Create product"}</Button>
          <Button type="button" variant="ghost" className="flex-1" onClick={() => router.back()}>Cancel</Button>
        </div>
      </div>
    </form>
  );
}
