import { cn } from "@recanica/ui/lib/utils";

/** Bordered preview surface used across foundation pages. */
export function Frame({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("overflow-hidden rounded-2xl border bg-panel", className)}>{children}</div>;
}

export function TokenTable({ rows, head }: { rows: React.ReactNode[][]; head: string[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border">
      <table className="w-full min-w-[32rem] text-sm">
        <thead className="border-b bg-surface text-left text-muted-foreground">
          <tr>{head.map((h) => <th key={h} className="px-4 py-2.5 font-normal whitespace-nowrap">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j} className={cn("px-4 py-3 align-top", j === 0 && "font-mono text-xs", j > 0 && "text-muted-foreground")}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DoDont({ do: d, dont }: { do: string[]; dont: string[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border p-5">
        <p className="mb-3 text-sm text-success">Do</p>
        <ul className="space-y-2 text-sm text-muted-foreground">{d.map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
      <div className="rounded-2xl border p-5">
        <p className="mb-3 text-sm text-destructive">Don't</p>
        <ul className="space-y-2 text-sm text-muted-foreground">{dont.map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
    </div>
  );
}
