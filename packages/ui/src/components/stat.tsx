import * as React from "react";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "../lib/utils";

/**
 * Polar-style metric panels: several stats share one bordered container,
 * split by hairline dividers.
 *
 * <StatGroup>
 *   <Stat>
 *     <StatHeader title="Revenue" href="/revenue" />
 *     <StatValue value="$48" caption="November" />
 *     <StatList><BarRow label="Nov" value="$48" percent={100} /></StatList>
 *   </Stat>
 * </StatGroup>
 */
function StatGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-group"
      className={cn(
        // Container-aware: each stat wants ≥17rem; they wrap to new rows when the *container* is narrow
        // (not the viewport), and the last stat in a row grows to fill it. gap-px over bg-border = hairlines.
        "flex flex-wrap gap-px overflow-hidden rounded-2xl border bg-border",
        className
      )}
      {...props}
    />
  );
}

function Stat({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="stat" className={cn("@container flex min-w-0 flex-[1_1_17rem] flex-col gap-6 bg-card p-panel", className)} {...props} />;
}

function StatHeader({
  title,
  href,
  actionLabel = "View all",
  className,
}: { title: React.ReactNode; href?: string; actionLabel?: string; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm", className)}>
      <span className="min-w-0">{title}</span>
      {href && (
        <a href={href} className="-my-1 inline-flex shrink-0 items-center gap-1 py-1 whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground">
          {actionLabel} <ArrowRightIcon className="size-3.5" />
        </a>
      )}
    </div>
  );
}

function StatValue({
  value,
  caption,
  className,
}: { value: React.ReactNode; caption?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-3 gap-y-1", className)}>
      <span className="text-metric font-light whitespace-nowrap tabular-nums">{value}</span>
      {caption && <span className="text-sm whitespace-nowrap text-muted-foreground">{caption}</span>}
    </div>
  );
}

function StatList({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="stat-list" className={cn("flex flex-col divide-y border-t", className)} {...props} />;
}

/** One line in a StatList: primary text, muted secondary text, trailing meta. */
function StatRow({
  primary,
  secondary,
  trailing,
  className,
}: { primary: React.ReactNode; secondary?: React.ReactNode; trailing?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 py-3 text-sm", className)}>
      {/* Narrow card: secondary text sits under the primary text. Wide card: inline, Polar-style. */}
      <span className="flex min-w-0 flex-1 flex-col @[22rem]:flex-row @[22rem]:items-baseline @[22rem]:gap-2">
        <span className="truncate">{primary}</span>
        {secondary && <span className="truncate text-muted-foreground">{secondary}</span>}
      </span>
      {trailing && <span className="shrink-0 whitespace-nowrap text-muted-foreground tabular-nums">{trailing}</span>}
    </div>
  );
}

/** Label, a thin progress track, and a value. The active row is highlighted. */
function BarRow({
  label,
  value,
  percent,
  active,
  className,
}: { label: React.ReactNode; value: React.ReactNode; percent: number; active?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-4 py-3 text-sm", !active && "text-muted-foreground", className)}>
      <span className="w-8 shrink-0">{label}</span>
      <div className="relative h-0.5 flex-1 rounded-full bg-border">
        <div
          className={cn("absolute inset-y-0 left-0 rounded-full", active ? "bg-foreground" : "bg-muted-foreground/40")}
          style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
        />
      </div>
      <span className={cn("shrink-0 tabular-nums", active && "text-foreground")}>{value}</span>
    </div>
  );
}

export { StatGroup, Stat, StatHeader, StatValue, StatList, StatRow, BarRow };
