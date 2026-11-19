import catalog from "./catalog.json";
import { slugify } from "./kit";

export type DemoPage = { label: string; href: string };
export type DemoGroup = { title: string; pages: DemoPage[] };

/** Every page in the demos, grouped. Feeds the floating page menu so any page is one click away. */
export const demoGroups: DemoGroup[] = [
  {
    title: "Website",
    pages: [
      ["Home", "/site"], ["About", "/site/about"], ["Blog", "/site/blog"], ["Blog post", "/site/blog/e-invoice-2026"],
      ["Shop", "/site/shop"], ["Product", "/site/shop/kopi-ais-blend"], ["Cart", "/site/shop/cart"], ["Checkout", "/site/shop/checkout"],
      ["Thank you", "/site/shop/thank-you"], ["Work", "/site/work"], ["Case study", "/site/work/kopitiam-ordering"],
      ["Property", "/site/property"], ["Property detail", "/site/property/mont-kiara"], ["Events", "/site/events"],
      ["Event detail", "/site/events/e-invoice-clinic"], ["Team member", "/site/team/mei-kato"], ["Careers", "/site/careers"],
      ["Contact", "/site/contact"], ["Login", "/site/login"], ["Link in bio", "/site/links"], ["Coming soon", "/site/coming-soon"], ["404", "/site/not-found"],
    ].map(([label, href]) => ({ label, href })),
  },
  {
    title: "Dashboard",
    pages: [
      ["Overview", "/demo/app"], ["Products", "/demo/app/products"], ["New product", "/demo/app/products/new"],
      ["Checkout links", "/demo/app/links"], ["Customers", "/demo/app/customers"], ["Customer detail", "/demo/app/customers/cus_3"],
      ["Orders", "/demo/app/sales"], ["Subscriptions", "/demo/app/subscriptions"], ["Invoices", "/demo/app/invoices"],
      ["New invoice", "/demo/app/invoices/new"], ["Invoice detail", "/demo/app/invoices/inv_2"], ["Finance", "/demo/app/finance"],
      ["Reports", "/demo/app/reports"], ["Tasks", "/demo/app/tasks"], ["Calendar", "/demo/app/calendar"], ["Files", "/demo/app/files"],
      ["Support", "/demo/app/support"], ["Notifications", "/demo/app/notifications"], ["Settings", "/demo/app/settings"],
      ["Team", "/demo/app/team"], ["Developers", "/demo/app/developers"], ["Integrations", "/demo/app/integrations"], ["Audit log", "/demo/app/audit"],
    ].map(([label, href]) => ({ label, href })),
  },
  {
    title: "Customer side",
    pages: [
      ["Sign in", "/demo/sign-in"], ["Hosted checkout", "/demo/checkout/lnk_bf"], ["Payment success", "/demo/checkout/success"],
      ["Customer portal", "/demo/portal"],
    ].map(([label, href]) => ({ label, href })),
  },
  {
    title: "UI kit",
    pages: [
      { label: "All components", href: "/demo/app/ui" },
      ...[...new Set(catalog.components.map((c) => c.category))].map((c) => ({ label: c, href: `/demo/app/ui/${slugify(c)}` })),
      { label: "Forms", href: "/demo/app/forms" },
      { label: "Patterns & blocks", href: "/demo/app/ui/patterns" },
      { label: "Page types", href: "/demo/app/library" },
    ],
  },
  {
    title: "Web sections",
    pages: [{ label: "All sections", href: "/site/sections" }, ...catalog.web.map((w) => ({ label: w.title, href: `/site/sections/${w.slug}` }))],
  },
  { title: "Design system", pages: [{ label: "Docs", href: "/docs" }, { label: "Page library", href: "/docs/page-library" }] },
];
