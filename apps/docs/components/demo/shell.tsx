"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRightIcon, BellIcon, BoxIcon, BriefcaseIcon, CheckCheckIcon, ChevronsUpDownIcon, DollarSignIcon, FileTextIcon,
  LayoutGridIcon, LayoutListIcon, LinkIcon, LogOutIcon, MenuIcon, PlusIcon, RotateCcwIcon, SearchIcon, SettingsIcon,
  ShoppingBagIcon, SlidersHorizontalIcon, TrendingUpIcon, UserPlusIcon, UsersIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@rekanica/ui/components/avatar";
import { Button } from "@rekanica/ui/components/button";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from "@rekanica/ui/components/command";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@rekanica/ui/components/dropdown-menu";
import { Kbd } from "@rekanica/ui/components/kbd";
import { Popover, PopoverContent, PopoverTrigger } from "@rekanica/ui/components/popover";
import { ScrollArea } from "@rekanica/ui/components/scroll-area";
import { Sheet, SheetContent, SheetTitle } from "@rekanica/ui/components/sheet";
import { cn } from "@rekanica/ui/lib/utils";
import { ago, initials, useDemo } from "@/lib/demo/store";

type NavItem = { label: string; href: string; icon: typeof BoxIcon; children?: { label: string; href: string }[] };

const NAV: NavItem[] = [
  { label: "Overview", href: "/demo/app", icon: LayoutGridIcon },
  { label: "Products", href: "/demo/app/products", icon: BoxIcon, children: [
    { label: "Catalogue", href: "/demo/app/products" },
    { label: "Checkout Links", href: "/demo/app/links" },
  ] },
  { label: "Customers", href: "/demo/app/customers", icon: UsersIcon },
  { label: "Sales", href: "/demo/app/sales", icon: ShoppingBagIcon, children: [
    { label: "Orders", href: "/demo/app/sales" },
    { label: "Subscriptions", href: "/demo/app/subscriptions" },
    { label: "Invoices", href: "/demo/app/invoices" },
  ] },
  { label: "Finance", href: "/demo/app/finance", icon: DollarSignIcon },
  { label: "Reports", href: "/demo/app/reports", icon: TrendingUpIcon },
  { label: "Workspace", href: "/demo/app/tasks", icon: BriefcaseIcon, children: [
    { label: "Tasks", href: "/demo/app/tasks" },
    { label: "Calendar", href: "/demo/app/calendar" },
    { label: "Files", href: "/demo/app/files" },
    { label: "Support", href: "/demo/app/support" },
  ] },
  { label: "Settings", href: "/demo/app/settings", icon: SlidersHorizontalIcon, children: [
    { label: "General", href: "/demo/app/settings" },
    { label: "Team", href: "/demo/app/team" },
    { label: "Developers", href: "/demo/app/developers" },
    { label: "Integrations", href: "/demo/app/integrations" },
    { label: "Audit log", href: "/demo/app/audit" },
  ] },
];

function isActive(pathname: string, href: string) {
  return href === "/demo/app" ? pathname === href : pathname === href || pathname.startsWith(href + "/");
}

