import { DocsPageHeader, H2, P } from "@/components/docs/page-header";
import { DoDont, TokenTable } from "@/components/docs/frame";
import { Pager } from "@/components/docs/pager";

export const metadata = { title: "Colors" };

const semantic: [string, string][] = [
  ["background", "Page and sidebar"], ["panel", "Inset content panel"], ["card", "Cards, stat groups"],
  ["popover", "Menus, popovers"], ["muted", "Quiet fills, tracks"], ["accent", "Hover, active nav"],
  ["border", "Hairlines"], ["input", "Field borders"], ["foreground", "Primary text"],
  ["muted-foreground", "Secondary text"], ["primary", "Primary action"], ["brand", "Brand: black / silver"],
];
const status: [string, string][] = [["success", "Paid, active, positive delta"], ["warning", "Pending, attention"], ["destructive", "Failed, danger, delete"]];
const grays = ["0", "50", "100", "200", "300", "400", "500", "600", "700", "800", "850", "900", "950", "1000"];
const silvers = ["50", "100", "200", "300", "400", "500"];

function Swatch({ token, use }: { token: string; use: string }) {
  return (
    <div className="space-y-2">
      <div className="h-16 rounded-xl border" style={{ background: `var(--${token})` }} />
      <div><p className="font-mono text-xs">{token}</p><p className="text-xs text-muted-foreground">{use}</p></div>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <DocsPageHeader eyebrow="Foundations" title="Colors" description="Black, white and gray. Color is reserved for status; everything else is hierarchy through value." />
      <H2 id="semantic">Semantic tokens</H2>
      <P>Components only use these. They swap automatically between light and dark. Toggle the theme to compare.</P>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {semantic.map(([t, u]) => <Swatch key={t} token={t} use={u} />)}
      </div>
      <H2 id="status">Status</H2>
      <P>Muted on purpose. Use them only to communicate state, usually as a 12–15% tint (bg-success/12 text-success).</P>
      <div className="mt-6 grid grid-cols-3 gap-4">{status.map(([t, u]) => <Swatch key={t} token={t} use={u} />)}</div>
      <H2 id="primitives">Primitive scales</H2>
      <P>Raw values. Never reference them from components; remap the semantic tier instead.</P>
      <div className="mt-6 space-y-4">
        <div className="flex overflow-hidden rounded-xl border">
          {grays.map((g) => <div key={g} data-audit-ignore className="h-14 flex-1" style={{ background: `var(--rc-gray-${g})` }} title={`--rc-gray-${g}`} />)}
        </div>
        <div className="flex justify-between font-mono text-[10px] text-muted-foreground">{grays.map((g) => <span key={g}>{g}</span>)}</div>
        <div className="flex overflow-hidden rounded-xl border">
          {silvers.map((g) => <div key={g} data-audit-ignore className="h-14 flex-1" style={{ background: `var(--rc-silver-${g})` }} title={`--rc-silver-${g}`} />)}
        </div>
        <p className="text-xs text-muted-foreground">Silver: a whisper of cool tint so metal reads as metal.</p>
      </div>
      <H2 id="charts">Chart ramp</H2>
      <P>Five monochrome steps. Order series from most to least important.</P>
      <div className="mt-6 flex h-12 overflow-hidden rounded-xl border">
        {[1, 2, 3, 4, 5].map((n) => <div key={n} className="flex flex-1 items-end p-2 font-mono text-[10px] mix-blend-difference text-white" style={{ background: `var(--chart-${n})` }}>chart-{n}</div>)}
      </div>
      <H2 id="usage">Usage</H2>
      <TokenTable
        head={["Utility", "Use for"]}
        rows={[
          ["text-foreground", "Titles, values, primary labels"],
          ["text-muted-foreground", "Descriptions, secondary text in rows (“Order paid · Nadia”)"],
          ["bg-panel / bg-card", "Content surfaces sitting on the page"],
          ["bg-accent", "Hover and selected rows, active nav item"],
          ["border", "Every divider. One weight, everywhere"],
        ]}
      />
      <div className="mt-6">
        <DoDont
          do={["Create hierarchy with value: foreground vs muted-foreground.", "Use status colors as tints inside badges.", "Let one brand surface carry emphasis."]}
          dont={["Introduce new hues for decoration.", "Use status colors for large surfaces.", "Reference --rc-* primitives in components."]}
        />
      </div>
      <Pager href="/docs/foundations/colors" />
    </>
  );
}
