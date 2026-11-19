"use client";

import { SlidersHorizontalIcon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";
import { BarRow, Stat, StatGroup, StatHeader, StatList, StatRow, StatValue } from "@recanica/ui/components/stat";
import { Tabs, TabsList, TabsTrigger } from "@recanica/ui/components/tabs";

const ranges = ["All time", "12m", "3m", "30d", "Today"];

export default function StatOverview() {
  return (
    <div className="mx-auto max-w-content space-y-stack px-gutter py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <h1 className="text-title">Overview</h1>
        <div className="flex items-center gap-2 sm:ml-auto">
          <div className="-mx-1 overflow-x-auto px-1">
            <Tabs defaultValue="30d">
              <TabsList>
                {ranges.map((r) => <TabsTrigger key={r} value={r === "All time" ? "all" : r.toLowerCase()}>{r}</TabsTrigger>)}
              </TabsList>
            </Tabs>
          </div>
          <Button variant="outline" size="icon" aria-label="Customize" className="shrink-0"><SlidersHorizontalIcon /></Button>
        </div>
      </div>

      <StatGroup>
        <Stat>
          <StatHeader title="Revenue" href="#" />
          <StatValue value="$4,820" caption="November" />
          <StatList>
            <BarRow label="Nov" value="$4,820" percent={100} active />
            <BarRow label="Oct" value="$3,960" percent={82} />
            <BarRow label="Sep" value="$3,410" percent={71} />
            <BarRow label="Aug" value="$2,150" percent={45} />
          </StatList>
        </Stat>
        <Stat>
          <StatHeader title="Activity" href="#" />
          <StatValue value="14" caption="events today" />
          <StatList>
            <StatRow primary="Order paid" secondary="Nadia Rahman" trailing="now" />
            <StatRow primary="Subscription created" secondary="Leo Tan" trailing="1h ago" />
            <StatRow primary="Order paid" secondary="Leo Tan" trailing="1h ago" />
            <StatRow primary="Subscription canceled" secondary="Sam Ortiz" trailing="3h ago" />
          </StatList>
        </Stat>
        <Stat>
          <StatHeader title="Available balance" href="#" />
          <StatValue value={<span className="text-brand">$1,206</span>} />
          <div className="mt-auto text-sm">
            <p>Next payout on 1 Dec</p>
            <p className="text-muted-foreground">Payouts run monthly above $10.</p>
          </div>
        </Stat>
      </StatGroup>

      <StatGroup>
        <Stat>
          <StatHeader title="Top customers" href="#" />
          <StatValue value="62%" caption="of revenue" />
          <StatList>
            <StatRow primary="Nadia Rahman" secondary="12 orders" trailing="$1,840" />
            <StatRow primary="Leo Tan" secondary="7 orders" trailing="$1,150" />
          </StatList>
        </Stat>
        <Stat>
          <StatHeader title="At risk" href="#" />
          <StatValue value="1" />
          <StatList>
            <StatRow primary="Sam Ortiz" secondary="Pro Yearly" trailing="Cancels 18 Dec" />
          </StatList>
        </Stat>
        <Stat>
          <StatHeader title="Gross margin" href="#" />
          <StatValue value="86%" caption="Last 30 days" />
          <StatList>
            <BarRow label="Oct" value="84%" percent={84} />
            <BarRow label="Sep" value="81%" percent={81} />
            <BarRow label="Aug" value="79%" percent={79} />
          </StatList>
        </Stat>
      </StatGroup>
    </div>
  );
}
