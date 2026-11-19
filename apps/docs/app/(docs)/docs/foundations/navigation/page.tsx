import Link from "next/link";
import { DocsPageHeader, H2, P, InlineCode } from "@/components/docs/page-header";
import { DoDont, TokenTable } from "@/components/docs/frame";
import { Pager } from "@/components/docs/pager";

export const metadata = { title: "Navigation" };

export default function Page() {
  return (
    <>
      <DocsPageHeader
        eyebrow="Foundations"
        title="Navigation"
        description="Which navigation to use, and exactly how each one behaves as space shrinks. Labels never wrap; navigation changes form instead."
      />

      <H2 id="choose">Choose a pattern</H2>
      <TokenTable
        head={["Pattern", "Use when", "Reference"]}
        rows={[
          ["Side nav", "Apps with 6+ sections, sub-pages, or a workspace switcher. The default for dashboards.", <Link key="s" className="underline underline-offset-4" href="/docs/patterns/app-sidebar">App Sidebar</Link>],
          ["Top nav", "Apps with 3–7 flat sections and wide content (tables, boards, editors).", <Link key="t" className="underline underline-offset-4" href="/docs/patterns/app-topnav">App Top Nav</Link>],
          ["Site header", "Marketing sites. Logo, up to 5 links, one CTA.", <Link key="h" className="underline underline-offset-4" href="/docs/web/navbar-01">Navbar</Link>],
          ["Mega menu", "Sites or docs with many destinations grouped into 2–4 menus.", <Link key="m" className="underline underline-offset-4" href="/docs/components/navigation-menu">Navigation Menu</Link>],
          ["Bottom nav", "Mobile-first apps with 3–5 primary destinations.", <Link key="b" className="underline underline-offset-4" href="/docs/web/bottom-nav-01">Bottom Nav</Link>],
        ]}
      />

      <H2 id="side-nav">Side nav</H2>
      <P>The sidebar is <InlineCode>w-sidebar</InlineCode> (248px). Content sits in an inset rounded panel that stays put while its contents scroll.</P>
      <TokenTable
        head={["Width", "Behaviour"]}
        rows={[
          ["≥ 768px (md)", "Sidebar visible. A hide button in its header collapses it to zero width; ⌘B / Ctrl+B toggles it. The choice is saved per browser."],
          ["≥ 768px, hidden", "A slim bar appears above the panel with a show-sidebar button and the current page title. Content uses the full width."],
          ["< 768px", "Sidebar becomes a left sheet opened from a menu button. Tapping a link closes it. ⌘B opens the sheet."],
        ]}
      />

      <H2 id="top-nav">Top nav</H2>
      <P>
        Uses priority+: items stay on one line in their order; whatever does not fit moves into a <InlineCode>More</InlineCode> menu.
        The bar measures its own width, so it works inside narrow containers, split panes and previews, not just at fixed breakpoints.
      </P>
      <TokenTable
        head={["Width", "Behaviour"]}
        rows={[
          ["Wide", "All items in one row. Active item is a filled pill."],
          ["Narrower", "Trailing items move into More. If the active item is in More, the More button shows its name."],
          ["< 768px", "Items move into a left sheet behind a menu button; the bar shows the current page title."],
        ]}
      />

      <H2 id="site-header">Site header and mega menu</H2>
      <TokenTable
        head={["Width", "Behaviour"]}
        rows={[
          ["≥ 1024px (lg)", "Links and mega menu triggers inline. Menus open on hover or click, close on Esc."],
          ["768–1023px", "Keep the logo, primary CTA and a menu button; links move into the sheet."],
          ["< 768px", "Logo + menu button. The sheet lists every link, grouped like the mega menu."],
        ]}
      />

      <H2 id="rules">Rules</H2>
      <DoDont
        do={[
          "Keep labels to one or two words, and on one line (whitespace-nowrap).",
          "Change the form of navigation (More menu, sheet) before anything wraps.",
          "Show where the user is: filled pill or accent background on the active item.",
          "Give icon-only buttons an aria-label and a tooltip with the shortcut.",
        ]}
        dont={[
          "Let nav labels wrap onto two lines or shrink below 13px.",
          "Scroll a nav bar horizontally on desktop.",
          "Hide the only way back to a section without a visible button to restore it.",
          "Mix a top nav and a side nav for the same level of hierarchy.",
        ]}
      />
      <Pager href="/docs/foundations/navigation" />
    </>
  );
}