function Notifications() {
  const { state } = useDemo();
  const [seenAt, setSeenAt] = React.useState<string>(() => {
    try { return localStorage.getItem("rekanica-demo-seen") ?? ""; } catch { return ""; }
  });
  const unread = state.events.filter((e) => !seenAt || e.at > seenAt).length;
  const markRead = () => {
    const t = new Date().toISOString();
    setSeenAt(t);
    try { localStorage.setItem("rekanica-demo-seen", t); } catch {}
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon-sm" variant="ghost" aria-label="Notifications" className="relative">
          <BellIcon />
          {unread > 0 && <span className="absolute top-1 right-1 size-1.5 rounded-full bg-foreground" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[min(22rem,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <p className="text-sm">Activity</p>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={markRead} disabled={!unread}><CheckCheckIcon /> Mark read</Button>
            <Button variant="ghost" size="sm" asChild><Link href="/demo/app/notifications">View all</Link></Button>
          </div>
        </div>
        <ScrollArea className="h-80">
          <ul className="p-2">
            {state.events.map((e) => {
              const fresh = !seenAt || e.at > seenAt;
              const body = (
                <>
                  <span className="flex-1">
                    {e.title} {e.who && <span className="text-muted-foreground">{e.who}</span>}
                    <span className="block text-xs text-muted-foreground">{ago(e.at)}</span>
                  </span>
                  <span className={cn("mt-1.5 size-1.5 rounded-full", fresh ? "bg-foreground" : "bg-transparent")} />
                </>
              );
              return (
                <li key={e.id}>
                  {e.href ? (
                    <Link href={e.href} className="flex gap-3 rounded-xl p-2.5 text-sm transition-colors hover:bg-accent">{body}</Link>
                  ) : (
                    <div className="flex gap-3 rounded-xl p-2.5 text-sm">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

function SidebarContents({ onNavigate, openSearch }: { onNavigate?: () => void; openSearch: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, dispatch } = useDemo();
  return (
    <div className="flex h-full flex-col gap-1 p-3">
      <div className="mb-4 flex items-center justify-between px-2 py-1">
        <Link href="/demo" onClick={onNavigate} aria-label="Demo home"><span className="block size-6 rounded-md bg-metallic" /></Link>
        <div className="flex">
          <Notifications />
          <Button size="icon-sm" variant="ghost" aria-label="Search" onClick={openSearch}><SearchIcon /></Button>
        </div>
      </div>
      <nav className="flex flex-col gap-0.5">
        {NAV.map((n) => {
          const open = isActive(pathname, n.href) || n.children?.some((c) => isActive(pathname, c.href));
          return (
            <div key={n.label}>
              <Link
                href={n.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:text-foreground",
                  open && "bg-sidebar-accent text-foreground"
                )}
              >
                <n.icon className="size-4" /> {n.label}
              </Link>
              {n.children && open && (
                <div className="my-1 ml-5 flex flex-col border-l pl-3">
                  {n.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={onNavigate}
                      className={cn("py-1.5 text-sm text-sidebar-foreground transition-colors hover:text-foreground", isActive(pathname, c.href) && "text-foreground")}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1 pt-6">
        {!state.org.payoutConnected && (
          <div className="mb-3 rounded-xl border bg-panel p-4 text-sm">
            <p>Connect payouts</p>
            <p className="mt-1 text-muted-foreground">Link a bank account to withdraw your balance.</p>
            <Link href="/demo/app/finance" onClick={onNavigate} className="mt-3 inline-block font-medium text-metallic">Set up</Link>
          </div>
        )}
        <Link href="/demo/app/library" onClick={onNavigate} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:text-foreground">
          <LayoutListIcon className="size-4" /> Page library
        </Link>
        <Link href="/demo/portal" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:text-foreground">
          <UsersIcon className="size-4" /> Customer portal
        </Link>
        <Link href="/docs" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:text-foreground">
          <ArrowUpRightIcon className="size-4" /> Design system
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="mt-2 flex w-full items-center gap-3 rounded-lg border-t px-2 pt-3 text-left text-sm">
            <Avatar className="size-7"><AvatarFallback>{initials(state.org.name)}</AvatarFallback></Avatar>
            <span className="flex-1 truncate">{state.org.name}</span>
            <ChevronsUpDownIcon className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-56">
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">{state.user.email}</DropdownMenuLabel>
            <DropdownMenuItem asChild><Link href="/demo/app/settings" onClick={onNavigate}><SettingsIcon /> Settings</Link></DropdownMenuItem>
            <DropdownMenuItem onSelect={() => { dispatch({ type: "reset" }); toast("Demo data reset"); }}><RotateCcwIcon /> Reset demo data</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => { dispatch({ type: "signOut" }); router.push("/demo/sign-in"); }}><LogOutIcon /> Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function CommandMenu({ open, setOpen }: { open: boolean; setOpen: (o: boolean) => void }) {
  const router = useRouter();
  const { state } = useDemo();
  const go = (href: string) => { setOpen(false); router.push(href); };
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search products, customers, invoices…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Create">
          <CommandItem onSelect={() => go("/demo/app/products/new")}><PlusIcon /> New product</CommandItem>
          <CommandItem onSelect={() => go("/demo/app/links?new=1")}><LinkIcon /> New checkout link</CommandItem>
          <CommandItem onSelect={() => go("/demo/app/invoices/new")}><FileTextIcon /> New invoice</CommandItem>
          <CommandItem onSelect={() => go("/demo/app/customers?new=1")}><UserPlusIcon /> New customer</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Go to">
          {NAV.flatMap((n) => (n.children ? n.children.map((c) => ({ ...c, icon: n.icon })) : [{ label: n.label, href: n.href, icon: n.icon }])).map((n) => (
            <CommandItem key={n.href + n.label} onSelect={() => go(n.href)}><n.icon /> {n.label}</CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Products">
          {state.products.map((p) => <CommandItem key={p.id} value={`product ${p.name}`} onSelect={() => go(`/demo/app/products/${p.id}`)}><BoxIcon /> {p.name}</CommandItem>)}
        </CommandGroup>
        <CommandGroup heading="Customers">
          {state.customers.map((c) => <CommandItem key={c.id} value={`customer ${c.name} ${c.email}`} onSelect={() => go(`/demo/app/customers/${c.id}`)}><UsersIcon /> {c.name}<span className="text-muted-foreground">{c.email}</span></CommandItem>)}
        </CommandGroup>
        <CommandGroup heading="Invoices">
          {state.invoices.map((i) => <CommandItem key={i.id} value={`invoice ${i.number}`} onSelect={() => go(`/demo/app/invoices/${i.id}`)}><FileTextIcon /> {i.number}</CommandItem>)}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function DemoShell({ children }: { children: React.ReactNode }) {
  const { state } = useDemo();
  const router = useRouter();
  const pathname = usePathname();
  const [menu, setMenu] = React.useState(false);
  const [search, setSearch] = React.useState(false);
  const scroller = React.useRef<HTMLElement>(null);

  // The panel is the scroll container, so reset it on navigation.
  React.useEffect(() => { scroller.current?.scrollTo({ top: 0 }); }, [pathname]);

  React.useEffect(() => {
    if (!state.signedIn) router.replace("/demo/sign-in");
  }, [state.signedIn, router]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setSearch((s) => !s); }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!state.signedIn) return null;
  const current = NAV.flatMap((n) => [n, ...(n.children ?? []).map((c) => ({ ...c, icon: n.icon }))]).filter((n) => isActive(pathname, n.href)).pop();

  return (
    <div className="flex h-svh overflow-hidden bg-sidebar text-foreground">
      <aside className="hidden h-full w-sidebar shrink-0 overflow-y-auto md:block">
        <SidebarContents openSearch={() => setSearch(true)} />
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col p-2 md:pl-0">
        <div className="flex shrink-0 items-center gap-2 px-1 pb-2 md:hidden">
          <Button variant="ghost" size="icon" aria-label="Open menu" onClick={() => setMenu(true)}><MenuIcon /></Button>
          <span className="size-5 rounded-md bg-metallic" />
          <span className="text-sm">{current?.label ?? state.org.name}</span>
          <Button variant="ghost" size="icon" className="ml-auto" aria-label="Search" onClick={() => setSearch(true)}><SearchIcon /></Button>
        </div>
        {/* Frame stays put; only the content inside scrolls, so the rounded border never moves. */}
        <main ref={scroller} className="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-2xl border bg-panel">
          <div className="mx-auto max-w-content px-gutter py-6 pb-16 sm:py-8">{children}</div>
        </main>
        <p className="hidden shrink-0 px-2 pt-2 text-xs text-muted-foreground md:block">
          Demo data lives in your browser. Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search.
        </p>
      </div>
      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="left" className="w-72 bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContents onNavigate={() => setMenu(false)} openSearch={() => { setMenu(false); setSearch(true); }} />
        </SheetContent>
      </Sheet>
      <CommandMenu open={search} setOpen={setSearch} />
    </div>
  );
}
