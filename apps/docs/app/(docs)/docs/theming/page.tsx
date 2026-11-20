import { CodeBlock } from "@/components/docs/code-block";
import { DocsPageHeader, H2, InlineCode, P } from "@/components/docs/page-header";
import { TokenTable } from "@/components/docs/frame";
import { Pager } from "@/components/docs/pager";

export const metadata = { title: "Theming" };

export default function Page() {
  return (
    <>
      <DocsPageHeader title="Theming" description="Three token tiers, and two color schemes, all in one CSS file." />
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
      <H2 id="brand">Your brand colour</H2>
      <P>
        Recanica is monochrome by default, but that&apos;s a theme, not a rule. What every project keeps is calm: a neutral base and one brand
        colour, used for the primary action, focus and at most one highlight per screen. Set it once; buttons, links, focus rings and the
        Loader pick it up. Keep status colours for status only, and don&apos;t add other hues.
      </P>
      <div className="mt-4">
        <CodeBlock title="app/globals.css" lang="css" code={`:root {
  --brand: oklch(0.55 0.15 255);          /* your brand blue */
  --brand-foreground: oklch(0.98 0 0);    /* text on the brand colour: check 4.5:1 contrast */
}
.dark {
  --brand: oklch(0.72 0.13 255);
  --brand-foreground: oklch(0.15 0 0);
}`} />
      </div>
      <H2 id="fonts">Your fonts</H2>
      <P>
        Geist is the default, not a requirement. Pick a calm, readable sans with light and regular weights and tabular numerals,
        load it however your stack loads fonts, and point the tokens at it. Every component follows.
      </P>
      <div className="mt-4">
        <CodeBlock title="app/globals.css" lang="css" code={`:root {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}`} />
      </div>
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
