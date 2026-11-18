"use client";

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@rekanica/ui/components/field";
import { Input } from "@rekanica/ui/components/input";

export default function FieldDemo() {
  return (
    <FieldSet className="w-full max-w-md">
      <FieldLegend>Organization</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="f-name">Name</FieldLabel>
          <Input id="f-name" placeholder="Acme Studio" />
          <FieldDescription>Shown on invoices and checkout.</FieldDescription>
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor="f-slug">Slug</FieldLabel>
          <Input id="f-slug" defaultValue="acme studio" aria-invalid />
          <FieldError>Only lowercase letters, numbers and dashes.</FieldError>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
