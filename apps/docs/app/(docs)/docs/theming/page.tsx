import { CodeBlock } from "@/components/docs/code-block";
import { DocsPageHeader, H2, InlineCode, P } from "@/components/docs/page-header";
import { TokenTable } from "@/components/docs/frame";
import { Pager } from "@/components/docs/pager";

export const metadata = { title: "Theming" };

export default function Page() {
  return (
    <>
      <DocsPageHeader eyebrow="Getting started" title="Theming" description="Three token tiers, and two color schemes, all in one CSS file." />
      <H2 id="tiers">Token tiers</H2>
      <TokenTable
        head={["Tier", "Example", "Who uses it"]}
        rows={[
          ["1 · Primitives", "--rc-gray-500, --rc-silver-200", "Only tier 2"],
          ["2 · Semantic", "--background, --panel, --muted-foreground", "Components, via tier 3"],
          ["3 · Tailwind", "bg-panel, text-muted-foreground, p-panel", "Everyone"],
        ]}
      />
      <H2 id="dark-mode">Dark mode</H2>
      <P>Semantic tokens are redefined under <InlineCode>.dark</InlineCode>. next-themes toggles the class on <InlineCode>&lt;html&gt;</InlineCode>. Dark is the default.</P>
      <H2 id="overrides">Overriding tokens</H2>
      <P>Remap semantic tokens for a product or a white-label client. Components pick it up with no code changes.</P>
      <div className="mt-4">
        <CodeBlock title="app/globals.css" lang="css" code={`/* A warmer panel and a tighter radius for one app */
:root {
  --radius: 0.5rem;
}
.dark {
  --panel: oklch(0.17 0.004 60);
}

/* Scope a theme to a subtree */
.theme-contrast {
  --border: var(--rc-gray-700);
  --muted-foreground: var(--rc-gray-300);
}`} />
      </div>
      <Pager href="/docs/theming" />
    </>
  );
}
