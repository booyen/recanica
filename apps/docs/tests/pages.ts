import catalog from "../lib/catalog.json";

/** Every route worth checking, generated from the catalog so new items are covered automatically. */
export const publicPages = [
  "/", "/docs", "/docs/installation", "/docs/theming", "/docs/ai",
  ...["colors", "typography", "spacing", "surfaces", "finish", "iconography", "motion"].map((s) => `/docs/foundations/${s}`),
  "/docs/components", "/docs/patterns", "/docs/blocks",
  ...catalog.components.map((c) => `/docs/components/${c.slug}`),
  ...catalog.patterns.map((p) => `/view/patterns/${p.slug}`),
  ...catalog.blocks.map((b) => `/view/blocks/${b.slug}`),
  "/demo", "/demo/sign-in", "/demo/stress", "/demo/checkout/lnk_bf", "/demo/pay/inv_2", "/demo/pay/inv_3",
];

/** Demo routes behind the (fake) sign-in */
export const appPages = [
  "/demo/app", "/demo/app/products", "/demo/app/products/new", "/demo/app/products/prod_pro_m", "/demo/app/links?id=lnk_bf",
  "/demo/app/customers", "/demo/app/customers/cus_3", "/demo/app/sales", "/demo/app/subscriptions",
  "/demo/app/invoices", "/demo/app/invoices/new", "/demo/app/invoices/inv_2", "/demo/app/finance", "/demo/app/settings",
];
