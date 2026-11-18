import { DocsPageHeader, H2, InlineCode, P } from "@/components/docs/page-header";
import { Frame, TokenTable } from "@/components/docs/frame";
import { Pager } from "@/components/docs/pager";

export const metadata = { title: "Spacing & Layout" };

const scale = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];

export default function Page() {
  return (
    <>
      <DocsPageHeader eyebrow="Foundations" title="Spacing & Layout" description="A 4px grid inside components, semantic tokens between them, and mobile-first breakpoints." />
      <H2 id="scale">Spacing scale</H2>
      <P>Tailwind's default scale: <InlineCode>p-1</InlineCode> = 4px. Inside components use 1–6; between groups use 8–12.</P>
      <Frame className="mt-6 space-y-2 p-5">
        {scale.map((n) => (
          <div key={n} className="flex items-center gap-4">
            <span className="w-8 font-mono text-xs text-muted-foreground">{n}</span>
            <div className="h-3 rounded-sm bg-foreground" style={{ width: `calc(var(--spacing) * ${n})` }} />
            <span className="font-mono text-xs text-muted-foreground">{n * 4}px</span>
          </div>
        ))}
      </Frame>
      <H2 id="layout-tokens">Layout tokens</H2>
      <P>Use these instead of hand-picked numbers so every page shares one rhythm.</P>
      <div className="mt-6">
        <TokenTable
          head={["Utility", "Value", "Use"]}
          rows={[
            ["px-gutter", "clamp(16px, 3vw, 40px)", "Page side padding. Scales with the viewport"],
            ["py-section", "clamp(64px, 10vw, 128px)", "Landing page section rhythm"],
            ["py-section-sm", "clamp(48px, 6vw, 80px)", "Compact sections, docs pages"],
            ["p-panel", "28px", "Card and stat padding"],
            ["gap-stack / space-y-stack", "40px", "Between dashboard blocks"],
            ["w-sidebar", "240px", "App sidebar"],
            ["max-w-content", "1152px", "Main content column"],
            ["max-w-narrow", "768px", "Forms, feeds, settings"],
            ["max-w-copy", "640px", "Long-form text"],
          ]}
        />
      </div>
      <H2 id="breakpoints">Breakpoints</H2>
      <P>Mobile-first. Write the phone layout first, then add <InlineCode>sm:</InlineCode>, <InlineCode>md:</InlineCode>… to enhance.</P>
      <div className="mt-6">
        <TokenTable
          head={["Prefix", "Min width", "What typically changes"]}
          rows={[
            ["(none)", "0", "Single column, full-width buttons, sheet navigation"],
            ["sm:", "640px", "Buttons sit inline, forms go 2-up, header actions return"],
            ["md:", "768px", "App sidebar appears, stat groups go horizontal, list/detail split"],
            ["lg:", "1024px", "Docs sidebar, 3-column grids, settings label column"],
            ["xl:", "1280px", "Docs table of contents, wider dashboards"],
          ]}
        />
      </div>
      <H2 id="responsive-rules">Responsive rules</H2>
      <ul className="mt-2 max-w-copy list-disc space-y-2 pl-5 text-muted-foreground">
        <li>Sidebars become a <a className="underline underline-offset-4" href="/docs/components/sheet">Sheet</a> below md.</li>
        <li>Segmented controls and tab lists scroll horizontally rather than wrap.</li>
        <li>Tables hide secondary columns (<InlineCode>hidden md:table-cell</InlineCode>) before they scroll.</li>
        <li>Primary actions go full width on phones (<InlineCode>w-full sm:w-auto</InlineCode>).</li>
        <li>Touch targets are at least 36px (h-9). Icon buttons use size-9.</li>
      </ul>
      <Pager href="/docs/foundations/spacing" />
    </>
  );
}
