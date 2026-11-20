import { cn } from "@recanica/ui/lib/utils";
import { Surface } from "@recanica/ui/components/surface";

/** Bordered preview surface used across foundation pages. */
export function Frame({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("overflow-hidden rounded-2xl border bg-panel", className)}>{children}</div>;
}

// The reference table lives in @recanica/ui; TokenTable is kept as the docs' name for it.
export { ReferenceTable as TokenTable } from "@recanica/ui/components/page";

export function DoDont({ do: d, dont }: { do: string[]; dont: string[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Surface tone="plain">
        <p className="mb-3 text-sm text-success">Do</p>
        <ul className="space-y-2 text-sm text-muted-foreground">{d.map((x) => <li key={x}>{x}</li>)}</ul>
      </Surface>
      <Surface tone="plain">
        <p className="mb-3 text-sm text-destructive">Don't</p>
        <ul className="space-y-2 text-sm text-muted-foreground">{dont.map((x) => <li key={x}>{x}</li>)}</ul>
      </Surface>
    </div>
  );
}
