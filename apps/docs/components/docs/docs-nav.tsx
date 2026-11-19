"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@recanica/ui/lib/utils";
import { nav } from "@/lib/docs";

export function DocsNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-6 pb-10 text-sm">
      {nav.map((section) => (
        <div key={section.title} className="space-y-2">
          {section.href ? (
            <Link href={section.href} onClick={onNavigate} className={cn("block px-3 font-medium", pathname === section.href ? "text-foreground" : "text-foreground/90 hover:text-foreground")}>
              {section.title}
            </Link>
          ) : (
            <p className="px-3 font-medium">{section.title}</p>
          )}
          {section.groups.map((g, gi) => (
            <div key={g.title ?? gi} className="space-y-0.5">
              {g.title && <p className="px-3 pt-2 pb-1 text-xs text-muted-foreground/70">{g.title}</p>}
              {g.items.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  title={l.title}
                  onClick={onNavigate}
                  className={cn(
                    "block truncate rounded-lg px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground",
                    pathname === l.href && "bg-accent text-foreground"
                  )}
                >
                  {l.title}
                </Link>
              ))}
            </div>
          ))}
        </div>
      ))}
    </nav>
  );
}
