import { DocsPageHeader, H2, InlineCode, P } from "@/components/docs/page-header";
import { Frame, TokenTable } from "@/components/docs/frame";
import { Pager } from "@/components/docs/pager";

export const metadata = { title: "Motion" };

export default function Page() {
  return (
    <>
      <DocsPageHeader title="Motion" description="Quick, soft and functional. Motion explains a change; it never decorates." />
      <H2 id="durations">Durations</H2>
      <TokenTable keys="code"
        head={["Utility", "Duration", "Use"]}
        rows={[
          ["duration-150", "150ms", "Hover, press, color changes"],
          ["duration-200", "200ms", "Popovers, menus, tooltips"],
          ["duration-300", "300ms", "Sheets, dialogs, save bars, viewport changes"],
          ["duration-700", "700ms", "Rare: hero reveals on landing pages"],
        ]}
      />
      <H2 id="easing">Easing</H2>
      <P>One curve for almost everything: <InlineCode>ease-out-soft</InlineCode> (cubic-bezier(0.22, 1, 0.36, 1)). Fast start, gentle settle.</P>
      <Frame className="group mt-6 p-5">
        <p className="mb-4 text-sm text-muted-foreground">Hover this panel.</p>
        <div className="h-2 rounded-full bg-muted">
          <div className="h-2 w-1/6 rounded-full bg-brand text-brand-foreground transition-[width] duration-700 ease-out-soft group-hover:w-full" />
        </div>
      </Frame>
      <H2 id="press">Press feedback</H2>
      <P>Buttons scale to 98% on press via <InlineCode>active:scale-[0.98]</InlineCode> when you want tactile feedback on large CTAs.</P>
      <H2 id="reduced-motion">Reduced motion</H2>
      <P>
        Respect <InlineCode>prefers-reduced-motion</InlineCode>: use <InlineCode>motion-safe:</InlineCode> for anything that moves position,
        and keep opacity/color transitions only.
      </P>
      <Pager href="/docs/foundations/motion" />
    </>
  );
}
