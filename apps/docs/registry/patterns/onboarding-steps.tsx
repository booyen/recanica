"use client";

import * as React from "react";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";
import { Progress } from "@recanica/ui/components/progress";
import { cn } from "@recanica/ui/lib/utils";

const steps = [
  { title: "Create your organization", body: "Name, logo and store URL.", cta: "Edit" },
  { title: "Add your first product", body: "Set a price and the benefits it grants.", cta: "Create product" },
  { title: "Connect payouts", body: "Link a bank account to get paid.", cta: "Connect" },
  { title: "Share a checkout link", body: "Send it to your first customer.", cta: "Create link" },
];

export default function OnboardingSteps() {
  const [done, setDone] = React.useState(1);
  return (
    <div className="mx-auto max-w-narrow space-y-6 px-gutter py-8">
      <div className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-title">Get started</h1>
            <p className="mt-1 text-sm text-muted-foreground">Four steps to your first sale.</p>
          </div>
          <span className="text-sm text-muted-foreground tabular-nums">{done} / {steps.length}</span>
        </div>
        <Progress value={(done / steps.length) * 100} className="h-1" />
      </div>
      <ol className="divide-y rounded-2xl border bg-card">
        {steps.map((s, i) => {
          const complete = i < done;
          const current = i === done;
          return (
            <li key={s.title} className={cn("flex flex-col gap-3 p-5 sm:flex-row sm:items-center", !complete && !current && "opacity-60")}>
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs tabular-nums",
                  complete && "border-transparent bg-brand text-brand-foreground"
                )}
              >
                {complete ? <CheckIcon className="size-3.5" /> : i + 1}
              </span>
              <div className="flex-1">
                <p className={cn("text-sm", complete && "text-muted-foreground line-through")}>{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.body}</p>
              </div>
              {current && <Button size="sm" onClick={() => setDone((d) => d + 1)}>{s.cta} <ArrowRightIcon /></Button>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
