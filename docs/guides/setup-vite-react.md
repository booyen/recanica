# Vite + React + Tailwind CSS v4

```bash
npm i @recanica/ui @recanica/tokens tailwindcss @tailwindcss/vite
```

**vite.config.ts**

```ts
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
export default { plugins: [react(), tailwindcss()] };
```

**src/index.css**

```css
@import "tailwindcss";
@import "@recanica/tokens/theme.css";
@source "../node_modules/@recanica/ui";

/* Fonts: load Geist (Google Fonts or @fontsource/geist) and expose it */
:root { --font-geist-sans: "Geist"; --font-geist-mono: "Geist Mono"; }
```

**index.html**: `<html class="dark">`. Toggle dark mode by switching the `dark` class.

Components, patterns and blocks work exactly as in the [Next.js guide](setup-nextjs.md).
