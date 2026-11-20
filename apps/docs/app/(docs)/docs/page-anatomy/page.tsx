import Link from "next/link";
import { ReferenceTable, Section } from "@recanica/ui/components/page";
import { DocsPageHeader, P } from "@/components/docs/page-header";
import { Pager } from "@/components/docs/pager";
import anatomy from "../../../../../../docs/ai/anatomy.json";
import partsFile from "../../../../../../packages/ui/parts.json";

export const metadata = { title: "Page anatomy" };

// Rendered from docs/ai/anatomy.json and packages/ui/parts.json: the same files the page skill and AI tools read.
export default function Page() {
  return (
    <>
      <DocsPageHeader
        title="Page anatomy"
        description="How a Recanica page is built: pick the page type, fill its regions in order with the listed parts. Nothing on a page is hand-built."
      />
      <Section id="thinking" title="The thinking, in order">
        <ol className="list-decimal space-y-1.5 pl-5">
          {anatomy.thinking.map((t) => <li key={t}>{t.replace(/^\d+\.\s*/, "")}</li>)}
        </ol>
      </Section>
      {anatomy.types.map((t) => (
        <Section key={t.type} id={t.type.toLowerCase().replace(/[^a-z0-9]+/g, "-")} title={t.type} description={t.use}>
          <p className="text-sm text-muted-foreground">
            Shell: <code className="font-mono text-foreground">{t.shell}</code> · Example: <Link className="underline underline-offset-4" href={t.example}>{t.example}</Link>
          </p>
          <ReferenceTable head={["Region", "Part", "Note"]} rows={t.regions.map((r) => [r.region, r.part, r.note || "—"])} />
        </Section>
      ))}
      <Section id="parts" title="Parts in both forms" description="React projects use the component; other stacks use the rc-* class. A check fails CI if either is missing.">
        <ReferenceTable head={["Part", "React", "CSS class"]} rows={partsFile.parts.map((p) => [p.part, p.react, p.css])} />
      </Section>
      <P>
        A page needs a region that isn&apos;t listed? Write its brief (recanica-page skill), and if a new part is needed, add it in both forms
        and to <code>packages/ui/parts.json</code> before building the page.
      </P>
      <Pager href="/docs/page-anatomy" />
    </>
  );
}
