"use client";

import { AlertTriangleIcon, BoxIcon, SearchXIcon } from "lucide-react";
import { Button } from "@rekanica/ui/components/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@rekanica/ui/components/empty";

const states = [
  {
    icon: BoxIcon, title: "No products yet", body: "Create your first product to start selling.",
    actions: <><Button>Create product</Button><Button variant="ghost">Import</Button></>,
  },
  {
    icon: SearchXIcon, title: "No results", body: "Nothing matches “pro yearly”. Try a different search.",
    actions: <Button variant="outline">Clear filters</Button>,
  },
  {
    icon: AlertTriangleIcon, title: "Couldn't load customers", body: "Something went wrong on our side. Your data is safe.",
    actions: <Button variant="outline">Try again</Button>,
  },
];

export default function EmptyStates() {
  return (
    <div className="mx-auto grid max-w-content gap-4 px-gutter py-8 md:grid-cols-3">
      {states.map((s) => (
        <Empty key={s.title} className="rounded-2xl border bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon"><s.icon /></EmptyMedia>
            <EmptyTitle>{s.title}</EmptyTitle>
            <EmptyDescription>{s.body}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center">{s.actions}</EmptyContent>
        </Empty>
      ))}
    </div>
  );
}
