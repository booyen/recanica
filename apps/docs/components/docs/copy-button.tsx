"use client";

import * as React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@rekanica/ui/components/button";
import { cn } from "@rekanica/ui/lib/utils";

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [done, setDone] = React.useState(false);
  return (
    <Button
      size="icon-sm"
      variant="ghost"
      aria-label="Copy"
      className={cn("text-muted-foreground", className)}
      onClick={async () => {
        try { await navigator.clipboard.writeText(value); setDone(true); setTimeout(() => setDone(false), 1500); } catch {}
      }}
    >
      {done ? <CheckIcon /> : <CopyIcon />}
    </Button>
  );
}
