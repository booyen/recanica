import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@recanica/ui/lib/utils"

/**
 * ChoiceCard — one option among several, picked by clicking the whole card (radio semantics).
 * Wrap a set in an element with role="radiogroup" and an aria-label. `variant="media"` is an image thumbnail.
 */
const choiceCardVariants = cva(
  "text-left text-sm transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "flex items-center gap-3 rounded-xl border p-(--spacing-inset-sm) hover:bg-accent aria-checked:border-foreground/40 aria-checked:bg-accent",
        media: "rounded-xl border bg-muted aria-checked:ring-2 aria-checked:ring-foreground aria-checked:ring-offset-2 aria-checked:ring-offset-background",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function ChoiceCard({
  checked,
  onSelect,
  variant,
  className,
  ...props
}: Omit<React.ComponentProps<"button">, "onSelect"> & VariantProps<typeof choiceCardVariants> & { checked?: boolean; onSelect?: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={!!checked}
      data-slot="choice-card"
      onClick={onSelect}
      className={cn(choiceCardVariants({ variant }), className)}
      {...props}
    />
  )
}

/** The small radio dot shown at the end of a default ChoiceCard. */
function ChoiceIndicator({ checked }: { checked?: boolean }) {
  return <span aria-hidden className={cn("size-4 shrink-0 rounded-full border", checked && "border-[5px] border-foreground")} />
}

export { ChoiceCard, ChoiceIndicator, choiceCardVariants }
