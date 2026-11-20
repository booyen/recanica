"use client";

import * as React from "react";
import { Button } from "@recanica/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@recanica/ui/components/card";
import { Checkbox } from "@recanica/ui/components/checkbox";
import { Field, FieldDescription, FieldLabel } from "@recanica/ui/components/field";
import { Input } from "@recanica/ui/components/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@recanica/ui/components/input-group";
import { Label } from "@recanica/ui/components/label";
import { Switch } from "@recanica/ui/components/switch";
import { Textarea } from "@recanica/ui/components/textarea";
import { ToggleGroup, ToggleGroupItem } from "@recanica/ui/components/toggle-group";
import { Heading } from "@recanica/ui/components/page";

const benefits = ["License key", "Discord role", "GitHub repository access", "File downloads"];

export default function CreateForm() {
  const [billing, setBilling] = React.useState("recurring");
  return (
    <form className="mx-auto grid max-w-content gap-6 px-gutter py-8 lg:grid-cols-[minmax(0,1fr)_20rem]" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-6">
        <div>
          <Heading level={1}>New product</Heading>
          <p className="mt-1 text-sm text-muted-foreground">Create a product your customers can buy.</p>
        </div>

        <Card>
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent className="grid gap-5">
            <Field><FieldLabel htmlFor="p-name">Name</FieldLabel><Input id="p-name" placeholder="Pro" /></Field>
            <Field>
              <FieldLabel htmlFor="p-desc">Description</FieldLabel>
              <Textarea id="p-desc" placeholder="What does the customer get?" />
              <FieldDescription>Markdown supported.</FieldDescription>
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pricing</CardTitle><CardDescription>One-time or recurring.</CardDescription></CardHeader>
          <CardContent className="grid gap-5">
            <ToggleGroup type="single" value={billing} onValueChange={(v) => v && setBilling(v)} variant="outline" className="w-full sm:w-fit">
              <ToggleGroupItem value="recurring" className="flex-1 sm:flex-none">Recurring</ToggleGroupItem>
              <ToggleGroupItem value="one-time" className="flex-1 sm:flex-none">One-time</ToggleGroupItem>
              <ToggleGroupItem value="pwyw" className="flex-1 sm:flex-none"><span className="sm:hidden">Flexible</span><span className="hidden sm:inline">Pay what you want</span></ToggleGroupItem>
            </ToggleGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="p-price">Price</FieldLabel>
                <InputGroup>
                  <InputGroupAddon><InputGroupText>$</InputGroupText></InputGroupAddon>
                  <InputGroupInput id="p-price" placeholder="0.00" inputMode="decimal" />
                  <InputGroupAddon align="inline-end"><InputGroupText>{billing === "recurring" ? "/ month" : "USD"}</InputGroupText></InputGroupAddon>
                </InputGroup>
              </Field>
              {billing === "recurring" && (
                <Field>
                  <FieldLabel htmlFor="p-trial">Free trial</FieldLabel>
                  <InputGroup>
                    <InputGroupInput id="p-trial" placeholder="0" inputMode="numeric" />
                    <InputGroupAddon align="inline-end"><InputGroupText>days</InputGroupText></InputGroupAddon>
                  </InputGroup>
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
            {benefits.map((b, i) => (
              <div key={b} className="flex items-center gap-2">
                <Checkbox id={`b-${i}`} defaultChecked={i === 0} />
                <Label htmlFor={`b-${i}`}>{b}</Label>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between gap-4">
            <div><p className="text-sm">Visible in storefront</p><p className="text-sm text-muted-foreground">Customers can find it.</p></div>
            <Switch defaultChecked />
          </CardContent>
        </Card>
        <div className="flex gap-2 lg:flex-col">
          <Button type="submit" className="flex-1">Create product</Button>
          <Button type="button" variant="ghost" className="flex-1">Cancel</Button>
        </div>
      </div>
    </form>
  );
}
