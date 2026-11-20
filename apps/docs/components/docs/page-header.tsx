// Docs use the shared page structure from @recanica/ui (single source for header, headings and rhythm).
import { Heading, PageHeader } from "@recanica/ui/components/page";

export function DocsPageHeader({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description?: string; children?: React.ReactNode }) {
  return <PageHeader eyebrow={eyebrow} title={title} description={description}>{children}</PageHeader>;
}

export function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return <Heading level={2} id={id}>{children}</Heading>;
}

export function H3({ id, children }: { id: string; children: React.ReactNode }) {
  return <Heading level={3} id={id}>{children}</Heading>;
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="leading-7 text-muted-foreground">{children}</p>;
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground [overflow-wrap:anywhere]">{children}</code>;
}
