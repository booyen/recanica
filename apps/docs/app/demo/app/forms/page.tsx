"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CalendarIcon, InfoIcon, SearchIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@recanica/ui/components/alert";
import { Button } from "@recanica/ui/components/button";
import { ButtonGroup } from "@recanica/ui/components/button-group";
import { Calendar } from "@recanica/ui/components/calendar";
import { Checkbox } from "@recanica/ui/components/checkbox";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@recanica/ui/components/combobox";
import {
  Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldMessage, FieldSeparator, FieldSet, FieldTitle,
} from "@recanica/ui/components/field";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@recanica/ui/components/form";
import { Input } from "@recanica/ui/components/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@recanica/ui/components/input-group";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@recanica/ui/components/input-otp";
import { NativeSelect, NativeSelectOption } from "@recanica/ui/components/native-select";
import { Popover, PopoverContent, PopoverTrigger } from "@recanica/ui/components/popover";
import { Progress } from "@recanica/ui/components/progress";
import { RadioGroup, RadioGroupItem } from "@recanica/ui/components/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@recanica/ui/components/select";
import { Slider } from "@recanica/ui/components/slider";
import { Switch } from "@recanica/ui/components/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@recanica/ui/components/tabs";
import { Textarea } from "@recanica/ui/components/textarea";
import { ToggleGroup, ToggleGroupItem } from "@recanica/ui/components/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@recanica/ui/components/tooltip";
import { PageHeader, focusFirstInvalid } from "@/components/demo/ui";

const STATES = [
  "Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan", "Pahang", "Perak", "Perlis", "Pulau Pinang", "Sabah", "Sarawak",
  "Selangor", "Terengganu", "W.P. Kuala Lumpur", "W.P. Labuan", "W.P. Putrajaya",
];

function Panel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card">
      <header className="border-b px-5 py-3.5">
        <h2 className="text-sm">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

/* ---------- 1. States ---------- */
function States() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Field states" description="Every state a field can be in. Messages are tinted notices, by intent.">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="s-default">Default</FieldLabel>
            <Input id="s-default" placeholder="Kedai Kopi Aman" />
            <FieldDescription>Shown on invoices and receipts.</FieldDescription>
          </Field>
          <Field data-invalid>
            <FieldLabel htmlFor="s-error">Error</FieldLabel>
            <Input id="s-error" defaultValue="20230101" />
            <FieldError>SSM number must be 12 digits, e.g. 202301012345.</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="s-warn">Warning</FieldLabel>
            <Input id="s-warn" defaultValue="aman-kopi" />
            <FieldMessage tone="warning">Changing your slug breaks links you already shared.</FieldMessage>
          </Field>
          <Field>
            <FieldLabel htmlFor="s-ok">Success</FieldLabel>
            <Input id="s-ok" defaultValue="C10-1234-56789012" />
            <FieldMessage tone="success">SST number verified with Customs.</FieldMessage>
          </Field>
          <Field>
            <FieldLabel htmlFor="s-info">Info</FieldLabel>
            <Input id="s-info" defaultValue="IG12345678090" />
            <FieldMessage tone="info">LHDN TIN is used on every MyInvois e-invoice.</FieldMessage>
          </Field>
          <Field data-disabled>
            <FieldLabel htmlFor="s-dis">Disabled</FieldLabel>
            <Input id="s-dis" defaultValue="MYR" disabled />
            <FieldDescription>Currency is set when the account is created.</FieldDescription>
          </Field>
        </FieldGroup>
      </Panel>
      <LiveValidation />
    </div>
  );
}

const companySchema = z.object({
  name: z.string().min(2, "Enter the registered business name."),
  brn: z.string().regex(/^\d{12}$/, "SSM number must be 12 digits, e.g. 202301012345."),
  email: z.string().email("Enter an email like finance@company.example."),
  phone: z.string().regex(/^1\d{8,9}$/, "Enter a Malaysian mobile number without 0, e.g. 123456789."),
  state: z.string().min(1, "Choose a state."),
  terms: z.literal(true, { error: "Accept the terms to continue." }),
});
type Company = z.infer<typeof companySchema>;

