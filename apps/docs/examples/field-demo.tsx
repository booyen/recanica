"use client";

import * as React from "react";
import { Button } from "@recanica/ui/components/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldMessage, FieldSet } from "@recanica/ui/components/field";
import { Input } from "@recanica/ui/components/input";

export default function FieldDemo() {
  const [email, setEmail] = React.useState("nadia@acme");
  const [slug, setSlug] = React.useState("acme-studio");
  const [touched, setTouched] = React.useState(true);
  const emailErr = /^\S+@\S+\.\S+$/.test(email) ? "" : "Enter a full email address, like nadia@acme.example.";
  return (
    <form className="w-full max-w-md" noValidate onSubmit={(e) => { e.preventDefault(); setTouched(true); }}>
      <FieldSet>
        <FieldLegend>Organization</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="f-name">Name</FieldLabel>
            <Input id="f-name" placeholder="Acme Studio" />
            <FieldDescription>Shown on invoices and checkout.</FieldDescription>
          </Field>
          <Field data-invalid={touched && !!emailErr}>
            <FieldLabel htmlFor="f-email">Billing email</FieldLabel>
            <Input id="f-email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {touched && emailErr ? <FieldError>{emailErr}</FieldError> : <FieldMessage tone="success">Receipts will be sent here.</FieldMessage>}
          </Field>
          <Field>
            <FieldLabel htmlFor="f-slug">Store URL</FieldLabel>
            <Input id="f-slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
            <FieldMessage tone="warning">Changing this breaks links you've already shared.</FieldMessage>
          </Field>
          <FieldMessage tone="info">Changes apply to new invoices only.</FieldMessage>
          <Button type="submit" className="justify-self-start">Save</Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
