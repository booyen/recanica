import * as React from "react"
import { cn } from "@recanica/ui/lib/utils"

/**
 * Page structure: the single source for visual rhythm and page layout.
 * Pages compose these and never place their own spacing between blocks.
 *
 * Rhythm (tokens): inset · group (12) · flow (20, between blocks) · stack (40, between sections) · section (page bands).
 *
 *   <Page width="reading">
 *     <PageHeader title="Invoices" description="…" actions={<Button>New invoice</Button>} />
 *     <Section title="Overdue" actions={…}>…</Section>
 *     <Section title="Paid">…</Section>
 *   </Page>
 */

const widths = { reading: "reading", content: "max-w-content", full: "" } as const

/** Page column. `flow` owns the spacing between its blocks; width is decided once for the whole column. */
function Page({ width = "full", className, ...props }: React.ComponentProps<"div"> & { width?: keyof typeof widths }) {
  return <div data-slot="page" className={cn("flow w-full", widths[width], className)} {...props} />
}

/** The one page header: optional back link and eyebrow, title, description, actions. Container-aware. */
function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  back,
  className,
  children,
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  /** e.g. <a href="/invoices">← Invoices</a>, rendered above the title */
  back?: React.ReactNode
  className?: string
  children?: React.ReactNode
}) {
  return (
    <header data-slot="page-header" className={cn("@container space-y-(--spacing-group)", className)}>
      {back && <div className="-ml-3">{back}</div>}
      <div className="flex flex-col gap-4 @2xl:flex-row @2xl:items-end @2xl:justify-between">
        <div className="min-w-0 space-y-2">
          {eyebrow && <p className="text-sm text-muted-foreground">{eyebrow}</p>}
          <Heading level={1}>{title}</Heading>
          {description && <div className="max-w-[65ch] text-muted-foreground">{description}</div>}
        </div>
        {actions && <div className="flex flex-wrap gap-2 @2xl:shrink-0 @2xl:justify-end">{actions}</div>}
      </div>
      {children}
    </header>
  )
}

const headingSize = { title: "text-title", heading: "text-heading", sm: "text-lg" } as const
const defaultSize = { 1: "title", 2: "heading", 3: "sm" } as const

/**
 * The one heading style. `level` is the document outline (h1–h3); `size` is the visual step
 * (title / heading / sm), defaulting from the level. With an `id` it becomes a link to itself.
 */
function Heading({ level = 2, size, id, className, children }: { level?: 1 | 2 | 3; size?: keyof typeof headingSize; id?: string; className?: string; children: React.ReactNode }) {
  const Tag = `h${level}` as "h1" | "h2" | "h3"
  return (
    <Tag id={id} data-slot="heading" className={cn("scroll-mt-20", headingSize[size ?? defaultSize[level]], className)}>
      {id ? <a href={`#${id}`} className="hover:underline hover:underline-offset-4">{children}</a> : children}
    </Tag>
  )
}

/** A titled group of blocks. Owns its rhythm: group gap under the heading, flow gap between its blocks. */
function Section({
  id,
  title,
  description,
  actions,
  level = 2,
  className,
  children,
}: {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  level?: 2 | 3
  className?: string
  children?: React.ReactNode
}) {
  return (
    <section data-slot="section" aria-labelledby={id} className={cn("flow", className)}>
      {(title || actions) && (
        <div data-slot="section-header" className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="min-w-0 space-y-1">
            {title && <Heading level={level} id={id}>{title}</Heading>}
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

const stackGaps = { group: "gap-(--spacing-group)", flow: "gap-(--spacing-flow)", stack: "gap-(--spacing-stack)" } as const

/** Vertical rhythm for anything that isn't a page column: cards in a sidebar, fields in a form, blocks in a panel. */
function Stack({ gap = "flow", className, ...props }: React.ComponentProps<"div"> & { gap?: keyof typeof stackGaps }) {
  return <div data-slot="stack" className={cn("flex min-w-0 flex-col", stackGaps[gap], className)} {...props} />
}

/**
 * Reference table: a key column plus description columns.
 * `keys` says what the key column holds, decided by the author, never guessed:
 *   "label" (default) → regular text; "code" (token names, classes, commands) → mono.
 * Keys never wrap in either case (same as `.rc-table td.rc-mono`); a long key widens the table and it scrolls.
 */
function ReferenceTable({ head, rows, keys = "label", className }: { head: string[]; rows: React.ReactNode[][]; keys?: "label" | "code"; className?: string }) {
  const codeKeys = keys === "code"
  return (
    <div data-slot="reference-table" className={cn("overflow-x-auto rounded-2xl border", className)}>
      <table className="w-full min-w-[32rem] text-sm">
        <thead className="border-b bg-surface text-left text-muted-foreground">
          <tr>{head.map((h) => <th key={h} className="px-(--spacing-inset-sm) py-2.5 font-normal whitespace-nowrap">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td
                  key={j}
                  className={cn(
                    "px-(--spacing-inset-sm) py-3 align-top",
                    j === 0 && cn("whitespace-nowrap", codeKeys ? "font-mono text-xs" : "text-foreground"),
                    j > 0 && "text-muted-foreground"
                  )}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export { Page, PageHeader, Heading, Section, Stack, ReferenceTable }
