"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@rekanica/ui/components/chart";

const data = [
  { month: "Jun", revenue: 1860, refunds: 80 },
  { month: "Jul", revenue: 3050, refunds: 200 },
  { month: "Aug", revenue: 2370, refunds: 120 },
  { month: "Sep", revenue: 3410, refunds: 190 },
  { month: "Oct", revenue: 3960, refunds: 130 },
  { month: "Nov", revenue: 4820, refunds: 140 },
];

const config = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  refunds: { label: "Refunds", color: "var(--chart-3)" },
} satisfies ChartConfig;

export default function ChartDemo() {
  return (
    <ChartContainer config={config} className="h-64 w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={6} />
        <Bar dataKey="refunds" fill="var(--color-refunds)" radius={6} />
      </BarChart>
    </ChartContainer>
  );
}
