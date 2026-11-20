import Link from "next/link";
import { DocsPageHeader, H2, P, InlineCode } from "@/components/docs/page-header";
import { TokenTable } from "@/components/docs/frame";
import { Pager } from "@/components/docs/pager";
import { CodeBlock } from "@/components/docs/code-block";

export const metadata = { title: "Design language" };

/*
 * The chain from what we believe to what CI enforces. Every principle names its rules,
 * where they are built (so a project gets them by using the package), and the check that catches a break.
 */
const chain: { principle: string; why: string; rules: string[]; built: string; checked: string }[] = [
  {
    principle: "Calm",
    why: "The one thing every Recanica project shares. Content carries the page, not decoration.",
    rules: ["Build on a neutral base", "Use one brand colour, for the main action and focus", "Use status colours only for status", "No extra hues, no gradients", "Get depth from layered surfaces, not shadows"],
    built: "colour tokens; one --brand override recolours a project",
    checked: "code check and page audit flag colours outside the tokens",
  },
  {
    principle: "Quiet type",
    why: "Bold shouts. Size and muted text do the work quietly.",
    rules: ["Use any calm, readable sans (Geist by default)", "Regular for text, light for big numbers, medium at most", "Sentence case, no ALL CAPS labels"],
    built: "type tokens and the components that set weights",
    checked: "code check and page audit flag heavy weights",
  },
  {
    principle: "One shape language",
    why: "Consistent shapes make everything feel like one product.",
    rules: ["Pill-shaped controls", "Rounded surfaces with a hairline border", "Radius and button sizes from the scale"],
    built: "Button, Badge, Tabs, Card, Table",
    checked: "page audit flags off-scale shapes and sizes",
  },
  {
    principle: "Same thing, same look",
    why: "If two buttons of the same kind differ, one of them is a bug.",
    rules: ["Fix the component, never patch it on one page", "Size label columns to their content", "Keep equal insets on both sides"],
    built: "component variants and sizes",
    checked: "page audit compares every instance on a page",
  },
  {
    principle: "Works in any space",
    why: "Components end up in sidebars, split panes and phones.",
    rules: ["Respond to the container, not just the screen", "Never wrap a label; change form instead (menu, sheet, scroll)", "Never overflow the page"],
    built: "container-aware components and the top nav",
    checked: "component QA at 240px, 400px and full width; page audit at 375, 900 and 1280px",
  },
  {
    principle: "Less is more",
    why: "Every element has to earn its place, and nobody should get lost.",
    rules: ["One primary action per view", "Every page reachable, with a visible way back", "Mock up and agree before building"],
    built: "patterns, page menu, mega menu",
    checked: "review scores busyness; link check finds dead ends",
  },
  {
    principle: "Plain words",
    why: "People trust facts, not adjectives.",
    rules: ["Say what happens, with numbers", "Buttons say the outcome", "No AI jargon or placeholder text"],
    built: "one shared word list",
    checked: "copy lint on code; page audit on what's rendered",
  },
  {
    principle: "Your users' language",
    why: "Money, dates and names look the way your users write them.",
    rules: ["Format with the project's locale", "Use names and places your users recognise"],
    built: "demo helpers (Malaysian defaults as an example)",
    checked: "review checklist",
  },
];