function LiveValidation() {
  const ref = React.useRef<HTMLFormElement>(null);
  const form = useForm<Company>({
    resolver: zodResolver(companySchema),
    defaultValues: { name: "", brn: "", email: "", phone: "", state: "", terms: false as unknown as true },
    mode: "onTouched",
  });
  const errors = Object.keys(form.formState.errors).length;
  return (
    <Panel title="Live validation" description="react-hook-form + zod. Submit empty to see the summary, highlights and focus jump.">
      <Form {...form}>
        <form
          ref={ref}
          noValidate
          onSubmit={form.handleSubmit(
            (v) => { toast(`${v.name} registered`); form.reset(); },
            () => focusFirstInvalid(ref.current),
          )}
          className="space-y-5"
        >
          {form.formState.isSubmitted && errors > 0 && (
            <FieldMessage tone="error">Check the {errors} highlighted {errors === 1 ? "field" : "fields"} before saving.</FieldMessage>
          )}
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Business name</FormLabel><FormControl><Input placeholder="Kedai Kopi Aman Sdn. Bhd." {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <div className="grid gap-5 @container sm:grid-cols-2">
            <FormField control={form.control} name="brn" render={({ field }) => (
              <FormItem><FormLabel>SSM registration no.</FormLabel><FormControl><Input inputMode="numeric" placeholder="202301012345" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="state" render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger className="w-full"><SelectValue placeholder="Choose a state" /></SelectTrigger></FormControl>
                  <SelectContent>{STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel>Finance email</FormLabel><FormControl><Input type="email" placeholder="finance@company.example" {...field} /></FormControl><FormDescription>Payment receipts go here.</FormDescription><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile</FormLabel>
              <InputGroup>
                <InputGroupAddon><InputGroupText>+60</InputGroupText></InputGroupAddon>
                <FormControl><InputGroupInput inputMode="tel" placeholder="123456789" {...field} /></FormControl>
              </InputGroup>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="terms" render={({ field }) => (
            <FormItem>
              <div className="flex items-start gap-3">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <FormLabel className="leading-snug">I agree to the merchant terms and PDPA notice.</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )} />
          <div className="flex flex-wrap gap-2">
            <Button type="submit">Register business</Button>
            <Button type="button" variant="ghost" onClick={() => form.reset()}>Clear</Button>
          </div>
        </form>
      </Form>
    </Panel>
  );
}

/* ---------- 2. Inputs ---------- */
function Inputs() {
  const [deposit, setDeposit] = React.useState([30]);
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 11, 15));
  const [bio, setBio] = React.useState("");
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Text" description="Plain, with addons, multi-line with a counter.">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="i-amount">Amount</FieldLabel>
            <InputGroup>
              <InputGroupAddon><InputGroupText>RM</InputGroupText></InputGroupAddon>
              <InputGroupInput id="i-amount" inputMode="decimal" placeholder="0.00" />
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="i-search">Search</FieldLabel>
            <InputGroup>
              <InputGroupAddon><SearchIcon /></InputGroupAddon>
              <InputGroupInput id="i-search" placeholder="Invoice number or customer" />
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="i-bio">Note on invoice</FieldLabel>
            <Textarea id="i-bio" maxLength={160} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Thank you for your business." />
            <FieldDescription className="text-right tabular-nums">{bio.length}/160</FieldDescription>
          </Field>
        </FieldGroup>
      </Panel>

      <Panel title="Choice" description="Select, native select, searchable combobox, segmented toggle.">
        <FieldGroup>
          <Field>
            <FieldLabel>State (select)</FieldLabel>
            <Select defaultValue="Selangor">
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="i-native">Tax (native select, best on mobile)</FieldLabel>
            <NativeSelect id="i-native" defaultValue="sst8">
              <NativeSelectOption value="none">No tax</NativeSelectOption>
              <NativeSelectOption value="sst8">SST service tax 8%</NativeSelectOption>
              <NativeSelectOption value="sst10">Sales tax 10%</NativeSelectOption>
              <NativeSelectOption value="sst5">Sales tax 5%</NativeSelectOption>
            </NativeSelect>
          </Field>
          <Field>
            <FieldLabel>Branch (combobox, type to filter)</FieldLabel>
            <Combobox items={STATES}>
              <ComboboxInput placeholder="Search states" className="w-full" />
              <ComboboxContent>
                <ComboboxEmpty>No state found.</ComboboxEmpty>
                <ComboboxList>{(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>
          <Field>
            <FieldLabel>Billing cycle (toggle group)</FieldLabel>
            <ToggleGroup type="single" defaultValue="monthly" variant="outline" spacing={2} className="flex-wrap">
              <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
              <ToggleGroupItem value="quarterly">Quarterly</ToggleGroupItem>
              <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
            </ToggleGroup>
          </Field>
        </FieldGroup>
      </Panel>

      <Panel title="Selection" description="Radio cards, checkbox list, switches.">
        <FieldGroup>
          <FieldSet>
            <FieldLegend variant="label">Payment method</FieldLegend>
            <RadioGroup defaultValue="fpx" className="grid gap-2 sm:grid-cols-3">
              {[["fpx", "FPX", "Online banking"], ["duitnow", "DuitNow QR", "Any bank app"], ["card", "Card", "Visa, Mastercard"]].map(([v, t, d]) => (
                <FieldLabel key={v} htmlFor={`pm-${v}`} /* recanica-ignore: RadioGroup item shown as a card (accessible form field) */ className="rounded-xl border p-3 has-data-[state=checked]:border-foreground/40 has-data-[state=checked]:bg-accent/50">
                  <Field orientation="horizontal">
                    <FieldContent><FieldTitle>{t}</FieldTitle><FieldDescription>{d}</FieldDescription></FieldContent>
                    <RadioGroupItem value={v} id={`pm-${v}`} />
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <FieldLegend variant="label">Send reminders</FieldLegend>
            {[["r3", "3 days before due", true], ["r0", "On the due date", true], ["r7", "7 days overdue", false]].map(([id, l, on]) => (
              <Field key={id as string} orientation="horizontal">
                <Checkbox id={id as string} defaultChecked={on as boolean} />
                <FieldLabel htmlFor={id as string} className="font-normal">{l as string}</FieldLabel>
              </Field>
            ))}
          </FieldSet>
          <FieldSeparator />
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="sw-einv">Submit e-invoices to MyInvois</FieldLabel>
              <FieldDescription>Each paid invoice is validated by LHDN automatically.</FieldDescription>
            </FieldContent>
            <Switch id="sw-einv" defaultChecked />
          </Field>
        </FieldGroup>
      </Panel>

      <Panel title="Range, date, code" description="Slider, date picker, one-time code, grouped actions.">
        <FieldGroup>
          <Field>
            <div className="flex items-baseline justify-between gap-3">
              <FieldLabel>Deposit</FieldLabel>
              <span className="text-sm whitespace-nowrap tabular-nums text-muted-foreground">{deposit[0]}% · RM {(9720 * deposit[0] / 100).toLocaleString("en-MY")}</span>
            </div>
            <Slider value={deposit} onValueChange={setDeposit} min={10} max={100} step={5} />
          </Field>
          <Field>
            <FieldLabel>Due date</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start font-normal sm:w-60">
                  <CalendarIcon /> {date ? date.toLocaleDateString("en-GB") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={date} onSelect={setDate} /></PopoverContent>
            </Popover>
          </Field>
          <Field>
            <div className="flex items-center gap-1.5">
              <FieldLabel>Verification code</FieldLabel>
              <Tooltip>
                <TooltipTrigger asChild><Button variant="ghost" size="icon-xs" aria-label="About the code" className="text-muted-foreground"><InfoIcon /></Button></TooltipTrigger>
                <TooltipContent>Sent by SMS to +60 12-345 6789</TooltipContent>
              </Tooltip>
            </div>
            <InputOTP maxLength={6} aria-label="Verification code">
              <InputOTPGroup>{[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
            </InputOTP>
          </Field>
          <Field>
            <FieldLabel>Export (button group)</FieldLabel>
            <ButtonGroup>
              <Button variant="outline">PDF</Button>
              <Button variant="outline">CSV</Button>
              <Button variant="outline">MyInvois XML</Button>
            </ButtonGroup>
          </Field>
        </FieldGroup>
      </Panel>
    </div>
  );
}

/* ---------- 3. Layouts ---------- */
function Layouts() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Stacked" description="Default. One column, labels above. Best for mobile and short forms.">
          <FieldGroup>
            <Field><FieldLabel htmlFor="l1-n">Full name</FieldLabel><Input id="l1-n" placeholder="Nadia Rahman" /></Field>
            <Field><FieldLabel htmlFor="l1-e">Email</FieldLabel><Input id="l1-e" type="email" placeholder="nadia@company.example" /></Field>
            <Button className="w-fit">Send invite</Button>
          </FieldGroup>
        </Panel>
        <Panel title="Two columns" description="Related short fields side by side; collapses to one column when narrow.">
          <FieldGroup className="@container">
            <div className="grid gap-4 @md:grid-cols-2">
              <Field><FieldLabel htmlFor="l2-a">Address line 1</FieldLabel><Input id="l2-a" placeholder="12, Jalan Telawi 3" /></Field>
              <Field><FieldLabel htmlFor="l2-c">City</FieldLabel><Input id="l2-c" placeholder="Bangsar" /></Field>
              <Field><FieldLabel htmlFor="l2-p">Postcode</FieldLabel><Input id="l2-p" inputMode="numeric" placeholder="59100" /></Field>
              <Field>
                <FieldLabel htmlFor="l2-s">State</FieldLabel>
                <NativeSelect id="l2-s" defaultValue="W.P. Kuala Lumpur">{STATES.map((s) => <NativeSelectOption key={s} value={s}>{s}</NativeSelectOption>)}</NativeSelect>
              </Field>
            </div>
          </FieldGroup>
        </Panel>
      </div>
      <Panel title="Label beside field" description="orientation=&quot;responsive&quot;: label left when the form is wide, above when it is narrow.">
        <FieldGroup>
          {[["Business name", "Kedai Kopi Aman"], ["Support email", "hello@kopiaman.example"], ["Website", "kopiaman.example"]].map(([l, v]) => (
            <Field key={l} orientation="responsive">
              <FieldLabel htmlFor={`l3-${l}`} className="@md/field-group:max-w-48">{l}</FieldLabel>
              <Input id={`l3-${l}`} defaultValue={v} className="@md/field-group:max-w-md" />
            </Field>
          ))}
        </FieldGroup>
      </Panel>
      <Panel title="Settings sections" description="Title and help on the left, fields on the right; each section saves on its own.">
        <div className="divide-y">
          {[
            { t: "Invoice numbering", d: "Prefix and next number for new invoices.", f: [["Prefix", "INV-"], ["Next number", "1043"]] },
            { t: "Payment terms", d: "Default due date for new invoices.", f: [["Days until due", "14"], ["Late fee (%)", "1.5"]] },
          ].map((s) => (
            <div key={s.t} className="grid gap-4 py-5 first:pt-0 last:pb-0 md:grid-cols-[16rem_1fr]">
              <div><h3 className="text-sm">{s.t}</h3><p className="text-sm text-muted-foreground">{s.d}</p></div>
              <div className="grid gap-4 @container">
                <div className="grid gap-4 @sm:grid-cols-2">
                  {s.f.map(([l, v]) => <Field key={l}><FieldLabel htmlFor={`s-${l}`}>{l}</FieldLabel><Input id={`s-${l}`} defaultValue={v} /></Field>)}
                </div>
                <Button variant="outline" size="sm" className="w-fit" onClick={() => toast(`${s.t} saved`)}>Save</Button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Inline filter bar" description="Controls on one row; they wrap as a group, never individually squeezed.">
        <div className="flex flex-wrap items-end gap-3">
          <InputGroup className="w-full sm:w-64"><InputGroupAddon><SearchIcon /></InputGroupAddon><InputGroupInput placeholder="Search invoices" aria-label="Search invoices" /></InputGroup>
          <NativeSelect defaultValue="all" className="w-40"><NativeSelectOption value="all">All statuses</NativeSelectOption><NativeSelectOption value="paid">Paid</NativeSelectOption><NativeSelectOption value="overdue">Overdue</NativeSelectOption></NativeSelect>
          <NativeSelect defaultValue="30" className="w-40"><NativeSelectOption value="30">Last 30 days</NativeSelectOption><NativeSelectOption value="90">Last 90 days</NativeSelectOption></NativeSelect>
          <Button variant="ghost">Reset</Button>
        </div>
      </Panel>
    </div>
  );
}

/* ---------- 4. Wizard ---------- */
const steps = ["Business", "Payout", "Review"] as const;
function Wizard() {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({ name: "", brn: "", bank: "", account: "" });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const ref = React.useRef<HTMLFormElement>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (data.name.trim().length < 2) e.name = "Enter the registered business name.";
      if (!/^\d{12}$/.test(data.brn)) e.brn = "SSM number must be 12 digits.";
    }
    if (step === 1) {
      if (!data.bank) e.bank = "Choose your bank.";
      if (!/^\d{10,16}$/.test(data.account)) e.account = "Account number is 10 to 16 digits.";
    }
    setErrors(e);
    if (Object.keys(e).length) focusFirstInvalid(ref.current);
    return !Object.keys(e).length;
  };
  const next = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    if (step < steps.length - 1) setStep(step + 1);
    else { toast("Account set up. Payouts start after the first sale."); setStep(0); setData({ name: "", brn: "", bank: "", account: "" }); }
  };
  const set = (k: keyof typeof data) => (v: string) => { setData((d) => ({ ...d, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  return (
    <Panel title="Multi-step setup" description="Validates each step before moving on; progress and step names stay visible.">
      <div className="mx-auto max-w-xl">
        <ol className="mb-3 flex justify-between gap-2 text-sm">
          {steps.map((s, i) => (
            <li key={s} className={i <= step ? "text-foreground" : "text-muted-foreground"}>
              <span className="tabular-nums text-muted-foreground">{i + 1}.</span> {s}
            </li>
          ))}
        </ol>
        <Progress value={((step + 1) / steps.length) * 100} className="mb-6 h-1" />
        <form ref={ref} onSubmit={next} noValidate>
          <FieldGroup>
            {step === 0 && (
              <>
                <Field data-invalid={!!errors.name || undefined}>
                  <FieldLabel htmlFor="w-name">Business name</FieldLabel>
                  <Input id="w-name" value={data.name} onChange={(e) => set("name")(e.target.value)} placeholder="Kedai Kopi Aman Sdn. Bhd." />
                  {errors.name && <FieldError>{errors.name}</FieldError>}
                </Field>
                <Field data-invalid={!!errors.brn || undefined}>
                  <FieldLabel htmlFor="w-brn">SSM registration no.</FieldLabel>
                  <Input id="w-brn" inputMode="numeric" value={data.brn} onChange={(e) => set("brn")(e.target.value)} placeholder="202301012345" />
                  {errors.brn ? <FieldError>{errors.brn}</FieldError> : <FieldDescription>New format, 12 digits.</FieldDescription>}
                </Field>
              </>
            )}
            {step === 1 && (
              <>
                <Field data-invalid={!!errors.bank || undefined}>
                  <FieldLabel htmlFor="w-bank">Bank</FieldLabel>
                  <NativeSelect id="w-bank" value={data.bank} onChange={(e) => set("bank")(e.target.value)}>
                    <NativeSelectOption value="">Choose a bank</NativeSelectOption>
                    {["Maybank", "CIMB Bank", "Public Bank", "RHB Bank", "Hong Leong Bank", "AmBank", "Bank Islam"].map((b) => <NativeSelectOption key={b} value={b}>{b}</NativeSelectOption>)}
                  </NativeSelect>
                  {errors.bank && <FieldError>{errors.bank}</FieldError>}
                </Field>
                <Field data-invalid={!!errors.account || undefined}>
                  <FieldLabel htmlFor="w-acc">Account number</FieldLabel>
                  <Input id="w-acc" inputMode="numeric" value={data.account} onChange={(e) => set("account")(e.target.value)} placeholder="Sample only" />
                  {errors.account ? <FieldError>{errors.account}</FieldError> : <FieldMessage tone="info">Demo only: nothing you type here leaves your browser.</FieldMessage>}
                </Field>
              </>
            )}
            {step === 2 && (
              <dl className="divide-y rounded-xl border text-sm">
                {[["Business", data.name], ["SSM no.", data.brn], ["Bank", data.bank], ["Account", data.account.replace(/\d(?=\d{4})/g, "•")]].map(([k, v]) => (
                  <div key={k} className="flex flex-wrap justify-between gap-x-4 gap-y-0.5 px-4 py-3"><dt className="text-muted-foreground">{k}</dt><dd className="min-w-0 [overflow-wrap:anywhere]">{v}</dd></div>
                ))}
              </dl>
            )}
            <div className="flex flex-wrap justify-between gap-2">
              <Button type="button" variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
              <Button type="submit">{step === steps.length - 1 ? "Finish setup" : `Continue to ${steps[step + 1]}`}</Button>
            </div>
          </FieldGroup>
        </form>
      </div>
    </Panel>
  );
}

export default function FormsPage() {
  return (
    <>
      <PageHeader
        title="Forms"
        description="Every form state, input and layout this template ships with. All of it works; nothing is sent anywhere."
        back={{ href: "/demo/app/ui", label: "UI kit" }}
      />
      <Alert className="mb-6">
        <InfoIcon />
        <AlertTitle>Validation rules</AlertTitle>
        <AlertDescription>Invalid fields are highlighted, messages are tinted notices, and submitting jumps to the first problem.</AlertDescription>
      </Alert>
      <Tabs defaultValue="states">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="states">States & validation</TabsTrigger>
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
          <TabsTrigger value="layouts">Layouts</TabsTrigger>
          <TabsTrigger value="wizard">Wizard</TabsTrigger>
        </TabsList>
        <TabsContent value="states"><States /></TabsContent>
        <TabsContent value="inputs"><Inputs /></TabsContent>
        <TabsContent value="layouts"><Layouts /></TabsContent>
        <TabsContent value="wizard"><Wizard /></TabsContent>
      </Tabs>
    </>
  );
}
