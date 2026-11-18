# Plain HTML, WordPress, Laravel, Django, Rails

No build step, no React, no Tailwind:

```html
<html class="dark" data-finish="flat">
<head>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&family=Geist+Mono&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://unpkg.com/@rekanica/css/dist/rekanica.css" />
  <style>:root { --font-geist-sans: "Geist"; --font-geist-mono: "Geist Mono"; }</style>
</head>
```

```html
<button class="rk-btn rk-btn--brand">Get started</button>

<section class="rk-stats">
  <div class="rk-stat">
    <div class="rk-stat__head"><span>Revenue</span><a href="#">View all →</a></div>
    <div class="rk-stat__value"><span class="rk-metric">RM 4,820</span><span class="rk-caption">November</span></div>
  </div>
</section>
```

Full class list: [packages/css/README.md](../../packages/css/README.md). Working page: [packages/css/examples/index.html](../../packages/css/examples/index.html).
Or self-host: `npm i @rekanica/css` and serve `node_modules/@rekanica/css/dist/rekanica.css`.
