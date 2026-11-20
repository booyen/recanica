import * as React from "react"
import { cn } from "@recanica/ui/lib/utils"

/**
 * Layout parts: the page-level shapes Recanica pages repeat. Use these instead of writing the grid or flex by hand.
 *   CenteredPage — one thing in the middle of the screen (sign-in, verify, success, 404)
 *   SplitLayout  — main content with a side panel (cart, checkout, detail + summary)
 *   TopBar       — sticky, blurred header bar
 *   ListRow      — a row in a bordered list; interactive when it's a link or button
 *   IconBadge    — an icon in a circle (success, empty and feature states)
 */

function CenteredPage({ className, ...props }: React.ComponentProps<"main">) {
  return <main data-slot="centered-page" className={cn("flex min-h-svh items-center justify-center bg-background px-gutter py-12", className)} {...props} />
}

/** Two children: the main content, then the side panel (22rem, sticky on desktop). Stacks on small screens. */
function SplitLayout({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="split-layout"
      className={cn("mx-auto grid max-w-content gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start [&>*:last-child]:lg:sticky [&>*:last-child]:lg:top-20", className)}
      {...props}
    />
  )
}

function TopBar({ className, ...props }: React.ComponentProps<"header">) {
  return <header data-slot="top-bar" className={cn("sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md", className)} {...props} />
}

type ListRowProps<T extends React.ElementType> = { as?: T; className?: string } & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className">

/** A row in a list (use inside a Surface or a divide-y list). Rendered as a link or button, it gets the hover state. */
function ListRow<T extends React.ElementType = "div">({ as, className, ...props }: ListRowProps<T>) {
  const Tag = (as ?? "div") as React.ElementType
  const interactive = as !== undefined && as !== "div" && as !== "li"
  return (
    <Tag
      data-slot="list-row"
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2 px-(--spacing-inset) py-(--spacing-inset-sm)",
        interactive && "group transition-colors outline-none hover:bg-accent focus-visible:bg-accent",
        className
      )}
      {...props}
    />
  )
}

const iconBadgeSize = { sm: "size-8 [&_svg]:size-4", md: "size-10 [&_svg]:size-5", lg: "size-12 [&_svg]:size-6" } as const
const iconBadgeTone = { brand: "bg-brand text-brand-foreground", muted: "bg-muted text-muted-foreground", success: "bg-success/12 text-success" } as const

function IconBadge({ size = "lg", tone = "brand", className, ...props }: React.ComponentProps<"span"> & { size?: keyof typeof iconBadgeSize; tone?: keyof typeof iconBadgeTone }) {
  return <span data-slot="icon-badge" className={cn("inline-flex shrink-0 items-center justify-center rounded-full", iconBadgeSize[size], iconBadgeTone[tone], className)} {...props} />
}

export { CenteredPage, SplitLayout, TopBar, ListRow, IconBadge }
