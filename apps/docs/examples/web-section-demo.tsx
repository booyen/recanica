"use client";

import { Button } from "@recanica/ui/components/button";
import { WebSection } from "@recanica/ui/components/web-section";

export default function WebSectionDemo() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border bg-background">
      <WebSection
        size="compact"
        eyebrow="Pricing"
        title="Simple pricing"
        description="One plan for small teams, one for growing ones. No setup fees."
        actions={<Button variant="outline">Compare plans</Button>}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-24 rounded-2xl border bg-card" />
          <div className="h-24 rounded-2xl border bg-card" />
        </div>
      </WebSection>
    </div>
  );
}
