import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Page, PageHeader, Section } from "@recanica/ui/components/page";
import { Surface } from "@recanica/ui/components/surface";
import { ListRow } from "@recanica/ui/components/layout";
import { SiteHeader } from "@/components/docs/site-header";
import { SiteFooter } from "@/components/docs/site-footer";
import { components } from "@/lib/docs";

// Brief: docs/pages/index.md. One line on what Recanica is, then three equal entries.
const entries = [
  { title: "Design system", body: "Principles, foundations and the rules every page follows.", href: "/docs" },
  { title: "Components", body: `${components.length} accessible parts for React, with rc-* classes for any other stack.`, href: "/docs/components" },
  { title: "MCP guide", body: "Connect your AI coding tool to the rules, tokens and components.", href: "/docs/mcp" },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="px-gutter py-section">
        <Page width="reading" className="mx-auto">
          <PageHeader
            title="Recanica"
            description="A calm, monochrome design system by Aturanica Labs for dashboards and websites."
          />
          <Section id="start" title="Start here">
            <Surface as="ul" inset="none" className="divide-y overflow-hidden">
              {entries.map((e) => (
                <li key={e.href}>
                  <ListRow as={Link} href={e.href}>
                    <span className="min-w-0 flex-1">{e.title}<span className="block text-sm text-muted-foreground">{e.body}</span></span>
                    <ArrowRightIcon aria-hidden className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </ListRow>
                </li>
              ))}
            </Surface>
          </Section>
        </Page>
      </main>
      <SiteFooter />
    </>
  );
}
