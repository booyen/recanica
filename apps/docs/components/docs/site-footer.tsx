import Link from "next/link";
import { RecanicaLogo } from "./logo";

const columns = [
  { title: "Get started", links: [["Introduction", "/docs"], ["Installation", "/docs/installation"], ["Theming", "/docs/theming"], ["Use with AI", "/docs/ai"]] },
  { title: "Library", links: [["Components", "/docs/components"], ["Patterns", "/docs/patterns"], ["Web library", "/docs/web"], ["Page library", "/docs/page-library"]] },
  { title: "Demos", links: [["Sample website", "/site"], ["Dashboard", "/demo"], ["Customer portal", "/demo/portal"], ["All web sections", "/site/sections"]] },
  { title: "Resources", links: [["GitHub", "https://github.com/booyen/rekanica-des"], ["llms.txt", "/llms.txt"], ["Token CSS", "/recanica.css"]] },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t px-gutter pt-12 pb-8">
      <div className="mx-auto max-w-screen-2xl">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="space-y-3">
            <RecanicaLogo />
            <p className="max-w-xs text-sm text-muted-foreground">Tokens, components, patterns and page templates for dashboards and websites.</p>
          </div>
          {columns.map((c) => (
            <div key={c.title} className="space-y-3 text-sm">
              <p>{c.title}</p>
              <ul className="space-y-2">
                {c.links.map(([label, href]) => (
                  <li key={href}>
                    {href.startsWith("http") ? (
                      <a href={href} target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">{label}</a>
                    ) : (
                      <Link href={href} className="text-muted-foreground transition-colors hover:text-foreground">{label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-12 border-t pt-6 text-xs text-muted-foreground">
          Recanica by Aturanica Labs · © {new Date().getFullYear()} · Kuala Lumpur, Malaysia
        </p>
      </div>
    </footer>
  );
}
