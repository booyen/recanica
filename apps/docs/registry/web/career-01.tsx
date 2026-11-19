"use client";

import * as React from "react";
import { ArrowUpRightIcon } from "lucide-react";
import { Badge } from "@rekanica/ui/components/badge";
import { Tabs, TabsList, TabsTrigger } from "@rekanica/ui/components/tabs";

const roles = [
  { title: "Senior Frontend Engineer", team: "Engineering", place: "Kuala Lumpur · Hybrid", type: "Full-time" },
  { title: "Backend Engineer (Payments)", team: "Engineering", place: "Remote, Malaysia", type: "Full-time" },
  { title: "Product Designer", team: "Design", place: "Kuala Lumpur · Hybrid", type: "Full-time" },
  { title: "Customer Support Lead", team: "Support", place: "Penang", type: "Full-time" },
  { title: "Finance Intern", team: "Finance", place: "Kuala Lumpur", type: "Internship · 6 months" },
];
const perks = ["Medical and dental for you and family", "RM2,000 yearly learning budget", "Hybrid: 2 office days a week", "Laptop of your choice"];

export function Career01() {
  const teams = ["All", ...Array.from(new Set(roles.map((r) => r.team)))];
  const [team, setTeam] = React.useState("All");
  const list = roles.filter((r) => team === "All" || r.team === team);
  return (
    <section className="px-gutter py-section-sm">
      <div className="mx-auto max-w-content space-y-12">
        <div className="max-w-2xl">
          <h1 className="text-display-sm tracking-tight">Work with us</h1>
          <p className="mt-4 text-muted-foreground">We&apos;re a small team building billing tools for Malaysian businesses. Every role here ships to customers in the first month.</p>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p) => <li key={p} className="bg-background p-5 text-sm">{p}</li>)}
        </ul>
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-heading">Open roles <span className="text-muted-foreground">({list.length})</span></h2>
            <div className="-mx-1 overflow-x-auto px-1"><Tabs value={team} onValueChange={setTeam}><TabsList>{teams.map((t) => <TabsTrigger key={t} value={t}>{t}</TabsTrigger>)}</TabsList></Tabs></div>
          </div>
          <ul className="divide-y rounded-2xl border">
            {list.map((r) => (
              <li key={r.title}>
                <a href="#" className="group flex flex-col gap-2 p-5 transition-colors hover:bg-accent/40 sm:flex-row sm:items-center">
                  <span className="flex-1">{r.title}<span className="block text-sm text-muted-foreground">{r.place}</span></span>
                  <Badge variant="outline">{r.team}</Badge>
                  <span className="text-sm text-muted-foreground sm:w-40 sm:text-right">{r.type}</span>
                  <ArrowUpRightIcon className="hidden size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block" />
                </a>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">Don&apos;t see your role? Email careers@acme.example with what you&apos;d work on.</p>
        </div>
      </div>
    </section>
  );
}

export default Career01;
