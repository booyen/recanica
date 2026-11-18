import { ArrowRightIcon } from "lucide-react";
import { Badge } from "@rekanica/ui/components/badge";
import { Button } from "@rekanica/ui/components/button";
import { CodeBlock } from "@/components/docs/code-block";
import { DocsPageHeader, H2, InlineCode, P } from "@/components/docs/page-header";
import { TokenTable } from "@/components/docs/frame";
import { Pager } from "@/components/docs/pager";

export const metadata = { title: "Brand Finish" };

const finishes = [
  { value: "flat", label: "Flat", body: "Solid brand. Default. Calm, works everywhere." },
  { value: "mesh", label: "Mesh", body: "Soft silver mesh, like liquid metal. For hero moments." },
  { value: "chrome", label: "Chrome", body: "Linear brushed chrome. Sharper, more graphic." },
];

export default function Page() {
  return (
    <>
      <DocsPageHeader
        eyebrow="Foundations"
        title="Brand Finish"
        description="One switch changes every brand surface between flat, mesh and chrome. Components don't change; only the finish does."
      />
      <H2 id="compare">Compare</H2>
      <P>Each column below sets its own finish. Use the ✦ menu in the header to switch the whole site.</P>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {finishes.map((f) => (
          <div key={f.value} data-finish={f.value} className="space-y-5 rounded-2xl border bg-panel p-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2"><span className="size-6 rounded-md bg-metallic" /> {f.label}</span>
              <Badge variant="brand">Brand</Badge>
            </div>
            <p className="text-metric font-light text-metallic">$48,210</p>
            <div className="h-24 rounded-xl bg-metallic" />
            <div className="border-metallic rounded-xl p-4 text-sm text-muted-foreground [--metallic-fill:var(--panel)]">border-metallic</div>
            <Button variant="brand" className="w-full">Get started <ArrowRightIcon /></Button>
            <p className="text-sm text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </div>
      <H2 id="usage">Usage</H2>
      <P>Set the finish once on <InlineCode>&lt;html&gt;</InlineCode>, or on any subtree to scope it.</P>
      <div className="mt-4 space-y-4">
        <CodeBlock code={`<html data-finish="mesh">  {/* flat | mesh | chrome */}`} />
        <CodeBlock code={`<Button variant="brand">Get started</Button>
<span className="size-6 rounded-md bg-metallic" />        {/* logo mark */}
<p className="text-metric text-metallic">$48,210</p>      {/* hero number */}
<Card className="border-metallic">…</Card>               {/* featured card */}`} />
      </div>
      <H2 id="utilities">Utilities</H2>
      <TokenTable
        head={["Utility", "What it does"]}
        rows={[
          ["bg-metallic", "Brand surface + matching foreground. Used by Button brand and Badge brand."],
          ["text-metallic", "Brand-filled text. Use on one headline or number per view."],
          ["border-metallic", "1px brand edge. Set --metallic-fill to the element's background."],
        ]}
      />
      <H2 id="guidance">Guidance</H2>
      <ul className="mt-2 max-w-copy list-disc space-y-2 pl-5 text-muted-foreground">
        <li>One brand moment per screen: the primary CTA, the logo, or a hero number. Not all three.</li>
        <li>Mesh and chrome shine on landing pages; dashboards usually stay flat.</li>
        <li>Never put metallic text below 24px; gradients need room to read.</li>
      </ul>
      <Pager href="/docs/foundations/finish" />
    </>
  );
}
