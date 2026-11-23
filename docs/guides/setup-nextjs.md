# Next.js + Tailwind CSS v4

> **React 19:** `@recanica/ui` needs React 19 (`react` and `react-dom` ^19). On React 18, upgrade first, or use the framework-free `@recanica/css` classes (`rc-*`) until you can.


> **Your own font:** Geist is only the default. Load any calm sans with light/regular weights and tabular numerals, then set `--font-sans` / `--font-mono` to it.

```bash
npm i @recanica/ui @recanica/tokens
```

**app/globals.css**

```css
@import "tailwindcss";
@import "@recanica/tokens/theme.css";

/* Let Tailwind see the classes used inside the component library */
@source "../node_modules/@recanica/ui";
```

**app/layout.tsx**

```tsx
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@recanica/ui/components/tooltip";
import { Toaster } from "@recanica/ui/components/sonner";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TooltipProvider>{children}<Toaster /></TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Use components**

```tsx
import { Button } from "@recanica/ui/components/button";
<Button variant="brand">Get started</Button>
```

**Add a pattern or block** (copied into your app, you own the code):

```bash
npx shadcn@latest add https://recanica.aturanica.com/r/data-table.json
```

Inside this monorepo, use `workspace:*` versions and add `transpilePackages: ["@recanica/ui"]` to `next.config.ts`.
