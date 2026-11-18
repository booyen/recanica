"use client";

import { BarRow, Stat, StatGroup, StatHeader, StatList, StatRow, StatValue } from "@rekanica/ui/components/stat";

export default function StatDemo() {
  return (
    <StatGroup className="w-full text-left">
      <Stat>
        <StatHeader title="Revenue" href="#" />
        <StatValue value="$4,820" caption="November" />
        <StatList>
          <BarRow label="Nov" value="$4,820" percent={100} active />
          <BarRow label="Oct" value="$3,960" percent={82} />
          <BarRow label="Sep" value="$3,410" percent={71} />
        </StatList>
      </Stat>
      <Stat>
        <StatHeader title="Activity" href="#" />
        <StatValue value="14" caption="events today" />
        <StatList>
          <StatRow primary="Order paid" secondary="Nadia Rahman" trailing="now" />
          <StatRow primary="Subscription created" secondary="Leo Tan" trailing="1h ago" />
          <StatRow primary="Order paid" secondary="Leo Tan" trailing="1h ago" />
        </StatList>
      </Stat>
    </StatGroup>
  );
}
