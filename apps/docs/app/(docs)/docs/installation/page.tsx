import { CodeBlock } from "@/components/docs/code-block";
import { DocsPageHeader, H2, H3, InlineCode, P } from "@/components/docs/page-header";
import { Pager } from "@/components/docs/pager";

export const metadata = { title: "Installation" };

export default function Page() {
  return (
    <>
      <DocsPageHeader eyebrow="Getting started" title="Installation" description="Add Rekanica to a Next.js app in the monorepo, then pull patterns and blocks from the registry." />
      <H2 id="packages">1. Add the packages</H2>
      <CodeBlock lang="bash" code={`pnpm add @rekanica/ui@workspace:* @rekanica/tokens@workspace:*`} />
      <H2 id="css">2. Import the tokens</H2>
      <P>Tailwind v4 reads tokens from CSS. Point <InlineCode>@source</InlineCode> at the UI package so its classes are generated.</P>
      <div className="mt-4"><CodeBlock title="app/globals.css" lang="css" code={`@import "tailwindcss";
@import "@rekanica/tokens/theme.css";

@source "../../../packages/ui/src";`} /></div>
      <H2 id="next">3. Transpile the UI package</H2>
      <CodeBlock title="next.config.ts" lang="ts" code={`const config = {
  transpilePackages: ["@rekanica/ui"],
};
export default config;`} />
      <H2 id="layout">4. Fonts, theme and finish</H2>
      <CodeBlock title="app/layout.tsx" code={`import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@rekanica/ui/components/tooltip";
import { Toaster } from "@rekanica/ui/components/sonner";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-finish="flat" suppressHydrationWarning className={\`\${sans.variable} \${mono.variable}\`}>
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
      <CodeBlock code={`import { Button } from "@rekanica/ui/components/button";

export default function Page() {
  return <Button variant="brand">Get started</Button>;
}`} />
      <H2 id="registry">Patterns and blocks</H2>
      <P>Patterns and blocks are copied into your app with the shadcn CLI so you own the code.</P>
      <H3 id="registry-add">Add one</H3>
      <CodeBlock lang="bash" code={`pnpm dlx shadcn@latest add https://rekanica.aturanica.com/r/data-table.json`} />
      <H3 id="registry-build">Build the registry</H3>
      <CodeBlock lang="bash" code={`pnpm registry:build   # writes apps/docs/public/r/*.json`} />
      <Pager href="/docs/installation" />
    </>
  );
}
