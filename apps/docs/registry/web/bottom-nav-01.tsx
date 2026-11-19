"use client";

import * as React from "react";
import { HomeIcon, ReceiptIcon, SearchIcon, ShoppingBagIcon, UserIcon } from "lucide-react";
import { cn } from "@rekanica/ui/lib/utils";

const tabs = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "search", label: "Search", icon: SearchIcon },
  { id: "orders", label: "Orders", icon: ReceiptIcon, badge: 2 },
  { id: "cart", label: "Cart", icon: ShoppingBagIcon },
  { id: "account", label: "Account", icon: UserIcon },
];

export function BottomNav01() {
  const [active, setActive] = React.useState("home");
  return (
    <div className="relative mx-auto flex min-h-[600px] max-w-sm flex-col border-x bg-background">
      <main className="flex-1 space-y-3 p-4 pb-24">
        <h1 className="text-title capitalize">{active}</h1>
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 rounded-2xl border bg-muted/50" />)}
      </main>
      {/* Fixed to the viewport in real apps: use `fixed inset-x-0 bottom-0` and pad for the safe area */}
      <nav aria-label="Primary" className="absolute inset-x-0 bottom-0 border-t bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <ul className="grid grid-cols-5">
          {tabs.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => setActive(t.id)}
                aria-current={active === t.id ? "page" : undefined}
                className={cn("relative flex w-full flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground transition-colors", active === t.id && "text-foreground")}
              >
                <t.icon className="size-5" strokeWidth={active === t.id ? 2.25 : 1.75} />
                {t.label}
                {t.badge && <span className="absolute top-1.5 left-1/2 ml-2 flex size-4 items-center justify-center rounded-full bg-foreground text-[10px] text-background">{t.badge}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default BottomNav01;
