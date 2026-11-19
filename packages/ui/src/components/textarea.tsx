"use client"

import * as React from "react"
import { cn } from "@recanica/ui/lib/utils"
import { useFieldInvalid } from "@recanica/ui/components/field"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  const invalid = useFieldInvalid()
  return (
    <textarea
      data-slot="textarea"
      aria-invalid={props["aria-invalid"] ?? (invalid || undefined)}
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 group-data-[invalid=true]/field:border-destructive group-data-[invalid=true]/field:bg-destructive/[0.04] group-data-[invalid=true]/field:ring-[3px] group-data-[invalid=true]/field:ring-destructive/15 aria-invalid:bg-destructive/[0.04] aria-invalid:ring-[3px] aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
