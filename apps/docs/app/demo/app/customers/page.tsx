"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon, UserPlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@recanica/ui/components/avatar";
import { Button } from "@recanica/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@recanica/ui/components/dialog";
import { Field, FieldError, FieldLabel, FieldMessage } from "@recanica/ui/components/field";
import { Input } from "@recanica/ui/components/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@recanica/ui/components/input-group";
import { NativeSelect, NativeSelectOption } from "@recanica/ui/components/native-select";
import { ToggleGroup, ToggleGroupItem } from "@recanica/ui/components/toggle-group";
import { GENERAL_TIN, STATES } from "@/lib/demo/my";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@recanica/ui/components/table";
import { PageHeader, focusFirstInvalid } from "@/components/demo/ui";
import { COUNTRIES } from "@/lib/demo/countries";
import { initials, money, shortDate, uid, useDemo } from "@/lib/demo/store";

function NewCustomer({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { state, dispatch } = useDemo();
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [country, setCountry] = React.useState("MY");
  const [kind, setKind] = React.useState<"business" | "individual">("business");
  const [tin, setTin] = React.useState("");
  const [regNo, setRegNo] = React.useState("");
  const [state_, setState_] = React.useState("Selangor");
  const [touched, setTouched] = React.useState(false);
  const dup = state.customers.some((c) => c.email.toLowerCase() === email.trim().toLowerCase());
  const emailErr = !/^\S+@\S+\.\S+$/.test(email) ? "Enter a valid email." : dup ? "A customer with this email exists." : "";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!name.trim() || emailErr) { focusFirstInvalid(e.currentTarget as HTMLElement); return; }
    const fallbackTin = country === "MY" ? GENERAL_TIN.individual : GENERAL_TIN.foreign;
    const customer = {
      id: uid("cus"), name: name.trim(), email: email.trim(), country, createdAt: new Date().toISOString(),
      kind, tin: tin.trim() || fallbackTin, regNo: regNo.trim() || undefined,
      address: country === "MY" ? { line1: "", postcode: "", city: "", state: state_ } : undefined,
    };
    dispatch({ type: "createCustomer", customer });
    toast.success("Customer added", { description: customer.name });
    onOpenChange(false);
    router.push(`/demo/app/customers/${customer.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) { setName(""); setEmail(""); setTouched(false); } }}>
      <DialogContent>
        <form onSubmit={submit} className="grid gap-4" noValidate>
          <DialogHeader><DialogTitle>New customer</DialogTitle><DialogDescription>Add someone you want to invoice.</DialogDescription></DialogHeader>
          <ToggleGroup type="single" value={kind} onValueChange={(v) => v && setKind(v as typeof kind)} variant="outline" className="w-full">
            <ToggleGroupItem value="business" className="flex-1">Business</ToggleGroupItem>
            <ToggleGroupItem value="individual" className="flex-1">Individual</ToggleGroupItem>
          </ToggleGroup>
          <Field data-invalid={touched && !name.trim()}>
            <FieldLabel htmlFor="c-name">{kind === "business" ? "Registered business name" : "Full name (as per MyKad)"}</FieldLabel>
            <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            {touched && !name.trim() && <FieldError>Enter a name.</FieldError>}
          </Field>
          <Field data-invalid={touched && !!emailErr}>
            <FieldLabel htmlFor="c-email">Email</FieldLabel>
            <Input id="c-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {touched && emailErr && <FieldError>{emailErr}</FieldError>}
          </Field>
          <Field>
            <FieldLabel htmlFor="c-country">Country</FieldLabel>
            <NativeSelect id="c-country" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full">
              {COUNTRIES.map(([v, l]) => <NativeSelectOption key={v} value={v}>{l}</NativeSelectOption>)}
            </NativeSelect>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="c-reg">{kind === "business" ? "SSM BRN" : "MyKad / Passport no."}</FieldLabel>
              <Input id="c-reg" value={regNo} onChange={(e) => setRegNo(e.target.value)} placeholder={kind === "business" ? "202301234567" : "900101-14-5678"} />
            </Field>
            <Field>
              <FieldLabel htmlFor="c-tin">TIN</FieldLabel>
              <Input id="c-tin" value={tin} onChange={(e) => setTin(e.target.value.toUpperCase())} placeholder={country === "MY" ? GENERAL_TIN.individual : GENERAL_TIN.foreign} />
            </Field>
          </div>
          {country === "MY" && (
            <Field>
              <FieldLabel htmlFor="c-state">State</FieldLabel>
              <NativeSelect id="c-state" value={state_} onChange={(e) => setState_(e.target.value)} className="w-full">
                {STATES.map((s) => <NativeSelectOption key={s} value={s}>{s}</NativeSelectOption>)}
              </NativeSelect>
            </Field>
          )}
          <FieldMessage tone="info">No TIN? LHDN's general TIN is used automatically for e-Invoice.</FieldMessage>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Add customer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CustomersInner() {
  const { state } = useDemo();
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState(params.get("new") === "1");
  const list = state.customers.filter((c) => `${c.name} ${c.email}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader title="Customers" description={`${state.customers.length} customers`} actions={<Button onClick={() => setOpen(true)}><UserPlusIcon /> New customer</Button>} />
      <InputGroup className="mb-4 sm:max-w-xs">
        <InputGroupAddon><SearchIcon /></InputGroupAddon>
        <InputGroupInput placeholder="Search customers" aria-label="Search customers" value={q} onChange={(e) => setQ(e.target.value)} />
      </InputGroup>
      <div className="overflow-hidden rounded-2xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Since</TableHead>
              <TableHead className="text-right">Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((c) => {
              const spent = state.orders.filter((o) => o.customerId === c.id && o.status === "paid").reduce((a, o) => a + o.amount, 0);
              return (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => router.push(`/demo/app/customers/${c.id}`)}>
                  <TableCell className="pl-4">
                    <Link href={`/demo/app/customers/${c.id}`} className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                      <Avatar className="size-8"><AvatarFallback>{initials(c.name)}</AvatarFallback></Avatar>
                      <span>{c.name}<span className="block text-xs text-muted-foreground">{c.email}</span></span>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">{shortDate(c.createdAt)}</TableCell>
                  <TableCell className="text-right tabular-nums">{money(spent)}</TableCell>
                </TableRow>
              );
            })}
            {list.length === 0 && <TableRow><TableCell colSpan={3} className="h-28 text-center text-muted-foreground">No customers match “{q}”.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
      <NewCustomer open={open} onOpenChange={setOpen} />
    </>
  );
}

export default function CustomersPage() {
  return <React.Suspense><CustomersInner /></React.Suspense>;
}
