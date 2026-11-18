# Rekanica · email templates

Email clients don't support CSS variables, flexbox reliably, or web fonts everywhere, so emails use tables and inline
styles with Rekanica's **light-mode hex values** (from `packages/tokens/generated/json/tokens.json`).

- `invoice-reminder.html`: instalment reminder with pay button and payment schedule (Malaysian invoicing).

Rules carry over: no bold, pill button, hairline borders, 20px card radius, one light big number with a muted caption.
