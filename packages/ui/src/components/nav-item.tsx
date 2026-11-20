import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@recanica/ui/lib/utils"

/**
 * NavItem — the one selectable row: sidebar and top-nav items, list/detail rows, inbox rows, option lists.
 * `active` marks the current item (accent background + aria-current). `variant="tab"` is the icon-over-label bottom tab.
 * Renders a <button> by default; pass `as={Link}` (or "a") for navigation.
 */
const navItemVariants = cva(
  "flex w-full min-w-0 text-left text-sm transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-accent data-[active=true]:bg-accent data-[active=true]:text-foreground",
        sidebar: "items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:text-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-foreground",
        sub: "items-center py-1.5 text-sidebar-foreground hover:text-foreground data-[active=true]:text-foreground",
        pill: "w-auto shrink-0 items-center rounded-full px-3 py-1.5 whitespace-nowrap text-muted-foreground hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-foreground",
        tab: "flex-col items-center gap-1 py-2.5 text-xs text-muted-foreground data-[active=true]:text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

type NavItemProps<T extends React.ElementType> = { as?: T; active?: boolean; className?: string } & VariantProps<typeof navItemVariants> &
  Omit<React.ComponentPropsWithoutRef<T>, "as" | "className">

function NavItem<T extends React.ElementType = "button">({ as, active, variant, className, ...props }: NavItemProps<T>) {
  const Tag = (as ?? "button") as React.ElementType
  return (
    <Tag
      data-slot="nav-item"
      data-active={active || undefined}
      aria-current={active ? "page" : undefined}
      {...(Tag === "button" ? { type: "button" } : {})}
      className={cn(navItemVariants({ variant }), className)}
      {...props}
    />
  )
}

export { NavItem, navItemVariants }
