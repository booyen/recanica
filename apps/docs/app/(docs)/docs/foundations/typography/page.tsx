import { DocsPageHeader, H2, P } from "@/components/docs/page-header";
import { DoDont, Frame } from "@/components/docs/frame";
import { Pager } from "@/components/docs/pager";

export const metadata = { title: "Typography" };

const product = [
  ["text-metric font-light", "$48,210", "metric · 40 / light", "Big numbers in stat panels"],
  ["text-title", "Overview", "title · 30", "Page title"],
  ["text-heading", "Metrics", "heading · 24", "Section title"],
  ["text-base", "Body copy for descriptions and paragraphs.", "base · 16", "Body"],
  ["text-sm", "Nav, rows, labels, buttons, inputs.", "sm · 14", "Default UI text"],
  ["text-xs text-muted-foreground", "Captions, badges, timestamps.", "xs · 12", "Meta"],
];
const marketing = [
  ["text-display-lg", "Sell software", "display-lg · 64"],
  ["text-display-md", "Sell software", "display-md · 48"],
  ["text-display-sm", "Sell software", "display-sm · 36"],
];

export default function Page() {
  return (
    <>
      <DocsPageHeader eyebrow="Foundations" title="Typography" description="Geist Sans and Geist Mono. Light and regular weights, generous size contrast, never bold." />
      <H2 id="product">Product scale</H2>
      <P>For dashboards and app surfaces.</P>
      <Frame className="mt-6 divide-y">
        {product.map(([cls, sample, meta, use]) => (
          <div key={meta} className="grid gap-1 p-5 sm:grid-cols-[minmax(0,1fr)_12rem] sm:items-baseline sm:gap-6">
            <span className={`${cls} truncate`}>{sample}</span>
            <span className="text-xs text-muted-foreground"><span className="font-mono">{meta}</span><span className="block">{use}</span></span>
          </div>
        ))}
      </Frame>
      <H2 id="marketing">Landing scale</H2>
      <P>Display sizes step down on small screens: lg → md → sm.</P>
      <Frame className="mt-6 divide-y">
        {marketing.map(([cls, sample, meta]) => (
          <div key={meta} className="flex flex-col gap-1 overflow-hidden p-5 sm:flex-row sm:items-baseline sm:justify-between">
            <span className={`${cls} truncate tracking-tight`}>{sample}</span>
            <span className="shrink-0 font-mono text-xs text-muted-foreground">{meta}</span>
          </div>
        ))}
      </Frame>
      <H2 id="weights">Weights</H2>
      <div className="mt-2 grid gap-4 sm:grid-cols-3">
        {[["font-light", "300 · Light", "Metrics, display numbers"], ["font-normal", "400 · Regular", "Titles, body, almost everything"], ["font-medium", "500 · Medium", "Buttons, the occasional emphasis"]].map(([c, l, u]) => (
          <Frame key={c} className="p-5">
            <p className={`text-3xl ${c}`}>Aa</p>
            <p className="mt-3 text-sm">{l}</p>
            <p className="text-xs text-muted-foreground">{u}</p>
          </Frame>
        ))}
      </div>
      <H2 id="numbers">Numbers</H2>
      <P>Use tabular-nums anywhere numbers line up: tables, stat rows, prices, timers.</P>
      <Frame className="mt-6 grid grid-cols-2 gap-6 p-5 font-light text-2xl">
        <div><p className="text-xs text-muted-foreground">proportional</p><p>$1,111.11<br />$8,888.88</p></div>
        <div className="tabular-nums"><p className="text-xs text-muted-foreground">tabular-nums</p><p>$1,111.11<br />$8,888.88</p></div>
      </Frame>
      <div className="mt-8">
        <DoDont
          do={["Pair a light metric with a small muted caption: “$48 November”.", "Use sentence case everywhere.", "Keep line length under ~70ch (max-w-copy)."]}
          dont={[/* recanica-ignore: rule example */ "Use font-semibold or font-bold.", "Use ALL CAPS labels.", "Mix more than three sizes in one card."]}
        />
      </div>
      <Pager href="/docs/foundations/typography" />
    </>
  );
}
