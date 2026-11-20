"use client";

import * as React from "react";
import { Avatar, AvatarFallback } from "@recanica/ui/components/avatar";
import { Button } from "@recanica/ui/components/button";
import { Field, FieldDescription, FieldLabel } from "@recanica/ui/components/field";
import { Input } from "@recanica/ui/components/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@recanica/ui/components/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@recanica/ui/components/select";
import { Switch } from "@recanica/ui/components/switch";
import { Textarea } from "@recanica/ui/components/textarea";
import { Heading } from "@recanica/ui/components/page";
import { Surface } from "@recanica/ui/components/surface";

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-b py-8 last:border-b-0 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] md:gap-10">
      <div>
        <h2 className="text-base">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-5">{children}</div>
    </section>
  );
}

function ToggleRow({ title, body, defaultChecked }: { title: string; body: string; defaultChecked?: boolean }) {
  return (
    <Surface as="label" size="sm" tone="plain" inset="sm" className="flex items-start justify-between gap-4">
      <span>
        <span className="block text-sm">{title}</span>
        <span className="block text-sm text-muted-foreground">{body}</span>
      </span>
      <Switch defaultChecked={defaultChecked} />
    </Surface>
  );
}

export default function SettingsPage() {
  const [dirty, setDirty] = React.useState(false);
  return (
    <div className="mx-auto max-w-content px-gutter py-8 pb-28" onChange={() => setDirty(true)}>
      <Heading level={1}>Settings</Heading>
      <p className="mt-1 text-sm text-muted-foreground">Manage your organization profile and preferences.</p>

      <Section title="Profile" description="How your organization appears to customers.">
        <div className="flex items-center gap-4">
          <Avatar className="size-14"><AvatarFallback className="text-sm">AS</AvatarFallback></Avatar>
          <Button variant="outline" size="sm">Upload logo</Button>
        </div>
        <Field><FieldLabel htmlFor="s-name">Name</FieldLabel><Input id="s-name" defaultValue="Acme Studio" /></Field>
        <Field>
          <FieldLabel htmlFor="s-slug">Store URL</FieldLabel>
          <InputGroup>
            <InputGroupAddon><InputGroupText>aturanica.com/</InputGroupText></InputGroupAddon>
            <InputGroupInput id="s-slug" defaultValue="acme-studio" />
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="s-bio">Description</FieldLabel>
          <Textarea id="s-bio" defaultValue="Design tools for small teams." />
          <FieldDescription>Shown on your storefront. Max 160 characters.</FieldDescription>
        </Field>
      </Section>

      <Section title="Billing" description="Defaults used when you create new products.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel>Currency</FieldLabel>
            <Select defaultValue="usd">
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="usd">USD</SelectItem><SelectItem value="eur">EUR</SelectItem><SelectItem value="myr">MYR</SelectItem></SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Tax behavior</FieldLabel>
            <Select defaultValue="exclusive">
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="exclusive">Exclusive</SelectItem><SelectItem value="inclusive">Inclusive</SelectItem></SelectContent>
            </Select>
          </Field>
        </div>
      </Section>

      <Section title="Notifications" description="Choose what we email you about.">
        <ToggleRow title="New orders" body="Every successful payment." defaultChecked />
        <ToggleRow title="Cancellations" body="When a subscription is canceled." defaultChecked />
        <ToggleRow title="Weekly summary" body="Revenue and activity every Monday." />
      </Section>

      {/* Sticky save bar appears once something changes */}
      <div
        className={`fixed inset-x-0 bottom-0 border-t bg-background/90 backdrop-blur transition-transform duration-300 ease-out-soft ${dirty ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="mx-auto flex max-w-content items-center justify-between gap-3 px-gutter py-3">
          <p className="text-sm text-muted-foreground">You have unsaved changes.</p>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setDirty(false)}>Discard</Button>
            <Button onClick={() => setDirty(false)}>Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
