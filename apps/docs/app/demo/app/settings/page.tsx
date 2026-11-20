"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@recanica/ui/components/alert-dialog";
import { Button } from "@recanica/ui/components/button";
import { Field, FieldDescription, FieldLabel, FieldMessage } from "@recanica/ui/components/field";
import { Input } from "@recanica/ui/components/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@recanica/ui/components/input-group";
import { NativeSelect, NativeSelectOption } from "@recanica/ui/components/native-select";
import { Switch } from "@recanica/ui/components/switch";
import { PageHeader } from "@/components/demo/ui";
import { useDemo } from "@/lib/demo/store";
import { STATES, TAX } from "@/lib/demo/my";
import type { Org, TaxCode } from "@/lib/demo/types";
import { Surface } from "@recanica/ui/components/surface";

function Row({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-b py-8 first:pt-0 last:border-b-0 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:gap-10">
      <div><h2 className="text-base">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{description}</p></div>
      <div className="grid gap-5">{children}</div>
    </section>
  );
}

export default function SettingsPage() {
  const { state, dispatch } = useDemo();
  const [draft, setDraft] = React.useState<Org>(state.org);
  const [confirm, setConfirm] = React.useState("");
  React.useEffect(() => setDraft(state.org), [state.org]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(state.org);
  const set = (patch: Partial<Org>) => setDraft((d) => ({ ...d, ...patch }));

  return (
    <div className="pb-20">
      <PageHeader title="Settings" description="Organization profile and preferences." />
      <Row title="Profile" description="How you appear to customers.">
        <Field><FieldLabel htmlFor="o-name">Name</FieldLabel><Input id="o-name" value={draft.name} onChange={(e) => set({ name: e.target.value })} /></Field>
        <Field>
          <FieldLabel htmlFor="o-slug">Store URL</FieldLabel>
          <InputGroup>
            <InputGroupAddon><InputGroupText>aturanica.com/</InputGroupText></InputGroupAddon>
            <InputGroupInput id="o-slug" value={draft.slug} onChange={(e) => set({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} />
          </InputGroup>
          {draft.slug.length < 3 ? <FieldMessage tone="warning">Use at least 3 characters.</FieldMessage> : <FieldMessage tone="success">aturanica.com/{draft.slug} is available.</FieldMessage>}
        </Field>
        <Field>
          <FieldLabel htmlFor="o-email">Billing email</FieldLabel>
          <Input id="o-email" type="email" value={draft.email} onChange={(e) => set({ email: e.target.value })} />
          <FieldDescription>Shown on invoices and receipts.</FieldDescription>
        </Field>
      </Row>
      <Row title="Business registration" description="Printed on every invoice. Required for LHDN e-Invoice.">
        <Field><FieldLabel htmlFor="o-legal">Registered name</FieldLabel><Input id="o-legal" value={draft.legalName} onChange={(e) => set({ legalName: e.target.value })} /></Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="o-brn">SSM registration no. (BRN)</FieldLabel>
            <Input id="o-brn" value={draft.brn} onChange={(e) => set({ brn: e.target.value })} />
            <FieldDescription>New 12-digit format, old number in brackets.</FieldDescription>
          </Field>
          <Field><FieldLabel htmlFor="o-tin">Tax identification no. (TIN)</FieldLabel><Input id="o-tin" value={draft.tin} onChange={(e) => set({ tin: e.target.value.toUpperCase() })} /></Field>
          <Field>
            <FieldLabel htmlFor="o-sst">SST registration no.</FieldLabel>
            <Input id="o-sst" value={draft.sstNo} onChange={(e) => set({ sstNo: e.target.value.toUpperCase() })} placeholder="Leave empty if not registered" />
          </Field>
          <Field>
            <FieldLabel htmlFor="o-msic">MSIC code</FieldLabel>
            <Input id="o-msic" value={draft.msic} onChange={(e) => set({ msic: e.target.value.replace(/\D/g, "").slice(0, 5) })} />
            <FieldDescription>{draft.msicDesc}</FieldDescription>
          </Field>
        </div>
        <Field><FieldLabel htmlFor="o-a1">Address</FieldLabel><Input id="o-a1" value={draft.address.line1} onChange={(e) => set({ address: { ...draft.address, line1: e.target.value } })} /></Field>
        <Input aria-label="Address line 2" value={draft.address.line2 ?? ""} onChange={(e) => set({ address: { ...draft.address, line2: e.target.value } })} />
        <div className="grid gap-5 sm:grid-cols-3">
          <Field><FieldLabel htmlFor="o-pc">Postcode</FieldLabel><Input id="o-pc" inputMode="numeric" value={draft.address.postcode} onChange={(e) => set({ address: { ...draft.address, postcode: e.target.value.replace(/\D/g, "").slice(0, 5) } })} /></Field>
          <Field><FieldLabel htmlFor="o-city">City</FieldLabel><Input id="o-city" value={draft.address.city} onChange={(e) => set({ address: { ...draft.address, city: e.target.value } })} /></Field>
          <Field>
            <FieldLabel htmlFor="o-state">State</FieldLabel>
            <NativeSelect id="o-state" value={draft.address.state} onChange={(e) => set({ address: { ...draft.address, state: e.target.value } })} className="w-full">
              {STATES.map((s) => <NativeSelectOption key={s} value={s}>{s}</NativeSelectOption>)}
            </NativeSelect>
          </Field>
        </div>
      </Row>
      <Row title="Invoicing" description="Defaults for new invoices and how customers pay you.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="o-tax">Default SST</FieldLabel>
            <NativeSelect id="o-tax" value={draft.defaultTax} onChange={(e) => set({ defaultTax: e.target.value as TaxCode })} className="w-full">
              {(Object.keys(TAX) as TaxCode[]).map((k) => <NativeSelectOption key={k} value={k}>{TAX[k].label}</NativeSelectOption>)}
            </NativeSelect>
          </Field>
          <Field><FieldLabel htmlFor="o-duit">DuitNow ID</FieldLabel><Input id="o-duit" value={draft.duitnowId} onChange={(e) => set({ duitnowId: e.target.value })} /></Field>
          <Field><FieldLabel htmlFor="o-bank">Bank</FieldLabel><Input id="o-bank" value={draft.bank.name} onChange={(e) => set({ bank: { ...draft.bank, name: e.target.value } })} /></Field>
          <Field><FieldLabel htmlFor="o-acct">Account no.</FieldLabel><Input id="o-acct" value={draft.bank.account} onChange={(e) => set({ bank: { ...draft.bank, account: e.target.value } })} /></Field>
        </div>
        <Surface as="label" size="sm" tone="plain" inset="sm" className="flex items-start justify-between gap-4">
          <span>
            <span className="block text-sm">LHDN MyInvois e-Invoice</span>
            <span className="block text-sm text-muted-foreground">Submit invoices for validation when sent and print the validation QR code. Simulated in this demo.</span>
          </span>
          <Switch checked={draft.einvoice} onCheckedChange={(c) => set({ einvoice: c })} />
        </Surface>
      </Row>
      <Row title="Notifications" description="What appears in your activity feed emails.">
        {([["orders", "New orders", "Every successful payment."], ["cancellations", "Cancellations", "When a subscription is canceled."], ["weekly", "Weekly summary", "Revenue every Monday."]] as const).map(([k, t, d]) => (
          <Surface as="label" size="sm" tone="plain" inset="sm" className="flex items-start justify-between gap-4" key={k}>
            <span><span className="block text-sm">{t}</span><span className="block text-sm text-muted-foreground">{d}</span></span>
            <Switch checked={draft.notify[k]} onCheckedChange={(c) => set({ notify: { ...draft.notify, [k]: c } })} />
          </Surface>
        ))}
      </Row>
      <Row title="Demo data" description="Start over with the original sample data.">
        <Surface tone="plain" className="flex flex-col gap-3 border-destructive/40 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-sm">Reset everything</p><p className="text-sm text-muted-foreground">Products, customers, orders and invoices go back to the seed.</p></div>
          <AlertDialog onOpenChange={() => setConfirm("")}>
            <AlertDialogTrigger asChild><Button variant="destructive">Reset</Button></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset demo data?</AlertDialogTitle>
                <AlertDialogDescription>Everything you created in this browser will be removed.</AlertDialogDescription>
              </AlertDialogHeader>
              <Field>
                <FieldLabel htmlFor="confirm">Type <span className="font-mono text-foreground">reset</span> to confirm</FieldLabel>
                <Input id="confirm" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="off" />
              </Field>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button variant="destructive" disabled={confirm !== "reset"} onClick={() => { dispatch({ type: "reset" }); toast("Demo data reset"); setConfirm(""); }}>Reset demo</Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Surface>
      </Row>

      <div className={`fixed inset-x-0 bottom-0 z-30 border-t bg-background/90 backdrop-blur transition-transform duration-300 ease-out-soft ${dirty ? "translate-y-0" : "translate-y-full"}`}>
        <div className="mx-auto flex max-w-content items-center justify-between gap-3 px-gutter py-3">
          <p className="text-sm text-muted-foreground">Unsaved changes</p>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setDraft(state.org)}>Discard</Button>
            <Button onClick={() => { dispatch({ type: "updateOrg", patch: draft }); toast.success("Settings saved"); }}>Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
