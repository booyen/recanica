import {
  ArrowRightIcon, BellIcon, BoxIcon, CheckIcon, ChevronDownIcon, CopyIcon, CreditCardIcon, DollarSignIcon,
  LayoutGridIcon, LinkIcon, MoreHorizontalIcon, PlusIcon, SearchIcon, SettingsIcon, SlidersHorizontalIcon,
  TrendingUpIcon, UsersIcon, XIcon,
} from "lucide-react";
import { DocsPageHeader, H2, InlineCode, P } from "@/components/docs/page-header";
import { Frame, TokenTable } from "@/components/docs/frame";
import { Pager } from "@/components/docs/pager";

export const metadata = { title: "Iconography" };

const icons = { LayoutGridIcon, BoxIcon, UsersIcon, TrendingUpIcon, DollarSignIcon, SettingsIcon, SlidersHorizontalIcon, BellIcon, SearchIcon, PlusIcon, CopyIcon, LinkIcon, CreditCardIcon, CheckIcon, XIcon, ChevronDownIcon, ArrowRightIcon, MoreHorizontalIcon };

export default function Page() {
  return (
    <>
      <DocsPageHeader title="Iconography" description="Lucide icons at 2px stroke. Icons support labels; they rarely replace them." />
      <H2 id="sizes">Sizes</H2>
      <div className="mt-2 grid gap-4 sm:grid-cols-3">
        {[["size-3.5", "14px", "Inline with xs text, “View all →”"], ["size-4", "16px", "Default: buttons, nav, menus"], ["size-5", "20px", "Feature tiles, empty states"]].map(([c, px, u]) => (
          <Frame key={c} className="space-y-3 p-5">
            <BoxIcon className={c} />
            <p className="font-mono text-xs">{c} · {px}</p>
            <p className="text-xs text-muted-foreground">{u}</p>
          </Frame>
        ))}
      </div>
      <H2 id="set">Core set</H2>
      <P>The icons used across the dashboard. Prefer these before reaching for new ones.</P>
      <Frame className="mt-6 grid grid-cols-3 gap-px bg-border sm:grid-cols-6">
        {Object.entries(icons).map(([name, Icon]) => (
          <div key={name} className="flex flex-col items-center gap-2 bg-panel p-4">
            <Icon className="size-5" />
            <span className="truncate font-mono text-[10px] text-muted-foreground">{name.replace("Icon", "")}</span>
          </div>
        ))}
      </Frame>
      <H2 id="rules">Rules</H2>
      <TokenTable
        head={["Rule", "Detail"]}
        rows={[
          ["Color", "Inherit currentColor. Use text-muted-foreground for decorative icons."],
          ["Icon-only buttons", <>Always add <InlineCode>aria-label</InlineCode>; add a Tooltip on desktop.</>],
          ["Spacing", "Buttons handle icon gap (gap-2). Don't add margins to icons."],
          ["Source", "lucide-react. One family only; no filled or duotone mixes."],
        ]}
      />
      <Pager href="/docs/foundations/iconography" />
    </>
  );
}
