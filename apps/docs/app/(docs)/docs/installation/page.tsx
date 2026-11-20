import { CodeBlock } from "@/components/docs/code-block";
import { DocsPageHeader, H2, H3, InlineCode, P } from "@/components/docs/page-header";
import { Pager } from "@/components/docs/pager";

export const metadata = { title: "Installation" };

export default function Page() {
  return (
    <>
      <DocsPageHeader title="Installation" description="Add Recanica to a Next.js app in the monorepo, then pull patterns and blocks from the registry." />
      <H2 id="packages">1. Add the packages</H2>
      <CodeBlock lang="bash" code={`pnpm add @recanica/ui@workspace:* @recanica/tokens@workspace:*`} />
      <H2 id="css">2. Import the tokens</H2>
      <P>Tailwind v4 reads tokens from CSS. Point <InlineCode>@source</InlineCode> at the UI package so its classes are generated.</P>
      <div><CodeBlock title="app/globals.css" lang="css" code={`@import "tailwindcss";
@import "@recanica/tokens/theme.css";

@source "../../../packages/ui/src";`} /></div>
      <H2 id="next">3. Transpile the UI package</H2>
      <CodeBlock title="next.config.ts" lang="ts" code={`const config = {
  transpilePackages: ["@recanica/ui"],
};
export default config;`} />
      <H2 id="layout">4. Fonts and theme</H2>
      <CodeBlock title="app/layout.tsx" code={`import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@recanica/ui/components/tooltip";
import { Toaster } from "@recanica/ui/components/sonner";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={\`\${sans.variable} \${mono.variable}\`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}`} />
      <H2 id="use">5. Use components</H2>
      <CodeBlock code={`import { Button } from "@recanica/ui/components/button";

export default function Page() {
  return <Button variant="brand">Get started</Button>;
}`} />
      <H2 id="registry">Patterns and blocks</H2>
      <P>Patterns and blocks are copied into your app with the shadcn CLI so you own the code.</P>
      <H3 id="registry-add">Add one</H3>
      <CodeBlock lang="bash" code={`pnpm dlx shadcn@latest add https://recanica.aturanica.com/r/data-table.json`} />
      <H3 id="registry-build">Build the registry</H3>
      <CodeBlock lang="bash" code={`pnpm registry:build   # writes apps/docs/public/r/*.json`} />
      <H2 id="check">Keep it on-brand</H2>
      <P>
        Run <InlineCode>recanica check</InlineCode> in CI or a pre-commit hook. It fails on hard-coded colours, palette hues, bold weights,
        gradients and AI-jargon copy, so a project can&apos;t drift from the design language without someone noticing.
      </P>
      <CodeBlock lang="bash" code={`npx recanica check src        # exit 1 on errors
npx recanica check src --all  # include warnings`} />
      <P>
        Allow a deliberate exception with a <InlineCode>recanica-ignore: reason</InlineCode> comment on the line, or list paths in{" "}
        <InlineCode>recanica.config.json</InlineCode>. New pages follow the mockup-first workflow in the rules: mock up from patterns, review, then build.
      </P>
      <Pager href="/docs/installation" />
    </>
  );
}