export default function Page() {
  return (
    <>
      <DocsPageHeader
        title="Design language"
        description="What Recanica believes, the rules that follow from it, where each rule is built, and the check that catches a break. A project gets the rules by using the packages, and the checks by running recanica check and recanica audit."
      />
      <H2 id="principles">Principles</H2>
      <P>Eight principles. Calm is the one every project must keep; the others are how Recanica gets there.</P>
      <ul className="mt-6 divide-y rounded-2xl border">
        {chain.map((c, i) => (
          <li key={c.principle}>
            <a href={`#p-${i}`} className="grid gap-1 px-5 py-3.5 transition-colors hover:bg-accent/40 sm:grid-cols-[12rem_1fr] sm:gap-6">
              <span className="flex items-center gap-2">
                {c.principle}
                {i === 0 && <span className="rounded-full border px-2 text-xs text-muted-foreground">Mandatory</span>}
              </span>
              <span className="text-sm text-muted-foreground sm:text-base">{c.why}</span>
            </a>
          </li>
        ))}
      </ul>

      <H2 id="detail">Applying them</H2>
      {chain.map((c, i) => (
        <section key={c.principle} id={`p-${i}`} className="scroll-mt-20">
          <h3 className="pt-6 pb-2">{c.principle}</h3>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">{c.rules.map((r) => <li key={r}>{r}</li>)}</ul>
        </section>
      ))}

      <H2 id="projects">In a new project</H2>
      <TokenTable keys="code"
        head={["Step", "What it protects"]}
        rows={[
          ["npx recanica init", "Tokens, components, and the rules in AGENTS.md so AI tools follow them"],
          ["Mockup first", "Agree keep / change / remove before code"],
          ["npx recanica check src", "Code: colours, weights, gradients, radii, copy"],
          ["npx recanica audit http://localhost:3000 --crawl", "Rendered pages at 375/900/1280: layout, overlap, consistency, spec, copy, accessibility"],
          ["Both in CI", "Nothing merges that breaks the language"],
        ]}
      />
      <H2 id="levels">How strict: must, should, choice</H2>
      <P>
        Rules guide; they don&apos;t cage. Each one has a level, and the tools treat them differently, so a project can bend the right
        things and never the wrong ones.
      </P>
      <TokenTable
        head={["Level", "What it covers", "How the tools treat it"]}
        rows={[
          ["Must", "Accessibility (contrast, names, labels, 24px targets, visible focus), nothing broken (overflow, overlap, wrapped labels), a page title, text ≥ 12px, no dead links, no AI-jargon copy, colours through tokens", "Always fixed. recanica audit and check fail the build. Can't be allowed away"],
          ["Should", "Calm defaults: one primary action, type and colour budgets, radius and button scale, no bold, no nested cards, table/form/nav sizes, hierarchy, alignment, spacing rhythm, one right edge", "Reported and scored, never block. Deviate when the content needs it, and write why in recanica.config.json \"allow\" (rule, path, reason). An allow without a reason is ignored"],
          ["Choice", "Brand colour, font, locale, light/dark default, radius base, the busyness thresholds", "The project's call: set tokens (--brand, --font-sans, --radius) and config \"thresholds\""],
        ]}
      />
      <CodeBlock title="recanica.config.json" lang="json" code={`{
  "thresholds": { "tableColumns": 8 },
  "allow": [
    { "rule": "busy-table", "path": "/reports/**", "reason": "Finance compares nine columns side by side" }
  ]
}`} />

      <H2 id="type">Responsive type</H2>
      <P>
        Headlines, titles and headings are fluid: they scale smoothly between a phone size and a desktop size (for example the page
        title goes from 26px at 375px wide to 30px at 1280px), in rem so browser zoom still works. Body text (12/14/16px) stays fixed so
        it never gets harder to read on a phone. Inside components that can sit anywhere, big numbers scale to their container instead
        (the Stat value). A project can change the ranges in its tokens.
      </P>

      <H2 id="good-ui">What makes a good page</H2>
      <P>
        Eight dimensions, each measured on the rendered page by <InlineCode>npx recanica review</InlineCode> and scored 0–100.
        Target: 85+ overall and nothing under 70.
      </P>
      <TokenTable
        head={["Dimension", "Good means", "Measured by"]}
        rows={[
          ["Clarity", "You know what the page is and what to do first", "A visible title; on task pages the main action is on the first screen"],
          ["Hierarchy", "One thing leads, the rest steps down", "One focal element; title at least 1.4× body size"],
          ["Calm", "Nothing competes for attention", "One primary action; ≤6 sizes (7 with a hero); no nested cards; few borders, badges, icons; short nav runs"],
          ["Consistency", "Same thing, same look, Recanica everywhere", "Token colours only, no bold, pill buttons, radius scale, same component renders the same"],
          ["Readability", "Easy to read for everyone", "WCAG AA contrast (4.5:1 body, 3:1 large); lines ≤ ~90 characters; nothing under 12px; no AI-jargon"],
          ["Layout", "Ordered and aligned", "Few left edges; spacing on the 4px grid; no overlap; content width capped; equal edge insets"],
          ["Usability", "Predictable and forgiving", "Verb labels; current page marked; errors under their fields; visible keyboard focus; named controls; no dead links"],
          ["Responsiveness", "Works at any width", "No overflow, wrapped labels or overlap at 375px; components work at 240px (component QA)"],
        ]}
      />
      <P>
        Scores measure the page, not the people using it. They can&apos;t tell you whether someone finishes the task or trusts what they see.
        Before shipping a reworked flow, watch 3–5 real users do its main task and note where they hesitate.
      </P>

      <H2 id="existing">In an existing project: rework, not reskin</H2>
      <P>
        Swapping colours is not adopting Recanica. Recanica is also how pages are built: one primary action, few sizes,
        one surface per group, short forms, nothing that doesn&apos;t earn its place. So adoption is a rework, page by page.
      </P>
      <TokenTable keys="code"
        head={["Step", "What happens"]}
        rows={[
          ["npx recanica review http://localhost:3000 --crawl", "Measures what makes each page busy and writes recanica-review.md: each signal with the Recanica fix, and the closest Recanica pattern per page"],
          ["Agree per page", "What the page is for, its one main action, keep / change / remove for each element. Removing and merging is expected"],
          ["Rebuild from the pattern", "Page Header, content, one primary action, Recanica components. Not the old markup with new colours"],
          ["Verify", "recanica review shows no busy signals; recanica check and recanica audit pass"],
        ]}
      />
      <P>
        With an AI tool, use the MCP prompt <InlineCode>apply-recanica</InlineCode>: it runs this rework by default and asks before changing each page.
        Pass <InlineCode>mode: reskin</InlineCode> only when a colour swap is all you want.
      </P>
      <P>
        Not everything can be automated: whether a page is calm, whether an element earns its place. Those stay in the{" "}
        <Link className="underline underline-offset-4" href="https://github.com/booyen/rekanica-des/blob/main/docs/GOVERNANCE.md">review checklist</Link>.
      </P>
      <H2 id="layout">How layouts are decided</H2>
      <P>In this order. Each step narrows the next, so the layout follows the content and the task, not habit.</P>
      <TokenTable
        head={["Step", "Question", "Decides"]}
        rows={[
          ["1. Purpose", "What is the page for, who uses it, what is the one main action, what must they see first?", "What leads and what can go"],
          ["2. Page type", "Is it an overview, list, detail, form, settings, or a marketing page?", "The Recanica pattern to start from (page library)"],
          ["3. Order", "In what order do people need things?", "Title and main action → key numbers/status → working area → details → rare and destructive actions"],
          ["4. Grouping", "What belongs together?", "One surface per group; space, not borders, between groups"],
          ["5. Frequency", "How often is each thing used?", "Visible, in a menu, or behind a click"],
          ["6. Width", "How wide should each block be for its content?", "Form 640px, text ~65ch, tables full width, grids only for comparable items"],
          ["7. Adapting", "What happens when space runs out?", "Stack, wrap, scroll, More menu or sheet, checked at 240px to 1280px"],
          ["8. Check", "Does it hold up with the user and the measures?", "Mockup review, then recanica review"],
        ]}
      />
      <P>
        What pulls a layout in the wrong direction is habit: filling space, stacking every section, copying a generic dashboard.
        Steps 1, 2 and 8 exist to catch that before it becomes code.
      </P>

      <H2 id="enforced">How it&apos;s enforced</H2>
            <P>
        Principle → rule → token or component → pattern → section → page. Rules live once in <InlineCode>docs/ai/rules.template.md</InlineCode>{" "}
        (served to AI tools via MCP, <InlineCode>/llms.txt</InlineCode> and the CLI). Tokens and components implement them, so patterns and
        sections built from components inherit them. Checks run on code (<InlineCode>recanica check</InlineCode>) and on the rendered page
        (<InlineCode>recanica audit</InlineCode>), in this repo&apos;s CI and in any project.
      </P>
      <div className="mt-6">
        <TokenTable
          head={["Principle", "Built into", "Checked by"]}
          rows={chain.map((c) => [c.principle, c.built, c.checked])}
        />
      </div>

      <H2 id="sources">Where these ideas come from</H2>
      <P>Not all of this has the same weight. Some are decisions, some are standards, some are judgement calls that should be revisited.</P>
      <TokenTable
        head={["Source", "What came from it"]}
        rows={[
          ["Aturanica Labs decisions", "Calm as the core value; less is more; user-friendly and easy to find; Polar's dashboard as the visual reference; light type, never bold; pill controls; rounded bordered surfaces; spacing that holds in any space; labels that never wrap; validation as highlighted fields with tinted notices; each section on its own page; mockup first; rework not reskin; no AI jargon"],
          ["Standards", "WCAG 2.2: 4.5:1 / 3:1 contrast, 24px targets (2.5.8), labels and names for controls, visible focus. Intl APIs for locale formatting"],
          ["Established UI practice", "Nielsen's usability heuristics (visibility of status, consistency, recognition over recall, minimalist design, error recovery); Gestalt grouping (proximity over boxes); Hick's law (fewer choices, one primary action); 45–90 character line length from typography; priority+ navigation; hierarchy by value and size rather than colour and weight (Refactoring UI); shadcn/ui and Radix conventions for components"],
          ["Judgement, to revisit", "The exact thresholds: 6 text sizes (7 with a hero), ~18 actions on the first screen, 8 badges, 15-item nav runs, 6 table columns, 10 form fields, 15 points per finding, 85 as the target. Calibrated on our own pages and test fixtures, not on user research. Adjust them as real projects and user tests show what works"],
        ]}
      />
      <Pager href="/docs/design-language" />
    </>
  );
}
