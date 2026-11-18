import { DocsPageHeader, H2, P } from "@/components/docs/page-header";
import { Frame, TokenTable } from "@/components/docs/frame";
import { Pager } from "@/components/docs/pager";

export const metadata = { title: "Surfaces & Radius" };

const radii = [["sm", "rounded-sm", "8px"], ["md", "rounded-md", "10px"], ["lg", "rounded-lg", "12px"], ["xl", "rounded-xl", "16px"], ["2xl", "rounded-2xl", "20px"], ["full", "rounded-full", "pill"]];

export default function Page() {
  return (
    <>
      <DocsPageHeader eyebrow="Foundations" title="Surfaces & Radius" description="Depth comes from stacked surfaces and hairline borders, not shadows." />
      <H2 id="layers">Layers</H2>
      <P>Each layer is one step lighter in dark mode (one step whiter in light). Never skip a layer.</P>
      <div className="mt-6 rounded-2xl border bg-background p-3">
        <p className="px-2 pb-2 font-mono text-xs text-muted-foreground">background</p>
        <div className="rounded-2xl border bg-panel p-4">
          <p className="pb-3 font-mono text-xs text-muted-foreground">panel</p>
          <div className="rounded-2xl border bg-card p-4">
            <p className="pb-3 font-mono text-xs text-muted-foreground">card</p>
            <div className="rounded-xl bg-accent px-4 py-3 font-mono text-xs">accent · hover / active</div>
          </div>
        </div>
      </div>
      <H2 id="radius">Radius</H2>
      <P>Base radius is 12px. Controls are pills; containers get rounder as they get bigger.</P>
      <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-6">
        {radii.map(([n, cls, v]) => (
          <div key={n} className="space-y-2 text-center">
            <div className={`aspect-square border bg-muted ${cls}`} />
            <p className="font-mono text-xs">{n}</p>
            <p className="text-xs text-muted-foreground">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <TokenTable
          head={["Element", "Radius"]}
          rows={[["Buttons, tabs, badges, avatars", "rounded-full"], ["Inputs, menu items, nav items", "rounded-lg / rounded-xl"], ["Cards, panels, dialogs, stat groups", "rounded-2xl"], ["CTA panels, hero frames", "rounded-3xl"]]}
        />
      </div>
      <H2 id="elevation">Elevation</H2>
      <P>Shadows are only for things floating above the page: popovers, dialogs, toasts.</P>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Frame className="p-5 text-sm">none<p className="text-xs text-muted-foreground">Cards, panels. Border only.</p></Frame>
        <div className="rounded-2xl border bg-popover p-5 text-sm shadow-soft">shadow-soft<p className="text-xs text-muted-foreground">Menus, popovers</p></div>
        <div className="rounded-2xl border bg-popover p-5 text-sm shadow-float">shadow-float<p className="text-xs text-muted-foreground">Dialogs, featured cards</p></div>
      </div>
      <Pager href="/docs/foundations/surfaces" />
    </>
  );
}
