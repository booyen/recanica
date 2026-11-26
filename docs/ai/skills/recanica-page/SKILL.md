---
name: recanica-page
description: Use for any page in a Recanica project — building a new page, redesigning one, reworking an existing page, or explaining why a page is laid out the way it is. Produces a written page brief (purpose, reader, their questions in order, structure, what was left out, alternatives rejected) before building, checks the rendered page against it, and reports the reasoning with the result. Trigger on "new page", "redesign", "rework", "make this page", "why is this page like this", "what's the purpose of this page".
---

# Recanica page

A page is a set of decisions about a reader. Make them on paper first, check them on the rendered page, and say them out loud.
Layout decided in code from habit is how pages end up "technically correct, visually messy" (per-element width caps,
data shapes rendered as columns, sections stacked because that's the default). This skill exists to stop that.

## Modes

- **Build**: a new page, a redesign or a rework → steps 1–6.
- **Explain**: "why is this page like this?" about an existing page → step E.

## 1. Write the brief (before any code)

First run `npx recanica decisions brief`: the decisions in force and the traps this project already fell into. The brief
must not contradict them. If the page needs something different, say so in the brief and add a decision that supersedes the
old one (`npx recanica decisions new`); don't quietly do something else.

Copy `brief-template.md` to `docs/pages/<route>.md` (create the folder if needed) and fill it in. Keep it short; one screen.

- **Purpose**: one sentence. What is this page for?
- **Reader**: who arrives here, from where, and in what state of mind (first visit, daily use, in a hurry, comparing).
- **Their questions, in order**: what they need to know or do first, second, third. This order IS the page order.
- **Main action**: the one thing the page should get done. If there is none, say so (reference pages).
- **Page type → anatomy**: pick the page type from the page anatomy (MCP `get_page_anatomy`, docs `/docs/page-anatomy`, source `docs/ai/anatomy.json`). It gives the shell, the regions in reading order and the part for each region. Fill those regions; skip the ones you don't need; don't invent new ones without a reason in the brief.
- **Structure**: each section in order, with the question it answers and why it sits there.
- **Left out on purpose**: what a reader might expect that isn't here, and where it lives instead.
- **Alternatives rejected**: at least two other structures you considered, and why not (e.g. "grid of cards: uneven lengths leave holes", "one big table: lists in cells read badly, breaks on phones").
- **Width and adapting**: per section (reading column, full width or side panel), and what happens at 375px and in a narrow container.
- **Deviations**: any should-rule you are deliberately not following, with the reason (these go to `recanica.config.json` "allow").

Decide from the reader's questions, never from the shape of your data or what is quickest to code.

## 2. Show the brief and a mockup; agree it

Show the brief and a quick mockup (existing patterns, realistic content). Ask the user to mark each section keep / change / remove.
Don't build until it's agreed. Update the brief with what changed and why.

## 3. Build from the pattern, parts first

Before writing markup, list every part the page needs (header, sections, surfaces, rows, controls, tables) and map each to an
existing component. If one is missing, add or extend the component first; that is system work, not page work.
Writing raw `<button>`, `<input>`, `<select>`, `<table>` or a hand-made card fails `recanica check`.


Use Recanica components and the pattern named in the brief. Fix components, never patch them on the page.
Before reusing a component for different content, check its defaults fit that content (a table built for token names styles its
first column as small monospace; prose labels in it wrap and look like code). If they don't, make the component handle both.
Compose the page from the shared structure parts. Use `Page`, `PageHeader`, `Section`, `Heading`, `Stack` and `ReferenceTable` for apps, and `WebSection`, `WebSectionTitle` and `WebHeroTitle` for sites.
Never hand-build a header, heading or section; `recanica check` flags it. If a part doesn't fit, change the part, not the page.
Single source for layout decisions: the container owns spacing and width, blocks never do. Stack blocks in a `.flow` column
(or `gap-*`), put reading pages in `.reading`, and pick text emphasis by role (main = foreground, supporting = muted).
Never space or size an individual block to make it look right on one page.

### Reuse: every element comes from a part

The design system only works if pages are built from it. Rules:
1. **Look up before you write.** For each element on the page, find the part: `npx recanica rules`, MCP `list_components`, or the docs catalog. The usual ones:
   - page structure: `Page`, `PageHeader`, `Section`, `Heading`, `Stack`
   - boxes and grids: `Surface`, `SurfaceGrid`
   - rows and options: `NavItem`, `ChoiceCard`
   - controls: `Button`, `Input`, `NativeSelect`, `Select`, `Field`
   - data: `Table`, `ReferenceTable`, `StatGroup`, `BarRow`
   - states: `Empty`, `Loader`
   - sites: `WebSection`, `WebSectionTitle`, `WebHeroTitle`
2. **Use it as it is.** Pass props and variants; don't override its spacing, radius, colour or type with classes on the page.
3. **If it doesn't fit, change the part.** Add a variant or prop, or add a new part (both React and rc-* forms). Never copy its markup and adjust it.
4. **If you write the same thing twice, it's a part.** The second copy is the signal: stop and add the part.
5. **Never hand-build** buttons, inputs, selects, tables, cards, headings or section titles. `recanica check` fails them (must in new projects).
6. **Use what's listed, or remove it.** A component nobody uses has untested defaults. Use it where it belongs, or drop it from the library.

### Naming: components in React, rc-* classes elsewhere

Same parts, two forms. Both read the same tokens, so a change to the part changes every use.
- **React** (Next.js, Vite): use the components (`<Page>`, `<PageHeader>`, `<Section>`, `<Surface>`, `<NavItem>`, `<ChoiceCard>`, `<Button>`). Never write their Tailwind classes on the page.
- **No React** (HTML, PHP, WordPress, Rails, Django): use the `@recanica/css` classes. They are named prefixed-BEM:
  - `rc-block` is a part: `rc-btn`, `rc-surface`, `rc-section`, `rc-page-header`, `rc-nav-item`
  - `rc-block__element` is a piece of it: `rc-section__title`, `rc-page-header__title`
  - `rc-block--modifier` is a variant: `rc-btn--brand`, `rc-surface--panel`, `rc-badge--success`
  - layout helpers: `rc-flow` (rhythm), `rc-reading` (width), `rc-stack`, `rc-container`
- **New part:** add it to both forms, in the same commit. Name it after what it *is* (`rc-surface`), never where it's used (`headermain`, `homepage-card`).
- **Copying a class string is not reuse.** If you need the same look twice, it's a part: add it.

## 4. Render it and look (required)

Open the page at **1280px and 375px** (and inside a narrow container if it can be embedded). Check the composition:

- [ ] **Reader order**: what the brief says comes first, visibly comes first. One focal point.
- [ ] **Shared edges**: one right edge per column; text, tables and cards line up.
- [ ] **Balanced columns**: no column far longer than its neighbours; no big empty holes.
- [ ] **Grouping**: one surface per group; space, not extra borders, between groups.
- [ ] **One primary action**; secondary actions quieter or in a menu.
- [ ] **Nothing wraps, overflows or overlaps**; labels on one line, including the label column of tables.
- [ ] **Emphasis matches importance**: the main content isn't styled as secondary (muted), and headings are real landmarks.
- [ ] **Supporting detail is quiet**: metadata, enforcement, "how it works" sit below or behind the main content.

If any box is unchecked, fix the structure (not just the styling) and look again.

## 5. Measure

```bash
npx recanica review <url> --paths <route>   # target 85+, no dimension under 70
npx recanica audit <url> --paths <route>    # 0 must-fix
npx recanica check <files>                  # 0 must-fix
npx recanica slop <files>                   # 0 must-fix: no AI jargon, glass, glows, blur blobs, emoji icons
```

Before you write copy (headlines, empty states, buttons) run it past `npx recanica slop --text "…"` (or MCP `check_copy`).

Every should-finding is either fixed or recorded in `recanica.config.json` "allow" with its reason.

## 6. Record and report

Every UI/UX decision you made that a later page could get wrong goes in the log: `npx recanica decisions new --title "…"`
(what, why, rejected, guard). A mistake you caught and fixed goes in as a trap (`--trap`) with a mechanical guard.
In a guest project, anything you noticed outside your scope goes in `docs/ui/PROPOSALS.md`, at most three per task.


Reply with: the brief's purpose, reader and section order (3–6 lines), the alternatives you rejected and why, the scores,
and the two screenshots. If the user asks "why is it like this?", the answer is already in `docs/pages/<route>.md`.

## E. Explain an existing page

1. Open the page at 1280px and 375px.
2. Reconstruct the brief honestly: purpose, reader, the questions each section answers, in order.
3. For each section say **why it is there and why there** — or say plainly that it isn't justified (habit, default, data shape).
4. List what's weak against the step-4 checklist and `npx recanica review`, and propose the fix with one alternative.
5. Write it to `docs/pages/<route>.md` with `Status: explained` so it can be agreed and reworked later.

Be honest about weak reasoning. "I stacked these because it was the default" is a useful answer; a made-up rationale is not.
