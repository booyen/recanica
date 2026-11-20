import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@recanica/ui/lib/utils"

/**
 * Surface — the one bordered box. Use it instead of hand-writing "rounded-2xl border p-…".
 * Choices are fixed on purpose: tone (which layer) and inset (padding from the rhythm tokens).
 * Need a header/body/footer structure? Use Card. Need something else? Change this part, not the page.
 */
const surfaceVariants = cva("border", {
  variants: {
    size: {
      default: "rounded-2xl",
      sm: "rounded-xl",
    },
    tone: {
      card: "bg-card text-card-foreground",
      panel: "bg-panel",
      plain: "",
      muted: "bg-muted/40",
    },
    inset: {
      none: "",
      tight: "px-3 py-2",
      sm: "p-(--spacing-inset-sm)",
      default: "p-(--spacing-inset)",
      lg: "p-(--spacing-panel)",
    },
    dashed: { true: "border-dashed", false: "" },
  },
  defaultVariants: { size: "default", tone: "card", inset: "default", dashed: false },
})

type SurfaceProps<T extends React.ElementType> = { as?: T; className?: string } & VariantProps<typeof surfaceVariants> &
  Omit<React.ComponentPropsWithoutRef<T>, "as" | "className">

/** `as` renders the surface as another element (section, li, article, a link component…). */
function Surface<T extends React.ElementType = "div">({ as, className, size, tone, inset, dashed, ...props }: SurfaceProps<T>) {
  const Tag = (as ?? "div") as React.ElementType
  return <Tag data-slot="surface" className={cn(surfaceVariants({ size, tone, inset, dashed }), className)} {...props} />
}

/**
 * SurfaceGrid — cells separated by hairlines inside one bordered surface (stats, features, logos, details).
 * The grid supplies the border, radius and dividers; give it the column classes (sm:grid-cols-3 …). Cells take the card background.
 */
function SurfaceGrid<T extends React.ElementType = "div">({ as, className, ...props }: { as?: T; className?: string } & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className">) {
  const Tag = (as ?? "div") as React.ElementType
  return <Tag data-slot="surface-grid" className={cn("grid gap-px overflow-hidden rounded-2xl border bg-border *:bg-card", className)} {...props} />
}

export { Surface, SurfaceGrid, surfaceVariants }
