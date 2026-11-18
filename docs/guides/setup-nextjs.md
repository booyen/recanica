# Next.js + Tailwind CSS v4

```bash
npm i @rekanica/ui @rekanica/tokens
```

**app/globals.css**

```css
@import "tailwindcss";
@import "@rekanica/tokens/theme.css";

/* Let Tailwind see the classes used inside the component library */
@source "../node_modules/@rekanica/ui";
```

**app/layout.tsx**

```tsx
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@rekanica/ui/components/tooltip";
import { Toaster } from "@rekanica/ui/components/sonner";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-finish="flat" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
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
import { Button } from "@rekanica/ui/components/button";
<Button variant="brand">Get started</Button>
```

**Add a pattern or block** (copied into your app, you own the code):

```bash
npx shadcn@latest add https://rekanica.aturanica.com/r/data-table.json
```

Inside this monorepo, use `workspace:*` versions and add `transpilePackages: ["@rekanica/ui"]` to `next.config.ts`.
