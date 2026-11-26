# Home · `/`

Status: built · Updated: 2026-11-26

**Purpose:** Say what Recanica is in one line and send the reader to one of three places.

**Reader:** A developer or designer arriving from the repo README, a shared link or an AI tool's answer. First visit, deciding where to go; often already knows they want "the docs", "a component" or "the MCP setup".

**Their questions, in order**
1. What is this? (one sentence is enough)
2. Where do I go for what I came for: the system's rules, a component, or wiring it into my AI tool?

**Main action:** pick one of three entries. No primary button: the three are equal.

**Page type → anatomy:** docs (index) → `Page` + `PageHeader`, then one `Section` holding a list of `NavItem` rows inside a `Surface`.

**Structure**
| # | Section | Answers | Why here |
|---|---|---|---|
| 1 | `PageHeader`: "Recanica" + one-line description | What is this? | Must be read before choosing |
| 2 | Menu: Design system → `/docs`, Components → `/docs/components`, MCP guide → `/docs/mcp` | Where do I go? | The only decision on the page |

**Left out on purpose:** the hero, stat tiles, bento and CTA blocks (marketing for a library that is mostly read by its own team and AI tools); demos, patterns, web library and blocks (reachable from the site header and from `/docs`). The site header and footer stay for global navigation.

**Alternatives rejected**
- Three cards in a row (`SurfaceGrid sm:grid-cols-3`) because the descriptions differ in length, so the cards end ragged, and at 375px it becomes a stack of boxes anyway; a list reads the same at every width.
- Keeping the hero with three buttons because buttons can't carry a description and three equal buttons make no one of them primary.

**Width and adapting:** one reading column (`Page width="reading"`), centred with the site gutter. At 375px the header and the list keep the same order; rows are full width, label and description wrap under each other, the arrow stays at the right edge.

**Deviations (should-rules not followed):** none.

**Check:** screenshots 1280/375 looked at ✓ · lint:design ✓ · lint:copy ✓ · layout audit `/` ✓
