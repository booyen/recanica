"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftIcon, MenuIcon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@recanica/ui/components/sheet";
import { cn } from "@recanica/ui/lib/utils";

export const SITE_PAGES = [
  { href: "/site", label: "Home" },
  { href: "/site/about", label: "About" },
  { href: "/site/blog", label: "Blog" },
  { href: "/site/shop", label: "Shop" },
  { href: "/site/work", label: "Work" },
  { href: "/site/property", label: "Property" },
  { href: "/site/events", label: "Events" },
  { href: "/site/careers", label: "Careers" },
  { href: "/site/contact", label: "Contact" },
];
export const SITE_MORE = [
  { href: "/site/blog/e-invoice-2026", label: "Blog post" },
  { href: "/site/shop/kopi-ais-blend", label: "Product" },
  { href: "/site/shop/cart", label: "Cart" },
  { href: "/site/shop/checkout", label: "Checkout" },
  { href: "/site/shop/thank-you", label: "Thank you" },
  { href: "/site/work/kopitiam-ordering", label: "Case study" },
  { href: "/site/property/mont-kiara", label: "Property detail" },
  { href: "/site/events/e-invoice-clinic", label: "Event detail" },
  { href: "/site/team/mei-kato", label: "Team member" },
  { href: "/site/login", label: "Login" },
  { href: "/site/links", label: "Link in bio" },
  { href: "/site/coming-soon", label: "Coming soon" },
  { href: "/site/not-found", label: "404" },
  { href: "/site/sections", label: "All sections" },
];

const isSectionPage = (p: string) => /^\/site\/sections\/[^/]+/.test(p);

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  // Single-section previews stand alone: no sample-site chrome around them.
  if (isSectionPage(pathname)) return null;
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-content items-center gap-6 px-gutter">
        <Link href="/site" className="flex items-center gap-2"><span className="size-6 rounded-md bg-brand text-brand-foreground" /><span className="font-medium">Acme</span></Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex">
          {SITE_PAGES.slice(1).map((p) => (
            <Link key={p.href} href={p.href} aria-current={pathname.startsWith(p.href) ? "page" : undefined} className={cn("transition-colors hover:text-foreground", pathname.startsWith(p.href) && "text-foreground")}>{p.label}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild className="hidden sm:inline-flex"><Link href="/docs"><ArrowLeftIcon /> Design system</Link></Button>
          <Button variant="ghost" asChild className="hidden md:inline-flex"><Link href="/site/sections">All sections</Link></Button>
          <Button asChild className="hidden sm:inline-flex"><Link href="/site/login">Sign in</Link></Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu"><MenuIcon /></Button></SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs gap-0">
              <SheetHeader className="border-b"><SheetTitle>Pages</SheetTitle></SheetHeader>
              <nav className="overflow-y-auto p-4">
                <Link href="/docs" onClick={() => setOpen(false)} className="mb-2 flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm"><ArrowLeftIcon className="size-4" /> Back to the design system</Link>
                {[...SITE_PAGES, ...SITE_MORE].map((p) => <Link key={p.href} href={p.href} onClick={() => setOpen(false)} className="block border-b py-2.5 last:border-b-0">{p.label}</Link>)}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  if (isSectionPage(pathname)) return null;
  return (
    <footer className="border-t px-gutter py-12">
      <div className="mx-auto grid max-w-content gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-3">
          <div className="flex items-center gap-2"><span className="size-6 rounded-md bg-brand text-brand-foreground" /><span className="font-medium">Acme</span></div>
          <p className="max-w-xs text-sm text-muted-foreground">Sample website built only from the Recanica web library. Every page here is a composition of library sections.</p>
        </div>
        <ul className="space-y-2 text-sm">{SITE_PAGES.map((p) => <li key={p.href}><Link href={p.href} className="text-muted-foreground hover:text-foreground">{p.label}</Link></li>)}</ul>
        <ul className="space-y-2 text-sm">{SITE_MORE.map((p) => <li key={p.href}><Link href={p.href} className="text-muted-foreground hover:text-foreground">{p.label}</Link></li>)}</ul>
      </div>
    </footer>
  );
}
