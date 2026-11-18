export function DocsPageHeader({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="space-y-3 pb-8">
      {eyebrow && <p className="text-sm text-muted-foreground">{eyebrow}</p>}
      <h1 className="text-title sm:text-[2.25rem] sm:leading-tight">{title}</h1>
      {description && <p className="max-w-copy text-base text-muted-foreground sm:text-lg">{description}</p>}
      {children}
    </div>
  );
}

export function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-20 pt-10 pb-4 text-heading">
      <a href={`#${id}`} className="hover:underline hover:underline-offset-4">{children}</a>
    </h2>
  );
}

export function H3({ id, children }: { id: string; children: React.ReactNode }) {
  return <h3 id={id} className="scroll-mt-20 pt-6 pb-3 text-lg">{children}</h3>;
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="max-w-copy leading-7 text-muted-foreground [&:not(:first-child)]:mt-3">{children}</p>;
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground [overflow-wrap:anywhere]">{children}</code>;
}
