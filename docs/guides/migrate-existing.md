# Adopting Recanica on an existing site

Swapping colours is not adopting Recanica, but it is the first step. This guide is the order
that worked on a live product (a browser studio + marketing site + server-rendered library):
a base layer across every page in one pass, then the checks, then page-by-page rework.

## 1. Bring Recanica in

- **Git submodule** (keeps the design system linked to its repo):
  `git submodule add https://github.com/booyen/recanica vendor/recanica`, then build your
  stylesheet from it (tokens `packages/tokens/generated/css/variables.css` + `packages/css/src/components.css`)
  instead of copying a file by hand.
- The CLI runs straight from the clone: `node vendor/recanica/packages/cli/src/index.js check src`.
- **React components need React 19.** On React 18, start with the framework-free `rc-*`
  classes and the tokens, and upgrade React before swapping components.

## 2. Map the old variables (base layer)

Most existing sites have their own names (`--bg`, `--fg`, `--line`, `--muted` …). Point them
at Recanica's semantic tokens so the old rules keep working:

```css
:root {
  --bg: var(--background);
  --fg: var(--foreground);
  --line: var(--border);
  --hair: var(--border);
}
```

Three traps:

- **Never define a variable from itself.** If the old name is the same as Recanica's
  (`--ring`, `--card`), delete the old line; `--ring: var(--ring)` is invalid and silently
  disables every rule that uses it (focus rings, card backgrounds). `recanica check` flags it.
- **Never reuse a semantic name with another meaning.** An old `--muted` that meant *grey
  text* collides with Recanica's `--muted` (a *background*). Rename the old one or use
  `--muted-foreground`.
- **Hard-coded greys and whites** inside rules (`#000`, `#fff`, `#1f1f1f`) need mapping
  one by one: dark fills to `--primary`, light fills to `--card`, text to `--foreground` /
  `--muted-foreground`, lines to `--border`. Text that sits on images or artwork stays white.

Also in the base layer: the font (`--font-sans`), `font-weight` never above 500, pill buttons,
`<html class="dark">` for dark-first, and link the stylesheets in the page `<head>` (not as an
`@import` chain) so the page never paints unstyled.

## 3. Record what is deliberate

Some colour is content, not interface: gradient artwork, product imagery, a brand moment
the owner chose. Record it once, with a reason, so the checks report only real problems:

```json
{
  "allow": [
    { "rule": "gradient", "file": "src/art/**", "reason": "Gradient artwork is the product" },
    { "rule": "spec-color", "path": "/", "reason": "The hero's coloured words are the one brand moment" }
  ],
  "ignore": ["**/*.test.ts", "src/data/palettes.ts"]
}
```

`file` globs apply to `recanica check` (source files); `path` globs apply to `audit` and
`review` (page URLs). Must-rules can't be allowed away.

## 4. Measure, then rework page by page

1. `recanica check src` for the code, `recanica review <url> --crawl` for every page at
   375 / 900 / 1280 px. Target: 85+ per page, nothing under 70.
2. **Quick wins first**, across all pages at once: focus rings, equal header padding, the
   current page marked in the nav, banned words, text under 12px, tables that overflow on
   phones, reading width (about 65ch).
3. **Then rework** from the lowest score up: mockup, owner review (keep / change / remove),
   rebuild from the matching pattern. Narrow blocks are centred as one unit or fill the
   column; headings never end on a lone word.
