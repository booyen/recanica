"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Badge } from "@rekanica/ui/components/badge";
import { Button } from "@rekanica/ui/components/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@rekanica/ui/components/empty";
import type { InvoiceStatus } from "@/lib/demo/types";

export function PageHeader({ title, description, actions, back }: { title: React.ReactNode; description?: React.ReactNode; actions?: React.ReactNode; back?: { href: string; label: string } }) {
  return (
    <div className="mb-8 space-y-3">
      {back && (
        <Button asChild variant="ghost" size="sm" className="-ml-3 text-muted-foreground">
          <Link href={back.href}><ArrowLeftIcon /> {back.label}</Link>
        </Button>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h1 className="text-title">{title}</h1>
          {description && <div className="text-sm text-muted-foreground">{description}</div>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function InvoiceBadge({ status, overdue }: { status: InvoiceStatus; overdue?: boolean }) {
  if (overdue) return <Badge variant="destructive">Overdue</Badge>;
  const map = { draft: ["outline", "Draft"], open: ["warning", "Open"], partial: ["secondary", "Partially paid"], paid: ["success", "Paid"], void: ["muted", "Void"] } as const;
  const [v, l] = map[status];
  return <Badge variant={v}>{l}</Badge>;
}

export function NotFound({ what, href }: { what: string; href: string }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">?</EmptyMedia>
        <EmptyTitle>{what} not found</EmptyTitle>
        <EmptyDescription>It may have been removed, or the demo data was reset.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent><Button asChild variant="outline"><Link href={href}>Go back</Link></Button></EmptyContent>
    </Empty>
  );
}

export function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mt-stack space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-heading">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
