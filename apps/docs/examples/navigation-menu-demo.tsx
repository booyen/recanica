"use client";

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@recanica/ui/components/navigation-menu";

const products = [
  { title: "Checkout", body: "Hosted checkout and payment links." },
  { title: "Subscriptions", body: "Recurring billing with proration." },
  { title: "Analytics", body: "Revenue, churn and cohorts." },
  { title: "Payouts", body: "Get paid globally." },
];

export default function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Product</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[min(28rem,80vw)] gap-1 p-2 sm:grid-cols-2">
              {products.map((p) => (
                <li key={p.title}>
                  <NavigationMenuLink href="/demo/app/products">
                    <span className="text-sm">{p.title}</span>
                    <span className="text-xs text-muted-foreground">{p.body}</span>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem><NavigationMenuLink href="/site/shop" className={navigationMenuTriggerStyle()}>Pricing</NavigationMenuLink></NavigationMenuItem>
        <NavigationMenuItem className="hidden sm:block"><NavigationMenuLink href="/docs" className={navigationMenuTriggerStyle()}>Docs</NavigationMenuLink></NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
