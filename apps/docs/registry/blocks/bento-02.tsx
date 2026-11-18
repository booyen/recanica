import { ArrowUpRightIcon, BellIcon, CheckIcon, GlobeIcon, LockIcon, ZapIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@rekanica/ui/components/avatar";
import { Badge } from "@rekanica/ui/components/badge";
import { cn } from "@rekanica/ui/lib/utils";

function Cell({ className, eyebrow, title, children }: { className?: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className={cn("group relative flex flex-col overflow-hidden rounded-2xl border bg-card p-panel transition-colors hover:bg-accent/40", className)}>
      <p className="text-xs text-muted-foreground">{eyebrow}</p>
      <h3 className="mt-1 text-lg">{title}</h3>
      <div className="mt-6 flex flex-1 flex-col justify-end">{children}</div>
    </div>
  );
}

const bars = [32, 44, 38, 52, 48, 61, 58, 72, 66, 80, 76, 92];

export function Bento02() {
  return (
    <section className="px-gutter py-section">
      <div className="mx-auto max-w-content">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w-xl text-display-sm tracking-tight">One dashboard for the whole business</h2>
          <a href="#" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            See all features <ArrowUpRightIcon className="size-3.5" />
          </a>
        </div>

        {/* 1 col → 2 cols (sm) → 4-col asymmetric grid (lg) */}
        <div className="mt-12 grid auto-rows-[minmax(14rem,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Cell className="sm:col-span-2 lg:row-span-2" eyebrow="Analytics" title="Revenue that explains itself">
            <p className="text-metric font-light text-metallic">$48,210</p>
            <p className="text-sm text-muted-foreground">+12.4% vs last month</p>
            <div className="mt-6 flex h-40 items-end gap-1.5">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className={cn("flex-1 rounded-t-md", i === bars.length - 1 ? "bg-metallic" : "bg-muted-foreground/25")}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </Cell>

          <Cell eyebrow="Speed" title="Checkout in 2.1s">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full border"><ZapIcon className="size-4" /></span>
              <div className="h-1.5 flex-1 rounded-full bg-muted"><div className="h-full w-[88%] rounded-full bg-foreground" /></div>
            </div>
          </Cell>

          <Cell eyebrow="Security" title="PCI DSS Level 1">
            <div className="flex flex-wrap gap-2">
              {["SOC 2", "GDPR", "3DS2"].map((t) => <Badge key={t} variant="outline"><LockIcon /> {t}</Badge>)}
            </div>
          </Cell>

          <Cell className="sm:col-span-2" eyebrow="Global" title="Sell in 135 currencies">
            <div className="flex items-center gap-4">
              <GlobeIcon className="size-10 shrink-0 text-muted-foreground" strokeWidth={1.25} />
              <div className="flex flex-wrap gap-1.5">
                {["USD", "EUR", "GBP", "MYR", "SGD", "JPY", "AUD", "IDR"].map((c) => (
                  <span key={c} className="rounded-full border px-2.5 py-0.5 font-mono text-xs text-muted-foreground">{c}</span>
                ))}
              </div>
            </div>
          </Cell>

          <Cell eyebrow="Team" title="Built for collaboration">
            <div className="flex -space-x-2">
              {["NR", "LT", "MK", "AM"].map((i) => (
                <Avatar key={i} className="ring-2 ring-card"><AvatarFallback>{i}</AvatarFallback></Avatar>
              ))}
              <span className="flex size-8 items-center justify-center rounded-full border bg-muted text-[10px] text-muted-foreground ring-2 ring-card">+8</span>
            </div>
          </Cell>

          <Cell className="sm:col-span-2 lg:col-span-1" eyebrow="Alerts" title="Know the moment it happens">
            <ul className="space-y-2 text-sm">
              {[["Order paid", "now"], ["Payout sent", "2h"]].map(([t, w]) => (
                <li key={t} className="flex items-center gap-2 rounded-xl border bg-panel px-3 py-2">
                  <BellIcon className="size-3.5 text-muted-foreground" /> {t}
                  <span className="ml-auto text-xs text-muted-foreground">{w}</span>
                </li>
              ))}
            </ul>
          </Cell>

          <Cell className="sm:col-span-2 lg:col-span-2" eyebrow="Automation" title="Benefits delivered on payment">
            <ol className="grid gap-2 text-sm sm:grid-cols-3">
              {["Payment clears", "License key issued", "Access granted"].map((s, i) => (
                <li key={s} className="flex items-center gap-2 rounded-xl border bg-panel px-3 py-2">
                  <span className={cn("flex size-5 items-center justify-center rounded-full text-[10px]", i < 2 ? "bg-metallic" : "border")}>
                    {i < 2 ? <CheckIcon className="size-3" /> : i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </Cell>
        </div>
      </div>
    </section>
  );
}

export default Bento02;
