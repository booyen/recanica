import { CopyButton } from "./copy-button";

export function CodeFrame({ html, raw, title, maxHeight }: { html: string; raw: string; title?: string; maxHeight?: number }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-surface">
      {title && <div className="border-b px-4 py-2.5 font-mono text-xs text-muted-foreground">{title}</div>}
      <CopyButton value={raw} className="absolute top-1.5 right-1.5 z-10" />
      <div
        className="overflow-auto p-4 font-mono text-[13px] leading-6 [&_pre]:outline-none"
        style={maxHeight ? { maxHeight } : undefined}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
