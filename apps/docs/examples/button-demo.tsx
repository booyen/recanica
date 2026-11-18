"use client";

import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { Button } from "@rekanica/ui/components/button";
import { Spinner } from "@rekanica/ui/components/spinner";

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button>Default</Button>
      <Button variant="brand">Brand <ArrowRightIcon /></Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Delete</Button>
      <Button size="icon" variant="outline" aria-label="Add"><PlusIcon /></Button>
      <Button disabled><Spinner /> Saving</Button>
    </div>
  );
}
