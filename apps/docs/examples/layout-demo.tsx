"use client";

import { CheckIcon } from "lucide-react";
import { IconBadge, ListRow, SplitLayout } from "@recanica/ui/components/layout";
import { Surface } from "@recanica/ui/components/surface";

export default function LayoutDemo() {
  return (
    <div className="w-full max-w-3xl">
      <SplitLayout>
        <Surface inset="none" className="divide-y overflow-hidden">
          {["Invoice INV-0042 paid", "Nadia joined the team", "Payout of RM 4,820 sent"].map((t) => (
            <ListRow key={t} as="button" type="button" className="w-full text-left text-sm">
              <IconBadge size="sm" tone="muted"><CheckIcon /></IconBadge>
              <span className="flex-1">{t}</span>
            </ListRow>
          ))}
        </Surface>
        <Surface tone="panel" className="text-sm">Side panel: totals, filters or facts. Sticky on desktop.</Surface>
      </SplitLayout>
    </div>
  );
}
