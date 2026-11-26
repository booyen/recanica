---
"recanica": minor
"@recanica/mcp": minor
"@recanica/css": minor
---

Project setup and guardrails that work in any stack:

- `recanica kickoff`: the start-of-project questionnaire (interactive, `--questions` for agents, `--answers file.json`). Records role, UI scope, stack, flexibility and definition of done in `recanica.config.json`, `docs/ui/KICKOFF.md` and the first decision-log entries.
- Flexibility presets (`locked`, `guided`, `open`) and per-area `zones`; token rules stay fixed in every mode.
- Guest projects (`init --role guest --owns …`, `scope.owns`): checks block only inside the UI scope and advise elsewhere; AGENTS.md carries the guest rules and suggestions go to `docs/ui/PROPOSALS.md`.
- `recanica decisions` (brief, list, lint, new): a UI/UX decision log with traps; pattern guards run in `recanica check`.
- `recanica slop`: copy tells and design defaults (glass, glows, blur blobs, emoji icons, sparkles, decorative motion), with a score; `--text` and stdin for checking one piece of copy. New `design-slop` rule in `check`; more LLM tells in the copy rules.
- Any stack: `init` detects Vue/Nuxt, Svelte/SvelteKit, Astro and Angular and wires `@recanica/css`; AGENTS.md names `rc-*` parts outside React; `rc-*` elements count as the part in any template language.
- MCP: `get_kickoff_questions` and `check_copy`.
- CSS: `rc-page-header__main / __text / __actions` and `rc-table__cell--secondary / --tertiary` (parity with the React parts).
