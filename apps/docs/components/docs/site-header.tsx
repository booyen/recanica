import Link from "next/link";
import { FinishSwitcher } from "./finish-switcher";
import { MobileNav } from "./mobile-nav";
import { SearchCommand } from "./search-command";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/components", label: "Components" },
  { href: "/docs/patterns", label: "Patterns" },
  { href: "/docs/blocks", label: "Blocks" },
  { href: "/docs/ai", label: "AI" },
  { href: "/demo", label: "Demo" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-2 px-gutter">
        <MobileNav />
        <Link href="/" className="mr-4 flex items-center gap-2">
          <span className="size-5 rounded-md bg-metallic" />
          <span className="font-medium">Rekanica</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">by Aturanica Labs</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex">
          {links.map((l) => <Link key={l.href} href={l.href} className="transition-colors hover:text-foreground">{l.label}</Link>)}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <SearchCommand />
          <FinishSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
