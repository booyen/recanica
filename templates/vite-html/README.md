# Recanica · Vite, no framework

The CSS-first starter: tokens and every shared part come from one import (`@recanica/css`), and JavaScript only adds
behaviour. Use it when the stack isn't decided yet. The `rc-*` classes are the same contract the React components render,
so moving to React, Vue, Svelte or Astro later swaps the adapter, not the design (see `docs/STACKS.md`).

```bash
npx degit booyen/recanica/templates/vite-html my-app
cd my-app && npm install && npm run dev
npx recanica kickoff        # the start-of-project questionnaire
```
