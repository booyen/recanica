import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { DocsPageHeader, H2, P } from "@/components/docs/page-header";
import { Pager } from "@/components/docs/pager";
import { blocks, components, patterns } from "@/lib/docs";
import { SurfaceGrid } from "@recanica/ui/components/surface";
import { ListRow } from "@recanica/ui/components/layout";

export const metadata = { title: "Introduction" };

const principles = [
  ["Calm", "Neutral base, one brand colour, hierarchy through value. Monochrome by default."],
  ["Layered", "Depth from stacked surfaces and hairlines, not shadows."],
  ["Light type", "Regular and light weights. Big numbers, small labels."],
  ["One brand moment", "One solid brand surface per screen carries emphasis."],
];

const layers = [
  ["Templates", "Full pages and apps", "/docs/blocks/dashboard-shell-01"],
  ["Blocks", `${blocks.length} landing and app-shell sections`, "/docs/blocks"],
  ["Patterns", `${patterns.length} composed app UI patterns`, "/docs/patterns"],
  ["Components", `${components.length} accessible primitives`, "/docs/components"],
  ["Foundations", "Color, type, spacing, surfaces, navigation", "/docs/foundations/colors"],
];

export default function Page() {
  return (
    <>
      <DocsPageHeader
        title="Recanica"
        description="A comprehensive UI framework by Aturanica Labs for dashboards, landing pages and everything between. Built on Radix and Tailwind, inspired by Polar's calm product UI, and written to be read by LLMs."
      />
      <H2 id="principles">Principles</H2>
      <SurfaceGrid className="sm:grid-cols-2">
        {principles.map(([t, b]) => (
          <div key={t} className="bg-panel p-panel">
            <p>{t}</p>
            <p className="mt-1 text-sm text-muted-foreground">{b}</p>
          </div>
        ))}
      </SurfaceGrid>
      <H2 id="layers">How it's layered</H2>
      <P>Each layer only uses the layers below it. Tokens and components ship as a package; patterns and blocks are copied in from the registry so they can be edited per app.</P>
      <div className="mt-6 divide-y overflow-hidden rounded-2xl border">
        {layers.map(([t, b, href], i) => (
          <ListRow as={Link} className="bg-panel" key={t} href={href}>
            <span className="font-mono text-xs text-muted-foreground">{layers.length - i}</span>
            <span className="flex-1">{t}<span className="block text-sm text-muted-foreground">{b}</span></span>
            <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </ListRow>
        ))}
      </div>
      <Pager href="/docs" />
    </>
  );
}
