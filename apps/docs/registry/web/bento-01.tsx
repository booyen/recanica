import { CheckIcon } from "lucide-react";
import { Badge } from "@recanica/ui/components/badge";
import { BarRow } from "@recanica/ui/components/stat";

function Tile({ className = "", title, body, children }: { className?: string; title: string; body: string; children?: React.ReactNode }) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border bg-card ${className}`}>
      <div className="p-panel pb-0">
        <h3>{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      </div>
      <div className="mt-6 flex-1 p-panel pt-0">{children}</div>
    </div>
  );
}

export function Bento01() {
  return (
    <section className="px-gutter py-section">
      <div className="mx-auto max-w-content">
        <h2 className="max-w-2xl text-display-sm tracking-tight">Four things you'll use every day</h2>
        <div className="mt-12 grid gap-4 md:grid-cols-6">
          <Tile className="md:col-span-4" title="Revenue at a glance" body="Revenue, refunds and payouts on one page.">
            <div className="rounded-xl border bg-panel p-4">
              <p className="text-metric font-light text-brand">$48,210</p>
              <div className="mt-2">
                <BarRow label="Nov" value="$48k" percent={100} active />
                <BarRow label="Oct" value="$39k" percent={81} />
                <BarRow label="Sep" value="$34k" percent={71} />
              </div>
            </div>
          </Tile>
          <Tile className="md:col-span-2" title="Merchant of record" body="Tax handled in 100+ jurisdictions.">
            <div className="flex flex-wrap gap-2">
              {["VAT", "GST", "Sales tax", "JCT", "SST"].map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
            </div>
          </Tile>
          <Tile className="md:col-span-2" title="Benefits delivered automatically" body="Sent as soon as the payment clears.">
            <ul className="space-y-2 text-sm">
              {["License key issued", "Discord role granted", "Repo invite sent"].map((b) => (
                <li key={b} className="flex items-center gap-2"><CheckIcon className="size-4" /> {b}</li>
              ))}
            </ul>
          </Tile>
          <Tile className="md:col-span-4" title="A short, fast checkout" body="Three fields, works on phones, matches your brand.">
            <div className="mx-auto max-w-xs space-y-3 rounded-xl border bg-panel p-4">
              <div className="flex justify-between text-sm"><span>Pro Yearly</span><span className="tabular-nums">$480</span></div>
              <div className="h-9 rounded-lg border" />
              <div className="flex h-9 items-center justify-center rounded-full bg-brand text-brand-foreground text-sm">Pay $480</div>
            </div>
          </Tile>
        </div>
      </div>
    </section>
  );
}

export default Bento01;
