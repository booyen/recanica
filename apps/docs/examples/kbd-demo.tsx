"use client";

import { Kbd, KbdGroup } from "@rekanica/ui/components/kbd";

export default function KbdDemo() {
  return (
    <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
      <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
      <p>Press <Kbd>/</Kbd> to search, <Kbd>Esc</Kbd> to close.</p>
    </div>
  );
}
