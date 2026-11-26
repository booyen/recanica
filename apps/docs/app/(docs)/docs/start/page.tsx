import Link from "next/link";
import { CodeBlock } from "@/components/docs/code-block";
import { DocsPageHeader, H2, InlineCode, P } from "@/components/docs/page-header";
import { Pager } from "@/components/docs/pager";

export const metadata = {
  title: "Start a project",
  description: "The path every Recanica project takes: init, kickoff, the decision log, then pages that pass check, slop and audit in CI.",
};

export default function Page() {
  return (
    <>
      <DocsPageHeader
        title="Start a project"
        description="Every project that uses Recanica goes through the same five steps. The first two take about ten minutes and decide how strict the rest is."
      />

      <H2 id="init">1. Install</H2>
      <P>
        <InlineCode>init</InlineCode> detects the stack, adds the tokens and parts, writes the agent rules and a CI workflow, then offers to run
        the kickoff. In a project where the UI work is one part of a bigger build, install as a guest (the second line) and
        name the paths the UI team owns, so the checks block only there.
      </P>
      <CodeBlock lang="bash" code={`npx recanica init
npx recanica init --role guest --owns "src/ui/**"`} />

      <H2 id="kickoff">2. Answer the kickoff</H2>
      <P>
        The kickoff asks a person what the project is, who owns the code, the stack (or &ldquo;unknown&rdquo;), how strict Recanica should be,
        and what &ldquo;done&rdquo; means. It writes <InlineCode>recanica.config.json</InlineCode>, a readable{" "}
        <InlineCode>docs/ui/KICKOFF.md</InlineCode>, and the first entries of the decision log. Re-run it when an answer changes.
      </P>
      <CodeBlock lang="bash" code={`npx recanica kickoff
# agents: get the questions, ask the person, record the answers
npx recanica kickoff --questions
npx recanica kickoff --answers answers.json`} />
      <P>
        Flexibility is the answer that matters most. <InlineCode>locked</InlineCode> makes every style deviation a recorded decision,{" "}
        <InlineCode>guided</InlineCode> (the default) enforces reuse and structure and reports the rest, <InlineCode>open</InlineCode> frees
        composition for art-directed work. Tokens are fixed in every mode. Areas can differ: <InlineCode>&quot;zones&quot;</InlineCode> in the
        config can lock a shared package while a campaign folder stays open.
      </P>

      <H2 id="decisions">3. Read the decision log before UI work</H2>
      <P>
        <InlineCode>docs/ui/DECISIONS.md</InlineCode> holds the UI decisions in force (<InlineCode>D-</InlineCode>) and the mistakes already
        caught (<InlineCode>T-</InlineCode>). Each entry says why and what was rejected, and has a guard: a check rule, a pattern, a test or a
        reviewer. <InlineCode>brief</InlineCode> prints what is in force, one line each. A trap is only closed when its guard is mechanical, so the same mistake fails the build next time.
      </P>
      <CodeBlock lang="bash" code={`npx recanica decisions brief
npx recanica decisions new --title "Rows over cards"
npx recanica decisions new --trap --title "Cards came back"
npx recanica decisions lint`} />

      <H2 id="build">4. Build pages from parts</H2>
      <P>
        Start each page from the Page Library and the page anatomy, and write its brief first: the reader, their questions in order, what was left
        out. Before writing copy, run it past the slop check.
      </P>
      <CodeBlock lang="bash" code={`npx recanica slop --text "Your headline here"`} />

      <H2 id="ci">5. Let CI hold the line</H2>
      <P>
        The workflow <InlineCode>init</InlineCode> wrote runs these on every pull request: <InlineCode>check</InlineCode> for tokens,
        structure, reuse and the decision log&apos;s pattern guards; <InlineCode>slop</InlineCode> for generic copy and generated-UI defaults
        (glass, glows, blur blobs, sparkles); <InlineCode>decisions lint</InlineCode> for the log itself; <InlineCode>audit</InlineCode> for the
        rendered pages at 375, 900 and 1280px. Each fails only on must-fix findings; should-level
        findings are reported, and an accepted one goes in the config&apos;s <InlineCode>&quot;allow&quot;</InlineCode> list with a reason.
      </P>
      <CodeBlock lang="bash" code={`npx recanica check
npx recanica slop src
npx recanica decisions lint
npx recanica audit <url>`} />
      <P>
        Recanica runs this same path on itself: its kickoff, decision log and CI are in the{" "}
        <Link className="underline underline-offset-4" href="https://github.com/booyen/recanica/tree/main/docs/ui">docs/ui folder of the repo</Link>.
      </P>
      <Pager href="/docs/start" />
    </>
  );
}
