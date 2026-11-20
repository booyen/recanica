"use client";

import Link from "next/link";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Button } from "@recanica/ui/components/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@recanica/ui/components/chart";
import { BarRow, Stat, StatGroup, StatHeader, StatList, StatRow, StatValue } from "@recanica/ui/components/stat";
import { PageHeader } from "@/components/demo/ui";
import { ago, invoiceBalance, metrics, money, useDemo } from "@/lib/demo/store";
import { Heading } from "@recanica/ui/components/page";
import { Surface } from "@recanica/ui/components/surface";

const chartConfig = { value: { label: "Revenue", color: "var(--chart-1)" } } satisfies ChartConfig;

export default function Overview() {
  const { state } = useDemo();
  const m = metrics(state);
  const max = Math.max(...m.months.map((x) => x.value), 1);
  const thisMonth = m.months[m.months.length - 1];

  const byCustomer = state.customers
    .map((c) => ({ c, total: state.orders.filter((o) => o.customerId === c.id && o.status === "paid").reduce((a, o) => a + o.amount, 0) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);
  const openInvoices = state.invoices.filter((i) => i.status === "open" || i.status === "partial");

  return (
    <>
      <PageHeader
        title="Overview"
        description={`Welcome back, ${state.user.name.split(" ")[0]}.`}
        actions={<Button asChild><Link href="/demo/app/products/new"><PlusIcon /> New product</Link></Button>}
      />

      {!state.org.payoutConnected && (
        <Surface className="mb-stack flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <p>You have <span className="text-brand">{money(m.balance)}</span> ready to withdraw</p>
            <p className="text-sm text-muted-foreground">Connect a bank account to receive payouts.</p>
          </div>
          <Button asChild variant="brand"><Link href="/demo/app/finance">Connect payouts <ArrowRightIcon /></Link></Button>
        </Surface>
      )}

      <div className="space-y-stack">
        <StatGroup>
          <Stat>
            <StatHeader title="Revenue" href="/demo/app/sales" />
            <StatValue value={money(thisMonth.value)} caption={thisMonth.label} />
            <StatList>
              {[...m.months].reverse().slice(0, 4).map((x, i) => (
                <BarRow key={x.key} label={x.label} value={money(x.value)} percent={(x.value / max) * 100} active={i === 0} />
              ))}
            </StatList>
          </Stat>
          <Stat>
            <StatHeader title="Activity" href="/demo/app/sales" />
            <StatValue value={state.events.length} caption="recent events" />
            <StatList>
              {state.events.slice(0, 4).map((e) => <StatRow key={e.id} primary={e.title} secondary={e.who} trailing={ago(e.at)} />)}
            </StatList>
          </Stat>
          <Stat>
            <StatHeader title="Available balance" href="/demo/app/finance" />
            <StatValue value={<span className="text-brand">{money(m.balance)}</span>} />
            <div className="mt-auto text-sm">
              <p>{state.org.payoutConnected ? "Payouts connected" : "No payout account yet"}</p>
              <p className="text-muted-foreground">You may withdraw funds above RM10.</p>
            </div>
          </Stat>
        </StatGroup>

        <StatGroup>
          <Stat>
            <StatHeader title="MRR" href="/demo/app/subscriptions" />
            <StatValue value={money(Math.round(m.mrr))} caption={`${m.activeSubs} active subscriptions`} />
          </Stat>
          <Stat>
            <StatHeader title="Top customers" href="/demo/app/customers" />
            <StatValue value={byCustomer[0] ? `${Math.round((byCustomer[0].total / Math.max(m.gross, 1)) * 100)}%` : "—"} caption="from top customer" />
            <StatList>
              {byCustomer.map(({ c, total }) => <StatRow key={c.id} primary={c.name} trailing={money(total)} />)}
            </StatList>
          </Stat>
          <Stat>
            <StatHeader title="Outstanding" href="/demo/app/invoices" />
            <StatValue value={money(m.outstanding)} caption={`${openInvoices.length} open invoices`} />
            <StatList>
              {openInvoices.slice(0, 3).map((i) => (
                <StatRow key={i.id} primary={i.number} secondary={state.customers.find((c) => c.id === i.customerId)?.name} trailing={money(invoiceBalance(i))} />
              ))}
            </StatList>
          </Stat>
        </StatGroup>

        <Surface as="section" inset="lg">
          <div className="mb-6 flex items-baseline justify-between">
            <Heading level={2}>Revenue</Heading>
            <span className="text-sm text-muted-foreground">Last 6 months</span>
          </div>
          <ChartContainer config={chartConfig} className="h-56 w-full">
            <AreaChart data={m.months} margin={{ left: 4, right: 4 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent formatter={(v) => money(Number(v))} />} />
              <Area dataKey="value" type="monotone" stroke="var(--color-value)" fill="var(--color-value)" fillOpacity={0.08} strokeWidth={1.5} />
            </AreaChart>
          </ChartContainer>
        </Surface>
      </div>
    </>
  );
}
