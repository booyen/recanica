import Link from "next/link";
import { DocsPageHeader, H2, P, InlineCode } from "@/components/docs/page-header";
import { TokenTable } from "@/components/docs/frame";
import { Pager } from "@/components/docs/pager";

export const metadata = { title: "Design language" };

/*
 * The chain from what we believe to what CI enforces. Every principle names its rules,
 * where they are built (so a project gets them by using the package), and the check that catches a break.
 */
const chain: { principle: string; why: string; rules: string[]; built: string; checks: string[] }[] = [
  {
    principle: "Calm and monochrome",
    why: "Content and numbers carry the page, not decoration.",
    rules: ["Black, white and gray only; colour only for status (success, warning, destructive)", "Brand colour is flat: bg-brand / text-brand, no gradients", "Depth from layered surfaces and hairline borders, shadows only on floating things"],
    built: "Semantic tokens in @recanica/tokens; every component uses tokens only",
    checks: ["recanica check: hard-coded-color, palette-hue, gradient", "audit: spec-color (rendered colour must be a token), gradient"],
  },
  {
    principle: "Light type, hierarchy by size and value",
    why: "Bold shouts. Size and muted vs foreground text do the work quietly.",
    rules: ["Regular for text, light for big numbers, medium at most", "Sentence case, no ALL CAPS labels", "Big light number + small muted caption"],
    built: "Type scale tokens; Stat, Card, PageHeader set weights",
    checks: ["recanica check: bold-weight, uppercase-label", "audit: spec-weight, spec-font"],
  },
  {
    principle: "Soft, consistent shapes",
    why: "One shape language makes everything feel like one product.",
    rules: ["Controls are pills (buttons, tabs, badges)", "Surfaces rounded-2xl with a hairline border", "Radius only from the scale; button heights 24/32/36/40/44"],
    built: "Button, Badge, Tabs, Card, Table, StatGroup",
    checks: ["recanica check: arbitrary-radius", "audit: spec-button, spec-radius, surface-padding"],
  },
  {
    principle: "Same thing, same look",
    why: "If two buttons of the same kind differ, one of them is a bug.",
    rules: ["Never restyle a component at the call site to fix it: fix the component", "No fixed-width label columns; size to content with a cap and truncate", "Table edge inset is equal on both sides"],
    built: "Variants and sizes in cva; BarRow/StatList subgrid; Table edge inset",
    checks: ["audit: inconsistent (same component, variant, size and state rendered differently)", "audit: table-edges, overlap"],
  },
  {
    principle: "Works in any space",
    why: "Components get dropped into sidebars, split panes and phones.",
    rules: ["Respond to the container, not just the viewport (@container)", "Labels never wrap; change form instead (More menu, sheet, scroll)", "Nothing overflows the page; long text truncates or wraps as prose"],
    built: "Container-aware Stat, PageHeader, Pagination, Tabs, Empty, OTP; App Top Nav priority+",
    checks: ["Component QA at 240/400px/full (/qa)", "audit: page-overflow, text-overflow, wrapped-label, overlap at 375/900/1280px"],
  },
  {
    principle: "Less is more, easy to use",
    why: "Every element has to earn its place; people should never get lost.",
    rules: ["One primary action per view", "Don't group when groups hold one item", "Every page reachable; a visible way back; no dead links", "Mockup first, keep / change / remove before building"],
    built: "Page menu (⌘J), mega menu, site header link back, rules template workflow",
    checks: ["Link crawl (404s and # links)", "audit: dead-link, unnamed-control, small-target, unlabelled-field"],
  },
  {
    principle: "Plain, specific words",
    why: "People trust facts, not adjectives. AI filler reads as filler.",
    rules: ["Say what happens, with numbers", "Buttons are verbs that say the outcome", "No AI jargon, clichés or placeholder text"],
    built: "One shared copy rule list (copy-rules.js)",
    checks: ["Copy lint on source", "recanica check: copy", "audit: spec-copy on the rendered page"],
  },
  {
    principle: "Made for Malaysia",
    why: "Our users bill in ringgit and file with LHDN.",
    rules: ["RM amounts, DD/MM/YYYY, SST, MyInvois, FPX/DuitNow", "Malay names and places spelled correctly"],
    built: "Demo data and invoicing helpers (lib/demo/my.ts), form examples",
    checks: ["Review checklist (not automated)"],
  },
];

export default function Page() {
  return (
    <>
      <DocsPageHeader
        eyebrow="Getting started"
        title="Design language"
        description="What Recanica believes, the rules that follow from it, where each rule is built, and the check that catches a break. A project gets the rules by using the packages, and the checks by running recanica check and recanica audit."
      />
      <H2 id="layers">How it flows</H2>
      <P>
        Principle → rule → token or component → pattern → section → page. Rules live once in <InlineCode>docs/ai/rules.template.md</InlineCode>{" "}
        (served to AI tools via MCP, <InlineCode>/llms.txt</InlineCode> and the CLI). Tokens and components implement them, so patterns and
        sections built from components inherit them. Checks run on code (<InlineCode>recanica check</InlineCode>) and on the rendered page
        (<InlineCode>recanica audit</InlineCode>), in this repo&apos;s CI and in any project.
      </P>
      {chain.map((c) => (
        <section key={c.principle} className="mt-8 rounded-2xl border p-5">
          <h3 className="text-base">{c.principle}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{c.why}</p>
          <div className="mt-4 grid gap-4 text-sm md:grid-cols-3">
            <div><p className="text-muted-foreground">Rules</p><ul className="mt-1 list-disc space-y-1 pl-4">{c.rules.map((r) => <li key={r}>{r}</li>)}</ul></div>
            <div><p className="text-muted-foreground">Built into</p><p className="mt-1">{c.built}</p></div>
            <div><p className="text-muted-foreground">Checked by</p><ul className="mt-1 list-disc space-y-1 pl-4">{c.checks.map((r) => <li key={r}>{r}</li>)}</ul></div>
          </div>
        </section>
      ))}
      <H2 id="projects">In a new project</H2>
      <TokenTable
        head={["Step", "What it protects"]}
        rows={[
          ["npx recanica init", "Tokens, components, and the rules in AGENTS.md so AI tools follow them"],
          ["Mockup first", "Agree keep / change / remove before code"],
          ["npx recanica check src", "Code: colours, weights, gradients, radii, copy"],
          ["npx recanica audit http://localhost:3000 --crawl", "Rendered pages at 375/900/1280: layout, overlap, consistency, spec, copy, accessibility"],
          ["Both in CI", "Nothing merges that breaks the language"],
        ]}
      />
      <P>
        Not everything can be automated: whether a page is calm, whether an element earns its place. Those stay in the{" "}
        <Link className="underline underline-offset-4" href="https://github.com/booyen/rekanica-des/blob/main/docs/GOVERNANCE.md">review checklist</Link>.
      </P>
      <Pager href="/docs/design-language" />
    </>
  );
}
