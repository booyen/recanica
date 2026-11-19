# Copy audit · 19 Nov 2026

Scope: every user-facing string in the web library, app patterns, blocks, demos, templates and guides (282 files).
Method: `scripts/copy-lint.mjs` (pattern rules) plus a manual read of every headline, subhead and testimonial.

## Findings and fixes

| Where | Before | Problem | After |
|---|---|---|---|
| Hero · Centered | "The platform your team actually wants to use" | Generic claim, "actually" filler | "Invoices and payments for small businesses" |
| Hero · Centered | "Replace this with your value proposition…" | Placeholder left in a shippable block | "Send an invoice, get paid by FPX or DuitNow, and have SST and e-Invoice done for you." |
| Hero · Product | "Sell software in minutes, not months" | "X, not Y" rhythm, a common AI tell | "Sell software without building billing" |
| Hero · Split | "Get paid in days, not weeks." | Same rhythm | "Most invoices are paid within 3 days." |
| Bento 1 | "Built for the way you sell" | Cliché, says nothing | "Four things you'll use every day" |
| Bento 1 | "Every number that matters, in one calm view." | Vague | "Revenue, refunds and payouts on one page." |
| Bento 1 | "Benefits on autopilot" | Cliché | "Benefits delivered automatically" |
| Bento 1 | "Fast, accessible and on-brand on every device." | Adjective stack | "Three fields, works on phones, matches your brand." |
| Bento 2 | "Revenue that explains itself" | Personification | "Revenue by month and product" |
| Bento 2 | "Built for collaboration" | Generic | "Roles for your team" |
| Bento 2 | "Know the moment it happens" | Vague | "Alerts for payments and payouts" |
| Logo cloud | "Trusted by teams shipping every day" | Generic proof | "Used by 1,200 businesses across Malaysia" |
| Testimonials | "…with code. That never happens." | Ad cliché | "Support replied in 20 minutes with the exact API call I needed." |
| Testimonials | "…designed by people who sell software themselves." | Generic praise | "Refunds, invoices and payouts are on the same screen. I stopped using three other tools." |
| Dashboard promo | "Unlock advanced analytics and lower fees." | "Unlock" | "Advanced reports and a lower 2.5% fee." |
| Sign in | "Email me a magic link" | Jargon to non-developers | "Email me a sign-in link" |

## Layout review

- Every page is covered by `pnpm test:layout` (mobile + desktop): overflow, clipped text, text escaping its box, stretched grid rows.
- Components that can be placed anywhere (invoice document) use container queries so they adapt to their slot, not the viewport.
- Stress content (long Malay company names, long emails, RM amounts in the millions) lives on `/demo/stress`.

## Rules going forward

The voice rules are part of `docs/ai/rules.template.md`, so every AI prompt, the MCP server and the CLI's AGENTS.md carry them.
`pnpm lint:copy` runs in CI and fails on the error rules. Ignore a deliberate use with `// copy-lint-ignore`.

Sample data (company names, figures, quotes) is fictional and marked as such in the demos.
