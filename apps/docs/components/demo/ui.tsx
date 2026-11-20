"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Badge } from "@recanica/ui/components/badge";
import { Button } from "@recanica/ui/components/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@recanica/ui/components/empty";
import type { InvoiceStatus } from "@/lib/demo/types";
import { PageHeader as UIPageHeader, Section as UISection } from "@recanica/ui/components/page";

/** The demo's page header is the shared PageHeader; `back` becomes a ghost link above the title. */
export function PageHeader({ title, description, actions, back }: { title: React.ReactNode; description?: React.ReactNode; actions?: React.ReactNode; back?: { href: string; label: string } }) {
  return (
    <UIPageHeader
      title={title}
      description={description}
      actions={actions}
      back={back && (
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
          <Link href={back.href}><ArrowLeftIcon /> {back.label}</Link>
        </Button>
      )}
    />
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

/** The demo's section is the shared Section (one heading style, rhythm owned by the section). */
export function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return <UISection title={title} actions={action}>{children}</UISection>;
}

/** After a failed submit: move focus to the first invalid control so keyboard and screen-reader users land on it. */
export function focusFirstInvalid(root?: HTMLElement | null) {
  requestAnimationFrame(() => {
    const el = (root ?? document).querySelector<HTMLElement>('[aria-invalid="true"]');
    el?.focus();
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  });
}
