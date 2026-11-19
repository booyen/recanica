"use client";

import * as React from "react";
import { DownloadIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Button } from "@recanica/ui/components/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@recanica/ui/components/chart";
import { BarRow, Stat, StatGroup, StatHeader, StatList, StatValue } from "@recanica/ui/components/stat";
import { Tabs, TabsList, TabsTrigger } from "@recanica/ui/components/tabs";
import { PageHeader } from "@/components/demo/ui";
import { metrics, money, useDemo } from "@/lib/demo/store";

const cfg = { value: { label: "Revenue", color: "var(--chart-1)" }, customers: { label: "New customers", color: "var(--chart-3)" } } satisfies ChartConfig;

export default function ReportsPage() {
  const { state } = useDemo();
  const m = metrics(state);
  const [range, setRange] = React.useState("6m");
  const byProduct = state.products.map((p) => ({ name: p.name, value: state.orders.filter((o) => o.productId === p.id && o.status === "paid").reduce((a, o) => a + o.amount, 0) })).sort((a, b) => b.value - a.value);
  const max = Math.max(...byProduct.map((p) => p.value), 1);
  const custByMonth = m.months.map((mo) => ({ label: mo.label, customers: state.customers.filter((c) => new Date(c.createdAt).toLocaleString("en-GB", { month: "short" }) === mo.label).length }));
  return (
    <>
      <PageHeader
        title="Reports"
        description="Revenue, customers and products over time."
        actions={<>
          <Tabs value={range} onValueChange={setRange}><TabsList>{["30d", "6m", "12m"].map((r) => <TabsTrigger key={r} value={r}>{r}</TabsTrigger>)}</TabsList></Tabs>
          <Button variant="outline"><DownloadIcon /> Export CSV</Button>
        </>}
      />
      <StatGroup className="mb-stack">
        <Stat><StatHeader title="Gross volume" /><StatValue value={money(m.gross)} /></Stat>
        <Stat><StatHeader title="MRR" /><StatValue value={money(Math.round(m.mrr))} caption={`${m.activeSubs} subscriptions`} /></Stat>
        <Stat><StatHeader title="Fees" /><StatValue value={money(Math.round(m.fees))} /></Stat>
      </StatGroup>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-panel">
          <h2 className="mb-6">Revenue</h2>
          <ChartContainer config={cfg} className="h-56 w-full">
            <BarChart data={m.months}><CartesianGrid vertical={false} /><XAxis dataKey="label" tickLine={false} axisLine={false} /><ChartTooltip content={<ChartTooltipContent formatter={(v) => money(Number(v))} />} /><Bar dataKey="value" fill="var(--color-value)" radius={6} /></BarChart>
          </ChartContainer>
        </section>
        <section className="rounded-2xl border bg-card p-panel">
          <h2 className="mb-6">New customers</h2>
          <ChartContainer config={cfg} className="h-56 w-full">
            <LineChart data={custByMonth}><CartesianGrid vertical={false} /><XAxis dataKey="label" tickLine={false} axisLine={false} /><ChartTooltip content={<ChartTooltipContent />} /><Line dataKey="customers" stroke="var(--color-customers)" strokeWidth={1.5} dot={false} /></LineChart>
          </ChartContainer>
        </section>
      </div>
      <section className="mt-stack rounded-2xl border bg-card p-panel">
        <h2>Revenue by product</h2>
        <StatList className="mt-4">{byProduct.map((p, i) => <BarRow key={p.name} label={p.name} value={money(p.value)} percent={(p.value / max) * 100} active={i === 0} />)}</StatList>
      </section>
    </>
  );
}
