import Link from "next/link";
import { ArrowUpRightIcon, BlocksIcon, BookOpenIcon, BoxIcon, GlobeIcon, LayoutDashboardIcon, LayoutTemplateIcon, LayersIcon, PaletteIcon, SparklesIcon, StoreIcon, UsersIcon } from "lucide-react";
import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle,
} from "@recanica/ui/components/navigation-menu";
import catalog from "@/lib/catalog.json";
import { RecanicaLogo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { SearchCommand } from "./search-command";
import { ThemeToggle } from "./theme-toggle";
import { Surface } from "@recanica/ui/components/surface";
import { TopBar } from "@recanica/ui/components/layout";

type Item = { href: string; title: string; body: string; icon: typeof BoxIcon };
const menus: { label: string; items: Item[]; aside?: { title: string; body: string; href: string } }[] = [
  {
    label: "Docs",
    items: [
      { href: "/docs", title: "Introduction", body: "Principles and how the library is layered.", icon: BookOpenIcon },
      { href: "/docs/installation", title: "Installation", body: "Next.js, Vite, Tailwind v3, HTML, Flutter, SwiftUI.", icon: LayersIcon },
      { href: "/docs/foundations/colors", title: "Foundations", body: "Color, type, spacing, surfaces, navigation.", icon: PaletteIcon },
      { href: "/docs/ai", title: "Use with AI", body: "Prompts, llms.txt and the MCP guide.", icon: SparklesIcon },
    ],
  },
  {
    label: "Library",
    items: [
      { href: "/docs/components", title: "Components", body: `${catalog.components.length} accessible primitives.`, icon: BoxIcon },
      { href: "/docs/patterns", title: "Patterns", body: `${catalog.patterns.length} composed app patterns.`, icon: BlocksIcon },
      { href: "/docs/web", title: "Web Library", body: `${catalog.web.length} website sections, ${new Set(catalog.web.map((w) => w.category)).size} categories.`, icon: GlobeIcon },
      { href: "/docs/page-library", title: "Page Library", body: `${catalog.appLibrary.length} dashboard page types, ${catalog.webRecipes.length} website recipes.`, icon: LayoutTemplateIcon },
    ],
    aside: { title: "Not sure where to start?", body: "Find the page you're building in the Page Library, then follow its links.", href: "/docs/page-library" },
  },
  {
    label: "Demos",
    items: [
      { href: "/site", title: "Sample website", body: "22 pages built only from web sections.", icon: StoreIcon },
      { href: "/demo", title: "Dashboard demo", body: "A working seller app with dummy data.", icon: LayoutDashboardIcon },
      { href: "/demo/portal", title: "Customer portal", body: "What your customers see.", icon: UsersIcon },
      { href: "/site/sections", title: "All web sections", body: "Every section, live, on one page.", icon: GlobeIcon },
    ],
  },
];

export function SiteHeader() {
  return (
    <TopBar>
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-2 px-gutter">
        <MobileNav />
        <Link href="/" className="mr-4 flex items-center" aria-label="Recanica home"><RecanicaLogo /></Link>
        <NavigationMenu className="hidden lg:flex" viewport={false}>
          <NavigationMenuList>
            {menus.map((m) => (
              <NavigationMenuItem key={m.label}>
                <NavigationMenuTrigger>{m.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[min(42rem,80vw)] gap-2 p-2 md:grid-cols-[1fr_13rem]">
                    <ul className="grid gap-1 sm:grid-cols-2">
                      {m.items.map((i) => (
                        <li key={i.href}>
                          <NavigationMenuLink asChild>
                            <Link href={i.href} className="flex-row items-start gap-3">
                              <i.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                              <span className="min-w-0"><span className="block text-sm">{i.title}</span><span className="block text-xs text-muted-foreground">{i.body}</span></span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                    <Surface size="sm" tone="muted" inset="sm" className="hidden text-sm md:block">
                      {m.aside ? (
                        <>
                          <p>{m.aside.title}</p>
                          <p className="mt-1 text-muted-foreground">{m.aside.body}</p>
                          <Link href={m.aside.href} className="mt-3 inline-flex items-center gap-1 underline underline-offset-4">Open <ArrowUpRightIcon className="size-3.5" /></Link>
                        </>
                      ) : (
                        <>
                          <p>{m.label === "Demos" ? "Everything is clickable" : "New here?"}</p>
                          <p className="mt-1 text-muted-foreground">{m.label === "Demos" ? "Demos use fake data stored in your browser. Reset anytime." : "Start with Installation, then pick a pattern."}</p>
                        </>
                      )}
                    </Surface>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}><Link href="/docs/ai">AI</Link></NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center gap-1">
          <SearchCommand />
          <ThemeToggle />
        </div>
      </div>
    </TopBar>
  );
}
