"use client";

import * as React from "react";
import { CheckIcon, ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";
import { Field, FieldLabel } from "@recanica/ui/components/field";
import { Input } from "@recanica/ui/components/input";
import { NativeSelect, NativeSelectOption } from "@recanica/ui/components/native-select";
import { Textarea } from "@recanica/ui/components/textarea";
import { WebSectionTitle } from "@recanica/ui/components/web-section";

const details = [
  { icon: MailIcon, label: "Email", value: "hello@acme.example" },
  { icon: PhoneIcon, label: "Phone / WhatsApp", value: "+60 3-2711 0000" },
  { icon: MapPinIcon, label: "Office", value: "Level 12, Menara Contoh, Jalan Ampang, 50450 Kuala Lumpur" },
  { icon: ClockIcon, label: "Hours", value: "Mon–Fri, 9am–6pm MYT" },
];

export function Contact01() {
  const [sent, setSent] = React.useState(false);
  return (
    <section className="px-gutter py-section-sm">
      <div className="mx-auto grid max-w-content gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-8">
          <div>
            <WebSectionTitle as="h1">Contact us</WebSectionTitle>
            <p className="mt-3 text-muted-foreground">We reply within one business day. For account issues, sign in and use in-app chat for a faster answer.</p>
          </div>
          <dl className="space-y-5">
            {details.map((d) => (
              <div key={d.label} className="flex gap-3">
                <d.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="text-sm"><dt className="text-muted-foreground">{d.label}</dt><dd>{d.value}</dd></div>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-3xl border bg-card p-6 sm:p-8">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
              <span className="flex size-10 items-center justify-center rounded-full bg-brand text-brand-foreground"><CheckIcon className="size-4" /></span>
              <p className="text-heading">Message sent</p>
              <p className="text-sm text-muted-foreground">We&apos;ll reply to your email by tomorrow.</p>
            </div>
          ) : (
            <form className="grid gap-5 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <Field><FieldLabel htmlFor="c-name">Name</FieldLabel><Input id="c-name" required /></Field>
              <Field><FieldLabel htmlFor="c-email">Email</FieldLabel><Input id="c-email" type="email" required /></Field>
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="c-topic">Topic</FieldLabel>
                <NativeSelect id="c-topic" className="w-full">
                  <NativeSelectOption>Sales question</NativeSelectOption>
                  <NativeSelectOption>Billing</NativeSelectOption>
                  <NativeSelectOption>Partnership</NativeSelectOption>
                  <NativeSelectOption>Something else</NativeSelectOption>
                </NativeSelect>
              </Field>
              <Field className="sm:col-span-2"><FieldLabel htmlFor="c-msg">Message</FieldLabel><Textarea id="c-msg" required className="min-h-32" /></Field>
              <Button type="submit" className="sm:col-span-2 sm:justify-self-start">Send message</Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default Contact01;
