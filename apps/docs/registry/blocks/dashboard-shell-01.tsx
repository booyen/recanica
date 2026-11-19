import {
  ArrowUpRightIcon, BarChart3Icon, BellIcon, BoxIcon, ChevronDownIcon, DollarSignIcon, LayoutGridIcon,
  LifeBuoyIcon, MenuIcon, SearchIcon, ShoppingBagIcon, SlidersHorizontalIcon, TrendingUpIcon, UsersIcon, WalletIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@rekanica/ui/components/avatar";
import { Button } from "@rekanica/ui/components/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@rekanica/ui/components/sheet";
import { Tabs, TabsList, TabsTrigger } from "@rekanica/ui/components/tabs";
import { BarRow, Stat, StatGroup, StatHeader, StatList, StatRow, StatValue } from "@rekanica/ui/components/stat";
import { cn } from "@rekanica/ui/lib/utils";

const nav = [
  { label: "Overview", icon: LayoutGridIcon, active: true },
  { label: "Products", icon: BoxIcon, children: ["Catalogue", "Checkout Links", "Discounts", "Benefits"] },
  { label: "Customers", icon: UsersIcon },
  { label: "Analytics", icon: TrendingUpIcon },
  { label: "Sales", icon: ShoppingBagIcon },
  { label: "Finance", icon: DollarSignIcon },
  { label: "Settings", icon: SlidersHorizontalIcon },
];

function NavItem({ label, icon: Icon, active }: { label: string; icon: typeof BoxIcon; active?: boolean }) {
  return (
    <a
      href="#"
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:text-foreground",
        active && "bg-sidebar-accent text-foreground"
      )}
    >
      <Icon className="size-4" /> {label}
    </a>
  );
}

