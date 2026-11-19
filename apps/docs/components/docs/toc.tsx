"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@recanica/ui/lib/utils";

type Heading = { id: string; text: string; level: number };

export function Toc() {
  const pathname = usePathname();
  const [items, setItems] = React.useState<Heading[]>([]);
  const [active, setActive] = React.useState<string>();

  React.useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-docs-content] :is(h2,h3)[id]"));
    setItems(els.map((el) => ({ id: el.id, text: el.textContent ?? "", level: el.tagName === "H3" ? 3 : 2 })));
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [pathname]);

  if (!items.length) return null;
  return (
    <div className="space-y-2 text-sm">
      <p className="font-medium">On this page</p>
      <ul className="space-y-1.5">
        {items.map((h) => (
          <li key={h.id} className={cn(h.level === 3 && "pl-3")}>
            <a href={`#${h.id}`} className={cn("block text-muted-foreground transition-colors hover:text-foreground", active === h.id && "text-foreground")}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
