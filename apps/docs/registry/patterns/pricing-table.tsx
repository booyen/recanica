"use client";

import * as React from "react";
import { CheckIcon, MinusIcon } from "lucide-react";
import { Badge } from "@recanica/ui/components/badge";
import { Button } from "@recanica/ui/components/button";
import { Tabs, TabsList, TabsTrigger } from "@recanica/ui/components/tabs";
import { cn } from "@recanica/ui/lib/utils";
import { Heading, PageHeader } from "@recanica/ui/components/page";
import { SurfaceGrid } from "@recanica/ui/components/surface";

const plans = [
  { id: "starter", name: "Starter", monthly: 0, fee: "5% + 40¢", current: true },
  { id: "pro", name: "Pro", monthly: 29, fee: "3% + 40¢", featured: true },
  { id: "scale", name: "Scale", monthly: 99, fee: "2% + 40¢" },
];
const features: [string, boolean[]][] = [
  ["Unlimited products", [true, true, true]],
  ["Custom domain", [false, true, true]],
  ["Team members", [false, true, true]],
  ["Priority support", [false, false, true]],
  ["Revenue recognition", [false, false, true]],
];

export default function PricingTable() {
  const [cycle, setCycle] = React.useState("monthly");
  const price = (m: number) => (cycle === "yearly" ? Math.round(m * 0.8) : m);
  return (
    <div className="mx-auto max-w-content space-y-6 px-gutter py-8">
      <PageHeader title="Plans" description="Lower your fees as you grow. Change anytime." actions={
        <Tabs value={cycle} onValueChange={setCycle}>
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly <Badge variant="success">-20%</Badge></TabsTrigger>
          </TabsList>
        </Tabs>
      } />

      <SurfaceGrid className="md:grid-cols-3">
        {plans.map((p, pi) => (
          <div key={p.id} className={cn("flex flex-col gap-6 bg-card p-panel", p.featured && "bg-accent/40")}>
            <div className="flex items-center justify-between">
              <span>{p.name}</span>
              {p.current ? <Badge variant="outline">Current</Badge> : p.featured ? <Badge variant="brand">Recommended</Badge> : null}
            </div>
            <div className="flex items-baseline gap-1">
              <span className={cn("text-metric font-light tabular-nums", p.featured && "text-brand")}>${price(p.monthly)}</span>
              <span className="text-sm text-muted-foreground">/ mo</span>
            </div>
            <p className="text-sm text-muted-foreground">Transaction fee <span className="text-foreground">{p.fee}</span></p>
            <ul className="space-y-2 text-sm">
              {features.map(([f, has]) => (
                <li key={f} className={cn("flex items-center gap-2", !has[pi] && "text-muted-foreground")}>
                  {has[pi] ? <CheckIcon className="size-4" /> : <MinusIcon className="size-4" />} {f}
                </li>
              ))}
            </ul>
            <Button className="mt-auto" variant={p.current ? "outline" : p.featured ? "brand" : "default"} disabled={p.current}>
              {p.current ? "Current plan" : `Upgrade to ${p.name}`}
            </Button>
          </div>
        ))}
      </SurfaceGrid>
    </div>
  );
}
