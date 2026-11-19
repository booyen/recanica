import catalog from "../lib/catalog.json";

/** Every route worth checking, generated from the catalog so new items are covered automatically. */
export const publicPages = [
  "/", "/docs", "/docs/installation", "/docs/theming", "/docs/ai",
  ...["colors", "typography", "spacing", "surfaces", "finish", "iconography", "motion"].map((s) => `/docs/foundations/${s}`),
  "/docs/components", "/docs/patterns", "/docs/blocks",
  ...catalog.components.map((c) => `/docs/components/${c.slug}`),
  ...catalog.patterns.map((p) => `/view/patterns/${p.slug}`),
  ...catalog.blocks.map((b) => `/view/blocks/${b.slug}`),
  ...catalog.web.map((w) => `/view/web/${w.slug}`),
  "/docs/web",
  "/demo", "/demo/sign-in", "/demo/stress", "/demo/portal",
  "/site", "/site/about", "/site/blog", "/site/blog/e-invoice-2026", "/site/shop", "/site/shop/kopi-ais-blend", "/site/shop/cart",
  "/site/shop/checkout", "/site/shop/thank-you", "/site/work", "/site/work/kopitiam-ordering", "/site/property", "/site/property/mont-kiara",
  "/site/events", "/site/events/e-invoice-clinic", "/site/careers", "/site/contact", "/site/team/mei-kato", "/site/login", "/site/links",
  "/site/coming-soon", "/site/not-found", "/site/sections", "/demo/checkout/lnk_bf", "/demo/pay/inv_2", "/demo/pay/inv_3",
];

/** Demo routes behind the (fake) sign-in */
export const appPages = [
  "/demo/app", "/demo/app/products", "/demo/app/products/new", "/demo/app/products/prod_pro_m", "/demo/app/links?id=lnk_bf",
  "/demo/app/customers", "/demo/app/customers/cus_3", "/demo/app/sales", "/demo/app/subscriptions",
  "/demo/app/invoices", "/demo/app/invoices/new", "/demo/app/invoices/inv_2", "/demo/app/finance", "/demo/app/settings",
  "/demo/app/reports", "/demo/app/team", "/demo/app/notifications", "/demo/app/audit", "/demo/app/developers", "/demo/app/integrations",
  "/demo/app/tasks", "/demo/app/calendar", "/demo/app/files", "/demo/app/support", "/demo/app/library",
];
