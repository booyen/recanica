# Tailwind CSS v3

```bash
npm i @rekanica/tokens
```

**tailwind.config.js**

```js
module.exports = {
  presets: [require("@rekanica/tokens/tailwind-preset")],
  content: ["./src/**/*.{html,js,jsx,ts,tsx,vue,svelte,php,blade.php}"],
};
```

**global CSS**

```css
@import "@rekanica/tokens/variables.css";
@tailwind base;
@tailwind components;
@tailwind utilities;
```

You get `bg-background bg-panel bg-card text-muted-foreground border-border`, `rounded-2xl` on Rekanica's radius,
`p-panel px-gutter gap-stack w-sidebar max-w-content`, `text-title text-heading text-metric`, `shadow-soft shadow-float`.
Dark mode: `class="dark"` on `<html>`. The React components need Tailwind v4; on v3, follow the class recipes in the docs.
