import * as React from "react"
import { cn } from "@recanica/ui/lib/utils"

/**
 * Web section shell: the single source for marketing-section rhythm and section titles.
 * Page band padding (--spacing-section), content width, and one title style, so every section on a site matches.
 *
 *   <WebSection eyebrow="Pricing" title="Simple pricing" description="…" align="center">…</WebSection>
 */
function WebSection({
  id,
  eyebrow,
  title,
  description,
  actions,
  align = "start",
  size = "default",
  titleAs: Title = "h2",
  className,
  children,
}: {
  id?: string
  eyebrow?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  align?: "start" | "center"
  size?: "default" | "compact"
  /** "h1" when the section opens its page */
  titleAs?: "h1" | "h2"
  className?: string
  children?: React.ReactNode
}) {
  return (
    <section
      id={id}
      data-slot="web-section"
      className={cn("px-gutter", size === "compact" ? "py-section-sm" : "py-section", className)}
    >
      <div className="mx-auto flex max-w-content flex-col gap-(--spacing-stack)">
        {(title || eyebrow || description || actions) && (
          <WebSectionHeader eyebrow={eyebrow} title={title} description={description} actions={actions} align={align} titleAs={Title} />
        )}
        {children}
      </div>
    </section>
  )
}

/** The one section-title block: eyebrow, title, description, actions. Use alone when a section needs a custom body layout. */
function WebSectionHeader({
  eyebrow,
  title,
  description,
  actions,
  align = "start",
  titleAs: Title = "h2",
  className,
}: {
  eyebrow?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  align?: "start" | "center"
  titleAs?: "h1" | "h2"
  className?: string
}) {
  const center = align === "center"
  return (
    <div
      data-slot="web-section-header"
      className={cn("flex flex-col gap-(--spacing-group)", center ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between", className)}
    >
      <div className={cn("flex max-w-2xl flex-col gap-(--spacing-group)", center && "items-center")}>
        {eyebrow && <p className="text-sm text-muted-foreground">{eyebrow}</p>}
        {title && <WebSectionTitle as={Title}>{title}</WebSectionTitle>}
        {description && <p className="text-lg text-pretty text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

/** The one section-title style for web sections. Width limits (max-w-*) may be passed; the type style may not drift. */
function WebSectionTitle({ as: Tag = "h2", className, ...props }: React.ComponentProps<"h2"> & { as?: "h1" | "h2" }) {
  return <Tag data-slot="web-section-title" className={cn("text-display-sm tracking-tight text-balance", className)} {...props} />
}

/** The one hero headline (the page's h1 on landing pages). Sizes: default, or "lg" for a home hero. Colour may be the brand colour. */
function WebHeroTitle({ size = "default", as: Tag = "h1", className, ...props }: React.ComponentProps<"h1"> & { size?: "default" | "lg"; as?: "h1" | "h2" }) {
  return (
    <Tag
      data-slot="web-hero-title"
      className={cn("text-display-sm tracking-tight text-balance sm:text-display-md", size === "lg" && "lg:text-display-lg", className)}
      {...props}
    />
  )
}

export { WebSection, WebSectionHeader, WebSectionTitle, WebHeroTitle }
