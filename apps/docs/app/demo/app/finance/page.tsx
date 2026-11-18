"use client";

import * as React from "react";
import { LandmarkIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@rekanica/ui/components/badge";
import { Button } from "@rekanica/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@rekanica/ui/components/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "@rekanica/ui/components/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@rekanica/ui/components/input-group";
import { Input } from "@rekanica/ui/components/input";
import { Spinner } from "@rekanica/ui/components/spinner";
import { Stat, StatGroup, StatHeader, StatValue } from "@rekanica/ui/components/stat";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@rekanica/ui/components/table";
import { PageHeader, Section } from "@/components/demo/ui";
import { FEE_FIXED, FEE_RATE, date, metrics, money2, useDemo } from "@/lib/demo/store";

function ConnectDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { state, dispatch } = useDemo();
  const [busy, setBusy] = React.useState(false);
  const connect = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => {
      dispatch({ type: "updateOrg", patch: { payoutConnected: true } });
      setBusy(false);
      onOpenChange(false);
      toast.success("Payout account connected");
    }, 900);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={connect} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Connect payout account</DialogTitle>
            <DialogDescription>Demo only. These fields are pre-filled placeholders and nothing is sent.</DialogDescription>
          </DialogHeader>
          <Field><FieldLabel htmlFor="holder">Account holder</FieldLabel><Input id="holder" defaultValue={state.org.name} /></Field>
          <Field><FieldLabel htmlFor="bank">Bank</FieldLabel><Input id="bank" defaultValue="Maybank" /></Field>
          <Field><FieldLabel htmlFor="acct">Account</FieldLabel><Input id="acct" defaultValue="•••• 0000 (demo)" readOnly /></Field>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={busy}>{busy && <Spinner />} Connect</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function WithdrawDialog({ open, onOpenChange, max }: { open: boolean; onOpenChange: (o: boolean) => void; max: number }) {
  const { dispatch } = useDemo();
  const [amount, setAmount] = React.useState("");
  React.useEffect(() => { if (open) setAmount(max.toFixed(2)); }, [open, max]);
  const n = Number(amount);
  const err = !n || n < 10 ? "Minimum withdrawal is RM10." : n > max ? `You can withdraw up to ${money2(max)}.` : "";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (err) return;
            dispatch({ type: "payout", amount: Math.round(n * 100) / 100 });
            onOpenChange(false);
            toast.success("Payout initiated", { description: `${money2(n)} arrives in 2–3 business days.` });
          }}
        >
          <DialogHeader><DialogTitle>Withdraw funds</DialogTitle><DialogDescription>Available: {money2(max)}</DialogDescription></DialogHeader>
          <Field data-invalid={!!err}>
            <FieldLabel htmlFor="amt">Amount</FieldLabel>
            <InputGroup>
              <InputGroupAddon><InputGroupText>RM</InputGroupText></InputGroupAddon>
              <InputGroupInput id="amt" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} />
            </InputGroup>
            {err ? <FieldError>{err}</FieldError> : <FieldDescription>To your connected demo account.</FieldDescription>}
          </Field>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="brand" disabled={!!err}>Withdraw</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function FinancePage() {
  const { state } = useDemo();
  const m = metrics(state);
  const [connect, setConnect] = React.useState(false);
  const [withdraw, setWithdraw] = React.useState(false);

  return (
    <>
      <PageHeader
        title="Finance"
        description="Your balance, payouts and fees."
        actions={
          state.org.payoutConnected
            ? <Button variant="brand" disabled={m.balance < 10} onClick={() => setWithdraw(true)}>Withdraw</Button>
            : <Button variant="brand" onClick={() => setConnect(true)}><LandmarkIcon /> Connect payouts</Button>
        }
      />
      <StatGroup>
        <Stat><StatHeader title="Available balance" /><StatValue value={<span className="text-metallic">{money2(m.balance)}</span>} /></Stat>
        <Stat><StatHeader title="Gross volume" /><StatValue value={money2(m.gross)} caption="all time" /></Stat>
        <Stat><StatHeader title="Fees" /><StatValue value={money2(m.fees)} caption={`${FEE_RATE * 100}% + ${money2(FEE_FIXED)}`} /></Stat>
      </StatGroup>

      <Section title="Payout account">
        <div className="flex flex-col gap-3 rounded-2xl border bg-card p-5 sm:flex-row sm:items-center">
          <LandmarkIcon className="size-5 text-muted-foreground" />
          <div className="flex-1">
            <p>{state.org.payoutConnected ? "Maybank •••• 0000 (demo)" : "No account connected"}</p>
            <p className="text-sm text-muted-foreground">{state.org.payoutConnected ? "Payouts arrive in 2–3 business days." : "Connect a bank account to withdraw your balance."}</p>
          </div>
          {state.org.payoutConnected ? <Badge variant="success">Connected</Badge> : <Button variant="outline" onClick={() => setConnect(true)}>Connect</Button>}
        </div>
      </Section>

      <Section title="Payouts">
        <div className="overflow-hidden rounded-2xl border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
            <TableBody>
              {state.payouts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="pl-4">{date(p.at)}</TableCell>
                  <TableCell><Badge variant={p.status === "paid" ? "success" : "warning"}>{p.status === "paid" ? "Paid" : "In transit"}</Badge></TableCell>
                  <TableCell className="text-right tabular-nums">{money2(p.amount)}</TableCell>
                </TableRow>
              ))}
              {state.payouts.length === 0 && <TableRow><TableCell colSpan={3} className="h-24 text-center text-muted-foreground">No payouts yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      </Section>

      <ConnectDialog open={connect} onOpenChange={setConnect} />
      <WithdrawDialog open={withdraw} onOpenChange={setWithdraw} max={m.balance} />
    </>
  );
}
