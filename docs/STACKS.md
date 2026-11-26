# Any stack: how Recanica stays independent of the framework

Status: proposal, part 1 built · Updated: 2026-11-26

## The problem

New projects default to Next.js. Not because Next.js was chosen, but because Recanica's richest layer (60 React
components, the templates, the page patterns) is React, and an agent takes the path with the most examples. The next
project may be Vue, Svelte, Astro, Angular, a server-rendered PHP site or a stack nobody has picked yet. A design system
that only works well in one framework quietly picks the framework.

## The principle: the design lives in tokens and CSS; frameworks are adapters

```
 ┌───────────────────────────────────────────────────────────────────────┐
 │ 4. Adapters    React (@recanica/ui) · later: Vue, Svelte, …           │  props → classes, plus behaviour
 │ 3. Behaviour   native HTML first, then the stack's headless library   │  dialog, menu, tabs, combobox
 │ 2. Parts       @recanica/css: rc-* classes + their HTML anatomy       │  ← the contract every stack renders
 │ 1. Tokens      W3C JSON → CSS, Tailwind, JS, Flutter, Swift, Compose  │  any platform
 └───────────────────────────────────────────────────────────────────────┘
```

1. **Tokens** (built): one W3C source, generated for every platform.
2. **Parts** are the contract. A part is an `rc-*` class with a known HTML anatomy (`rc-page-header` → `__main`, `__text`,
   `__title`, `__desc`, `__actions`). It works in any web stack with no JavaScript and no build step, server-rendered or not.
3. **Behaviour** is separate from looks. Use native HTML first: `<dialog>`, `<details>`, the `popover` attribute, `<select>`,
   container queries, `:has()`. Where that isn't enough, each stack's own headless library adds it (Radix for React; Reka UI
   for Vue; Bits UI for Svelte).
4. **Adapters** are thin. A React, Vue or Svelte component maps its props to the part's classes and wires the behaviour.
   It never adds a look the CSS doesn't have.

### Rules that keep it honest

- **A part exists in CSS and React in the same commit.** `pnpm lint:parts` already fails CI when one side is missing.
- **An adapter never out-designs the contract.** If the React version needs a layout the `rc-*` version can't express,
  the CSS gets it first. (Found while building the Vite starter: React's `PageHeader` had an actions slot and the CSS twin
  didn't; tables in React patterns hid secondary columns and the CSS had no way to. Both are now in `@recanica/css`.)
- **An element with an `rc-*` class is the part.** `recanica check` accepts `<button class="rc-btn">` in HTML, Vue, Svelte,
  Astro and Angular templates, and still flags a raw `<button class="px-4">`.
- **The stack is a decision, not a default.** `recanica kickoff` asks for it and records it in the decision log. "Unknown"
  is a valid answer.

## When the stack isn't decided: start CSS-first

Build the first screens with tokens + `@recanica/css` in plain HTML or Vite (`templates/vite-html`). Nothing is lost when
the stack is chosen: the markup already uses the parts every adapter renders, so the move is "replace `class="rc-btn"` with
`<Button>`", not a redesign. The reverse (starting in Next.js, then moving to Vue) means rewriting every page.

## What each stack gets today

| Stack | Tokens | Parts | Components | `recanica init` |
|---|---|---|---|---|
| Next.js | ✓ | ✓ | ✓ React (`@recanica/ui`) | detected |
| Vite + React, React Router, Remix, Gatsby | ✓ | ✓ | ✓ React (React 19 + Tailwind v4) | detected as `vite-react` |
| Vue / Nuxt | ✓ | ✓ `rc-*` | wrap parts yourself (behaviour only) | detected, CSS wired |
| Svelte / SvelteKit | ✓ | ✓ `rc-*` | wrap parts yourself (behaviour only) | detected, CSS wired |
| Astro | ✓ | ✓ `rc-*` | React islands can use `@recanica/ui` | detected, CSS wired |
| Angular | ✓ | ✓ `rc-*` | wrap parts yourself (behaviour only) | detected, CSS wired |
| Plain HTML, PHP, WordPress, Django, Rails | ✓ | ✓ `rc-*` | n/a | detected (`html`) |
| Tailwind v3 (any framework) | ✓ preset | build your own | n/a | detected |
| Flutter / SwiftUI / Compose | ✓ generated | theme + constants | n/a | detected |

`AGENTS.md` names the parts the way the stack writes them: React components for React stacks, `rc-*` classes everywhere
else. An agent in a Vue project is never told to use `<PageHeader>`.

## Options considered for "one component library everywhere"

| Option | For | Against | Verdict |
|---|---|---|---|
| **CSS contract + thin adapters** (this proposal) | Works in every stack today, SSR-safe, no JS for looks, one place to fix a look | Each adapter is some work; behaviour needs a library per stack | **Chosen** |
| Web Components (Lit) for everything | One build runs in every framework | Shadow DOM fights Tailwind and global tokens; form participation and SSR/hydration are still uneven; React wrappers needed anyway | For behaviour only, light DOM (step 3 below) |
| Mitosis-style codegen from one source to every framework | One source | A compiler to maintain; the output is the lowest common denominator; debugging generated code | Rejected for now |
| Stay React-first, document "port it yourself" | No work | Every non-React project re-derives the parts and drifts; exactly the problem above | Rejected |

## Roadmap

1. **Built in this change**
   - `init` detects Vue/Nuxt, Svelte/SvelteKit, Astro and Angular, installs `@recanica/css` and wires it into the global stylesheet.
   - `AGENTS.md` per stack, naming the right parts.
   - `kickoff` asks for the stack, accepts "unknown", and records the choice as a decision.
   - `recanica check` treats `rc-*` elements as the part in any template language.
   - `templates/vite-html`: the CSS-first starter (builds with Vite, no framework).
   - CSS parity fixes: `rc-page-header__actions`, `rc-table__cell--secondary / --tertiary`.
2. **Next: anatomy spec.** Grow `packages/ui/parts.json` from names into anatomy: elements, modifiers (variants), states,
   ARIA. `lint:parts` then checks that React and CSS render the same anatomy, and adapters can be generated from it.
3. **Then: a behaviour package.** `@recanica/behaviors`: framework-free, light-DOM custom elements that only add behaviour
   to existing `rc-*` markup (`<rc-tabs>`, `<rc-menu>`, `<rc-combobox>`). No shadow DOM, no styles. Usable from any stack.
4. **On demand: adapters.** A Vue or Svelte adapter is built when a project picks that stack (its kickoff decision is the
   trigger), generated from the anatomy spec, with the stack's headless library for behaviour.
5. **Templates:** `vite-react` (React without Next.js) and `astro-site` (content site with React islands).
