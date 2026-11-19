import { ArrowRightIcon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";
import { BarRow, Stat, StatGroup, StatHeader, StatList, StatValue } from "@recanica/ui/components/stat";

export function Hero02() {
  return (
    <section className="overflow-hidden px-gutter pt-section">
      <div className="mx-auto max-w-content">
        <div className="max-w-2xl space-y-6">
          <p className="text-sm text-muted-foreground">Billing infrastructure for software</p>
          <h1 className="text-display-sm tracking-tight text-balance sm:text-display-md">
            Sell software <span className="text-brand">without building billing</span>
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Checkout, subscriptions, tax and payouts, handled. You ship the product, we run the money.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" variant="brand">Start for free <ArrowRightIcon /></Button>
            <Button size="lg" variant="ghost">Read the docs</Button>
          </div>
        </div>

        {/* Product frame: bleeds off the bottom on purpose */}
        <div className="mt-14 rounded-t-2xl border border-b-0 bg-sidebar p-2 pb-0 sm:mt-20">
          <div className="rounded-t-xl border border-b-0 bg-panel p-4 sm:p-8">
            <div className="mb-6 flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-border" /><span className="size-2.5 rounded-full bg-border" /><span className="size-2.5 rounded-full bg-border" />
              <span className="ml-3 text-title">Overview</span>
            </div>
            <StatGroup>
              <Stat>
                <StatHeader title="Revenue" />
                <StatValue value="$48,210" caption="November" />
                <StatList>
                  <BarRow label="Nov" value="$48k" percent={100} active />
                  <BarRow label="Oct" value="$39k" percent={81} />
                </StatList>
              </Stat>
              <Stat className="hidden md:flex">
                <StatHeader title="Customers" />
                <StatValue value="1,284" caption="+3.1%" />
                <StatList>
                  <BarRow label="Nov" value="1,284" percent={100} active />
                  <BarRow label="Oct" value="1,245" percent={96} />
                </StatList>
              </Stat>
              <Stat className="hidden lg:flex">
                <StatHeader title="MRR" />
                <StatValue value={<span className="text-brand">$12.4k</span>} caption="+8%" />
              </Stat>
            </StatGroup>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero02;
