"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarClockIcon, PlusIcon, SendIcon, ShieldCheckIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@rekanica/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@rekanica/ui/components/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "@rekanica/ui/components/field";
import { Input } from "@rekanica/ui/components/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@rekanica/ui/components/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@rekanica/ui/components/select";
import { Separator } from "@rekanica/ui/components/separator";
import { Switch } from "@rekanica/ui/components/switch";
import { Textarea } from "@rekanica/ui/components/textarea";
import { PageHeader } from "@/components/demo/ui";
import { PLAN_TEMPLATES, TAX, amountInWords, buildPlan, customParts } from "@/lib/demo/my";
import { dmy, money2, uid, useDemo } from "@/lib/demo/store";
import type { TaxCode } from "@/lib/demo/types";

type Row = { key: string; description: string; qty: string; unit: string };
const blank = (): Row => ({ key: uid("row"), description: "", qty: "1", unit: "" });

function NewInvoiceInner() {
  const { state, dispatch } = useDemo();
  const router = useRouter();
  const params = useSearchParams();
  const [customerId, setCustomerId] = React.useState(params.get("customer") ?? "");
  const [rows, setRows] = React.useState<Row[]>([blank()]);
  const [terms, setTerms] = React.useState("14");
  const [tax, setTax] = React.useState<TaxCode>(state.org.defaultTax);
  const [notes, setNotes] = React.useState("Terima kasih. Thank you for your business.");
  const [usePlan, setUsePlan] = React.useState(false);
  const [template, setTemplate] = React.useState<string>(PLAN_TEMPLATES[0].id);
  const [deposit, setDeposit] = React.useState("20");
  const [count, setCount] = React.useState("4");
  const [touched, setTouched] = React.useState(false);

  const customer = state.customers.find((c) => c.id === customerId);
  const items = rows
    .map((r) => ({ description: r.description.trim(), qty: Number(r.qty) || 0, unit: Number(r.unit) || 0 }))
    .filter((r) => r.description && r.qty > 0 && r.unit > 0);
  const subtotal = items.reduce((a, i) => a + i.qty * i.unit, 0);
  const sst = Math.round(subtotal * TAX[tax].rate * 100) / 100;
  const total = Math.round((subtotal + sst) * 100) / 100;

  const today = React.useMemo(() => new Date().toISOString(), []);
  const parts = template === "custom"
    ? customParts(Math.min(90, Math.max(0, Number(deposit) || 0)), Math.min(12, Math.max(1, Number(count) || 1)))
    : PLAN_TEMPLATES.find((t) => t.id === template)!.parts;
  const plan = usePlan && total > 0 ? buildPlan(total, parts, today, "ins") : undefined;

  const errors = { customer: !customerId ? "Choose a customer." : "", items: items.length === 0 ? "Add at least one line with a description, quantity and price." : "" };

  const nextNumber = () => {
    const max = state.invoices.reduce((m, i) => Math.max(m, Number(i.number.split("-").pop()) || 0), 0);
    return `INV-${new Date().getFullYear()}-${String(max + 1).padStart(4, "0")}`;
  };

  const save = (send: boolean) => {
    setTouched(true);
    if (errors.customer || errors.items) return;
    const id = uid("inv");
    const dueAt = plan ? plan[plan.length - 1].dueAt : new Date(Date.now() + Number(terms) * 864e5).toISOString();
    dispatch({
      type: "upsertInvoice",
      invoice: {
        id, number: nextNumber(), customerId, items, tax, status: "draft", createdAt: today, dueAt, notes,
        plan: plan?.map((p) => ({ ...p, id: uid("ins") })),
      },
    });
    if (send) dispatch({ type: "sendInvoice", id });
    toast.success(send ? (state.org.einvoice ? "Invoice sent and submitted to MyInvois" : "Invoice sent") : "Draft saved");
    router.push(`/demo/app/invoices/${id}`);
  };

  const set = (key: string, patch: Partial<Row>) => setRows((r) => r.map((x) => (x.key === key ? { ...x, ...patch } : x)));

  return (
    <>
      <PageHeader title="New invoice" description="Malaysian tax invoice with SST and optional payment plan." back={{ href: "/demo/app/invoices", label: "Invoices" }} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Bill to</CardTitle></CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={touched && !!errors.customer} className="sm:col-span-2">
                <FieldLabel>Customer</FieldLabel>
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Choose a customer" /></SelectTrigger>
                  <SelectContent>
                    {state.customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {touched && errors.customer && <FieldError>{errors.customer}</FieldError>}
                {customer ? (
                  <FieldDescription>
                    {customer.kind === "business" ? "BRN" : "MyKad / Passport"} {customer.regNo ?? "—"} · TIN {customer.tin ?? "—"}
                    {customer.address && <> · {customer.address.city}, {customer.address.state}</>}
                  </FieldDescription>
                ) : (
                  <Link href="/demo/app/customers?new=1" className="text-xs text-muted-foreground hover:text-foreground">+ Add a new customer</Link>
                )}
              </Field>
              <Field>
                <FieldLabel>Payment terms</FieldLabel>
                <Select value={terms} onValueChange={setTerms} disabled={usePlan}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>{["0", "7", "14", "30", "60"].map((t) => <SelectItem key={t} value={t}>{t === "0" ? "Due on receipt" : `Net ${t}`}</SelectItem>)}</SelectContent>
                </Select>
                {usePlan && <FieldDescription>Set by the payment plan.</FieldDescription>}
              </Field>
              <Field>
                <FieldLabel>SST</FieldLabel>
                <Select value={tax} onValueChange={(v) => setTax(v as TaxCode)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>{(Object.keys(TAX) as TaxCode[]).map((k) => <SelectItem key={k} value={k}>{TAX[k].label}</SelectItem>)}</SelectContent>
                </Select>
                <FieldDescription>SST reg. {state.org.sstNo || "not registered"}</FieldDescription>
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Line items</CardTitle><CardDescription>Prices exclude SST.</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              {rows.map((r, idx) => (
                <div key={r.key} className="grid grid-cols-[1fr_auto] gap-2 rounded-xl border p-3 sm:grid-cols-[1fr_5rem_9rem_auto] sm:border-0 sm:p-0">
                  <Input aria-label={`Item ${idx + 1} description`} placeholder="Description" value={r.description} onChange={(e) => set(r.key, { description: e.target.value })} className="col-span-2 sm:col-span-1" />
                  <Input aria-label="Quantity" inputMode="numeric" value={r.qty} onChange={(e) => set(r.key, { qty: e.target.value.replace(/\D/g, "") })} />
                  <InputGroup>
                    <InputGroupAddon><InputGroupText>RM</InputGroupText></InputGroupAddon>
                    <InputGroupInput aria-label="Unit price" inputMode="decimal" placeholder="0.00" value={r.unit} onChange={(e) => set(r.key, { unit: e.target.value.replace(/[^0-9.]/g, "") })} />
                  </InputGroup>
                  <Button variant="ghost" size="icon" aria-label="Remove line" disabled={rows.length === 1} onClick={() => setRows((x) => x.filter((y) => y.key !== r.key))} className="col-start-2 row-start-2 sm:col-start-auto sm:row-start-auto">
                    <Trash2Icon />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setRows((x) => [...x, blank()])}><PlusIcon /> Add line</Button>
              {touched && errors.items && <p className="text-sm text-destructive">{errors.items}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2"><CalendarClockIcon className="size-4" /> Payment plan</CardTitle>
                  <CardDescription className="mt-1.5">Let the customer pay by deposit and instalments. Each instalment gets its own payment link.</CardDescription>
                </div>
                <Switch checked={usePlan} onCheckedChange={setUsePlan} aria-label="Use a payment plan" />
              </div>
            </CardHeader>
            {usePlan && (
              <CardContent className="space-y-4">
                <Field>
                  <FieldLabel>Plan</FieldLabel>
                  <Select value={template} onValueChange={setTemplate}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PLAN_TEMPLATES.map((t) => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}
                      <SelectItem value="custom">Custom deposit + monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                {template === "custom" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="dep">Deposit</FieldLabel>
                      <InputGroup>
                        <InputGroupInput id="dep" inputMode="numeric" value={deposit} onChange={(e) => setDeposit(e.target.value.replace(/\D/g, ""))} />
                        <InputGroupAddon align="inline-end"><InputGroupText>%</InputGroupText></InputGroupAddon>
                      </InputGroup>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="cnt">Monthly instalments</FieldLabel>
                      <Input id="cnt" inputMode="numeric" value={count} onChange={(e) => setCount(e.target.value.replace(/\D/g, ""))} />
                      <FieldDescription>1–12 months</FieldDescription>
                    </Field>
                  </div>
                )}
                {plan ? (
                  <ol className="divide-y rounded-xl border">
                    {plan.map((p) => (
                      <li key={p.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                        <span className="flex-1">{p.label}</span>
                        <span className="text-muted-foreground tabular-nums">{dmy(p.dueAt)}</span>
                        <span className="w-28 text-right tabular-nums">{money2(p.amount)}</span>
                      </li>
                    ))}
                  </ol>
                ) : <p className="text-sm text-muted-foreground">Add line items to see the schedule.</p>}
              </CardContent>
            )}
          </Card>

          <Card>
            <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
            <CardContent><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} /></CardContent>
          </Card>
        </div>

        <div className="space-y-4 lg:sticky lg:top-0 lg:self-start">
          <Card>
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {items.map((i, k) => (
                <div key={k} className="flex justify-between gap-4"><span className="truncate text-muted-foreground">{i.qty} × {i.description}</span><span className="tabular-nums">{money2(i.qty * i.unit)}</span></div>
              ))}
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">{money2(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{TAX[tax].label}</span><span className="tabular-nums">{money2(sst)}</span></div>
              <div className="flex items-baseline justify-between pt-1"><span>Total</span><span className="text-metric font-light tabular-nums">{money2(total)}</span></div>
              {total > 0 && <p className="text-xs text-muted-foreground">{amountInWords(total)}</p>}
              {plan && <p className="text-xs text-muted-foreground">{plan.length} payments · first {money2(plan[0].amount)} due {dmy(plan[0].dueAt)}</p>}
            </CardContent>
          </Card>
          {state.org.einvoice && (
            <p className="flex gap-2 rounded-xl border p-3 text-xs text-muted-foreground">
              <ShieldCheckIcon className="size-4 shrink-0" /> Sending submits this invoice to LHDN MyInvois (simulated) and adds the validation QR code.
            </p>
          )}
          <div className="flex gap-2 lg:flex-col">
            <Button className="flex-1" onClick={() => save(true)}><SendIcon /> Send invoice</Button>
            <Button className="flex-1" variant="outline" onClick={() => save(false)}>Save draft</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function NewInvoicePage() {
  return <React.Suspense><NewInvoiceInner /></React.Suspense>;
}
