# Plain HTML, WordPress, Laravel, Django, Rails


> **Your own font:** Geist is only the default. Load any calm sans with light/regular weights and tabular numerals, then set `--font-sans` / `--font-mono` to it.

No build step, no React, no Tailwind:

```html
<html class="dark">
<head>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&family=Geist+Mono&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://unpkg.com/@recanica/css/dist/recanica.css" />
  <style>:root { --font-geist-sans: "Geist"; --font-geist-mono: "Geist Mono"; }</style>
</head>
```

```html
<button class="rc-btn rc-btn--brand">Get started</button>

<section class="rc-stats">
  <div class="rc-stat">
    <div class="rc-stat__head"><span>Revenue</span><a href="#">View all →</a></div>
    <div class="rc-stat__value"><span class="rc-metric">RM 4,820</span><span class="rc-caption">November</span></div>
  </div>
</section>
```

Full class list: [packages/css/README.md](../../packages/css/README.md). Working page: [packages/css/examples/index.html](../../packages/css/examples/index.html).
Or self-host: `npm i @recanica/css` and serve `node_modules/@recanica/css/dist/recanica.css`.