function SidebarContents() {
  return (
    <div className="flex h-full flex-col gap-1 p-3">
      <div className="mb-4 flex items-center justify-between px-2 py-1">
        <span className="size-6 rounded-md bg-metallic" aria-label="Aturanica" />
        <div className="flex">
          <Button size="icon" variant="ghost" aria-label="Notifications"><BellIcon /></Button>
          <Button size="icon" variant="ghost" aria-label="Search"><SearchIcon /></Button>
        </div>
      </div>
      {nav.map((n) => (
        <div key={n.label}>
          <NavItem label={n.label} icon={n.icon} active={n.active} />
          {n.children && (
            <div className="my-1 ml-5 flex flex-col border-l pl-3">
              {n.children.map((c) => (
                <a key={c} href="#" className="py-1.5 text-sm text-sidebar-foreground transition-colors hover:text-foreground">{c}</a>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="mt-auto space-y-1">
        <div className="mb-3 rounded-xl border bg-panel p-4 text-sm">
          <p>Introducing Aturanica Pro</p>
          <p className="mt-1 text-muted-foreground">Advanced reports and a lower 2.5% fee.</p>
          <a href="#" className="mt-3 inline-block font-medium text-metallic">Upgrade</a>
        </div>
        <NavItem label="Support" icon={LifeBuoyIcon} />
        <NavItem label="Documentation" icon={ArrowUpRightIcon} />
        <div className="mt-2 flex items-center gap-3 border-t px-2 pt-3 text-sm">
          <Avatar className="size-7"><AvatarFallback>AS</AvatarFallback></Avatar>
          <span className="truncate">Acme Studio</span>
          <ChevronDownIcon className="ml-auto size-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

export function DashboardShell01() {
  return (
    <div className="flex h-svh overflow-hidden bg-sidebar text-foreground">
      <aside className="hidden h-full w-sidebar shrink-0 overflow-y-auto md:block">
        <SidebarContents />
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col p-2 md:pl-0">
        {/* Mobile top bar: sidebar moves into a sheet */}
        <div className="flex shrink-0 items-center gap-2 px-1 pb-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild><Button variant="ghost" size="icon" aria-label="Open menu"><MenuIcon /></Button></SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarContents />
            </SheetContent>
          </Sheet>
          <span className="size-5 rounded-md bg-metallic" />
          <span className="text-sm">Acme Studio</span>
        </div>
        {/* Fixed frame: content scrolls inside so the rounded border stays in place */}
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-2xl border bg-panel">
          <div className="mx-auto max-w-content space-y-stack px-gutter py-6">
            <header className="hidden items-center gap-3 md:flex">
              <Avatar><AvatarFallback>AS</AvatarFallback></Avatar>
              <span>Acme Studio</span>
              <div className="ml-auto flex gap-1">
                <Button size="icon" variant="ghost" aria-label="Wallet"><WalletIcon /></Button>
                <Button size="icon" variant="ghost" aria-label="Analytics"><BarChart3Icon /></Button>
                <Button size="icon" variant="secondary" aria-label="Search"><SearchIcon /></Button>
              </div>
            </header>

            <h1 className="text-title">Overview</h1>

            <StatGroup>
              <Stat>
                <StatHeader title="Revenue" href="#" />
                <StatValue value="$4,820" caption="November" />
                <StatList>
                  <BarRow label="Nov" value="$4,820" percent={100} active />
                  <BarRow label="Oct" value="$3,960" percent={82} />
                  <BarRow label="Sep" value="$3,410" percent={71} />
                  <BarRow label="Aug" value="$2,150" percent={45} />
                </StatList>
              </Stat>
              <Stat>
                <StatHeader title="Activity" href="#" />
                <StatValue value="14" caption="events today" />
                <StatList>
                  <StatRow primary="Order paid" secondary="Nadia Rahman" trailing="now" />
                  <StatRow primary="Subscription created" secondary="Leo Tan" trailing="1h ago" />
                  <StatRow primary="Order paid" secondary="Leo Tan" trailing="1h ago" />
                  <StatRow primary="Subscription canceled" secondary="Sam Ortiz" trailing="3h ago" />
                </StatList>
              </Stat>
              <Stat>
                <StatHeader title="Available balance" href="#" />
                <StatValue value={<span className="text-metallic">$1,206</span>} />
                <div className="mt-auto text-sm">
                  <p>Next payout on 1 Dec</p>
                  <p className="text-muted-foreground">Payouts run monthly above $10.</p>
                </div>
              </Stat>
            </StatGroup>

            <StatGroup>
              <Stat>
                <StatHeader title="Top customers" href="#" />
                <StatValue value="62%" caption="of revenue" />
                <StatList>
                  <StatRow primary="Nadia Rahman" secondary="12 orders" trailing="$1,840" />
                  <StatRow primary="Leo Tan" secondary="7 orders" trailing="$1,150" />
                </StatList>
              </Stat>
              <Stat>
                <StatHeader title="At risk" href="#" />
                <StatValue value="1" />
                <StatList>
                  <StatRow primary="Sam Ortiz" secondary="Pro Yearly" trailing="Cancels 18 Dec" />
                </StatList>
              </Stat>
              <Stat>
                <StatHeader title="Gross margin" href="#" />
                <StatValue value="86%" caption="Last 30 days" />
                <StatList>
                  <BarRow label="Oct" value="84%" percent={84} />
                  <BarRow label="Sep" value="81%" percent={81} />
                  <BarRow label="Aug" value="79%" percent={79} />
                </StatList>
              </Stat>
            </StatGroup>

            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-heading">Metrics</h2>
              <Tabs defaultValue="30d" className="order-last w-full overflow-x-auto sm:order-none sm:ml-auto sm:w-auto">
                <TabsList>
                  {["All time", "12m", "3m", "30d", "Today"].map((r) => (
                    <TabsTrigger key={r} value={r === "All time" ? "all" : r.toLowerCase()}>{r}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <Button variant="outline" size="sm" className="ml-auto sm:ml-0"><SlidersHorizontalIcon /> Customize</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardShell01;
