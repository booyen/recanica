"use client";

import * as React from "react";
import { HomeIcon, ReceiptIcon, SearchIcon, ShoppingBagIcon, UserIcon } from "lucide-react";
import { cn } from "@recanica/ui/lib/utils";
import { Heading } from "@recanica/ui/components/page";
import { NavItem } from "@recanica/ui/components/nav-item";

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
        <Heading level={1} className="capitalize">{active}</Heading>
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 rounded-2xl border bg-muted/50" />)}
      </main>
      {/* Fixed to the viewport in real apps: use `fixed inset-x-0 bottom-0` and pad for the safe area */}
      <nav aria-label="Primary" className="absolute inset-x-0 bottom-0 border-t bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <ul className="grid grid-cols-5">
          {tabs.map((t) => (
            <li key={t.id}>
              <NavItem variant="tab" active={active === t.id} onClick={() => setActive(t.id)} className="relative">
                <t.icon className="size-5" strokeWidth={active === t.id ? 2.25 : 1.75} />
                {t.label}
                {t.badge && <span className="absolute top-1.5 left-1/2 ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-xs text-background">{t.badge}</span>}
              </NavItem>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default BottomNav01;
