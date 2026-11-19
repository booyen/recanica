import catalog from "./catalog.json";

export type CatalogItem = { slug: string; title: string; description: string; category: string; height?: number; use?: string; minWidth?: number };
export type NavLink = { title: string; href: string };
export type NavGroup = { title?: string; items: NavLink[] };
export type NavSection = { title: string; href?: string; groups: NavGroup[] };

export const components = catalog.components as CatalogItem[];
export const patterns = catalog.patterns as CatalogItem[];
export const blocks = catalog.blocks as CatalogItem[];
export const web = catalog.web as CatalogItem[];

export const foundations: CatalogItem[] = [
  { slug: "colors", title: "Colors", category: "Foundations", description: "Monochrome palette, semantic tokens and status colors." },
  { slug: "typography", title: "Typography", category: "Foundations", description: "Type scale for product UI and landing pages." },
  { slug: "spacing", title: "Spacing & Layout", category: "Foundations", description: "4px grid, layout tokens, containers and breakpoints." },
  { slug: "surfaces", title: "Surfaces & Radius", category: "Foundations", description: "Layering, borders, radius and elevation." },
  { slug: "iconography", title: "Iconography", category: "Foundations", description: "Lucide icons, sizes and stroke." },
  { slug: "navigation", title: "Navigation", category: "Foundations", description: "Side nav, top nav, site header and how each behaves as space shrinks." },
  { slug: "motion", title: "Motion", category: "Foundations", description: "Durations, easing and reduced motion." },
];

export const gettingStarted: NavLink[] = [
  { title: "Introduction", href: "/docs" },
  { title: "Design language", href: "/docs/design-language" },
  { title: "Installation", href: "/docs/installation" },
  { title: "Theming", href: "/docs/theming" },
  { title: "Use with AI", href: "/docs/ai" },
];

function grouped(items: CatalogItem[], base: string): NavGroup[] {
  const order: string[] = [];
  const by: Record<string, NavLink[]> = {};
  for (const i of items) {
    if (!by[i.category]) { by[i.category] = []; order.push(i.category); }
    by[i.category].push({ title: i.title, href: `${base}/${i.slug}` });
  }
  return order.map((c) => ({ title: c, items: by[c] }));
}

export const nav: NavSection[] = [
  { title: "Getting Started", groups: [{ items: gettingStarted }] },
  { title: "Foundations", groups: [{ items: foundations.map((f) => ({ title: f.title, href: `/docs/foundations/${f.slug}` })) }] },
  { title: "Components", href: "/docs/components", groups: grouped(components, "/docs/components") },
  { title: "Patterns", href: "/docs/patterns", groups: grouped(patterns, "/docs/patterns") },
  { title: "Page Library", href: "/docs/page-library", groups: [] },
  { title: "Demos", groups: [{ items: [
    { title: "Sample website", href: "/site" },
    { title: "Dashboard demo", href: "/demo" },
    { title: "Customer portal", href: "/demo/portal" },
    { title: "All web sections", href: "/site/sections" },
  ] }] },
  { title: "Web Library", href: "/docs/web", groups: grouped(web, "/docs/web") },
  { title: "Blocks", href: "/docs/blocks", groups: grouped(blocks, "/docs/blocks") },
];

export const flatNav: NavLink[] = nav.filter((s) => s.title !== "Demos").flatMap((s) => [
  ...(s.href ? [{ title: s.title, href: s.href }] : []),
  ...s.groups.flatMap((g) => g.items),
]);

export function pager(href: string) {
  const i = flatNav.findIndex((l) => l.href === href);
  return { prev: i > 0 ? flatNav[i - 1] : undefined, next: i >= 0 && i < flatNav.length - 1 ? flatNav[i + 1] : undefined };
}

export function groupBy(items: CatalogItem[]) {
  const map = new Map<string, CatalogItem[]>();
  for (const i of items) map.set(i.category, [...(map.get(i.category) ?? []), i]);
  return [...map.entries()];
}
