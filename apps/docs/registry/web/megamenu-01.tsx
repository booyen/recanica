"use client";

import { BarChart3Icon, BookOpenIcon, CreditCardIcon, FileTextIcon, LifeBuoyIcon, ReceiptIcon, RepeatIcon, UsersIcon } from "lucide-react";
import { Button } from "@rekanica/ui/components/button";
import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle,
} from "@rekanica/ui/components/navigation-menu";

const product = [
  { icon: CreditCardIcon, title: "Checkout", body: "Hosted payment pages and links." },
  { icon: RepeatIcon, title: "Subscriptions", body: "Plans, trials and renewals." },
  { icon: ReceiptIcon, title: "Invoicing", body: "SST invoices and payment plans." },
  { icon: BarChart3Icon, title: "Reports", body: "Revenue, churn and payouts." },
];
const resources = [
  { icon: BookOpenIcon, title: "Guides", body: "Step-by-step setup." },
  { icon: FileTextIcon, title: "API reference", body: "Endpoints and webhooks." },
  { icon: UsersIcon, title: "Customer stories", body: "How teams use Acme." },
  { icon: LifeBuoyIcon, title: "Help centre", body: "Answers and contact." },
];

function Panel({ items, aside }: { items: typeof product; aside: React.ReactNode }) {
  return (
    <div className="grid w-[min(40rem,90vw)] gap-2 p-2 md:grid-cols-[1fr_14rem]">
      <ul className="grid gap-1 sm:grid-cols-2">
        {items.map((i) => (
          <li key={i.title}>
            <NavigationMenuLink href="#" className="flex-row items-start gap-3">
              <i.icon className="mt-0.5 size-4 text-muted-foreground" />
              <span><span className="block text-sm">{i.title}</span><span className="block text-xs text-muted-foreground">{i.body}</span></span>
            </NavigationMenuLink>
          </li>
        ))}
      </ul>
      <div className="hidden rounded-xl border bg-muted/50 p-4 text-sm md:block">{aside}</div>
    </div>
  );
}

export function Megamenu01() {
  return (
    <header className="border-b bg-background px-gutter">
      <div className="mx-auto flex h-16 max-w-content items-center gap-6">
        <a href="#" className="flex items-center gap-2"><span className="size-6 rounded-md bg-metallic" /><span className="font-medium">Acme</span></a>
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Product</NavigationMenuTrigger>
              <NavigationMenuContent>
                <Panel items={product} aside={<><p>New: payment plans</p><p className="mt-1 text-muted-foreground">Split invoices into a deposit and instalments.</p><a href="#" className="mt-3 inline-block underline underline-offset-4">Read more</a></>} />
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <Panel items={resources} aside={<><p>Office hours</p><p className="mt-1 text-muted-foreground">Live Q&amp;A every Thursday, 3pm MYT.</p></>} />
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem><NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>Pricing</NavigationMenuLink></NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex gap-2">
          <Button variant="ghost" className="hidden sm:inline-flex">Sign in</Button>
          <Button>Start free</Button>
        </div>
      </div>
    </header>
  );
}

export default Megamenu01;
