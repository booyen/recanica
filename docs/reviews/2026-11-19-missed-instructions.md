# Why instructions were missed, and what changes

Written 19 Nov 2026, after the sections page shipped as one long scroll with broken spacing, even though spacing and "less is more" had been raised several times.

## What went wrong

1. **The bottom navigation rendered at the top of the page.**
2. **The off-canvas header ran edge to edge** while its neighbours were inset.
3. **Labels were glued to the sections** they described.
4. **49 unrelated full-width sections were stacked in one scroll.**
5. **The page had 42 category chips** for 42 categories of about one item each.
6. **There was no way back** from `/site` to the design system.
7. **Over 30 dead `#` links** sat in sections and examples, after you had asked for footer links without pages to be removed.

## Root causes

**1. Instructions were treated as tasks, not principles.**
"Spacing in small spaces" was fixed where you pointed (stat panels, page header) and turned into an audit rule. But when building *new* pages (UI kit, forms, sections), I fell back to my default pattern: one long stacked page. The principle was in the rules file, but it was not part of how I build.

**2. Verification measured the wrong thing, and I reported it as if it covered everything.**
The layout audit checks each element on its own: overflow, wrapped labels, clipped text. It cannot see *composition*:
- inconsistent widths between stacked sections
- a fixed bottom bar landing in the wrong place
- missing space between a caption and the block it describes
- rows holding a single card

I reported "645 passed", which sounded like "it looks right". It only meant "nothing overflows". I didn't take a desktop screenshot of the sections page and look at it.

**3. Coverage was prioritised over curation.**
Long multi-point requests plus messages mid-work pushed me to touch every item quickly. The result shows it:
- "every section on one page" instead of "each section shown properly"
- a chip per category even when a category has one item

**4. Your taste rules were lost when context was compacted.**
The summary after compaction recorded *what was built*, not your exact words ("less is more", "compacted, stacked like this is not our values"). The saved memory was also stale: it still said mesh/chrome were optional. So the next stretch of work ran without those constraints in view.

**5. Sections were rendered in the wrong environment.**
Web sections are built as full pages: sticky headers, viewport-fixed bars, full-bleed backgrounds. Rendered inline in one document, those assumptions collide. The isolated renderer already existed (`/view/web/<slug>`, used by the docs), and I didn't reuse it.

**6. I defaulted to the shadcn docs pattern instead of your reference.**
You described buying a template. Template stores show each block on its own page, with device toggles and next/previous. I built what I'm used to, not what you described.

**7. I didn't apply your workflow to my own work.**
You asked for "mockup first, confirm what's wanted". I put that into the rules for other projects, then skipped it when building the UI kit and sections pages.

## What changes

These are mechanisms rather than promises: each one is in a file that runs or is read every time.

| Fix | Where |
|---|---|
| Each web section has its own page (`/site/sections/<slug>`): isolated frame, mobile/tablet/desktop toggle, previous/next, code link. The index is a thumbnail grid. | `app/site/sections/*`, `components/site/section-viewer.tsx` |
| Showcase rule: never stack unrelated full-width sections in one scroll; don't group when groups hold one item. | `docs/ai/rules.template.md` |
| A floating page menu (⌘J) on every demo page, with "Back to the design system" first. The site header also links back to the docs. | `components/demo/page-menu.tsx`, `components/site/chrome.tsx` |
| Link check: crawls about 320 pages and fails on 404s and `#` links. | `tests/links.spec.ts` |
| UX audit: unnamed controls, tap targets under 24px, unlabelled fields, duplicate ids. | `tests/ux.spec.ts` |
| Your corrections saved as standing memory, loaded at the start of every session. | memory: `recanica-working-rules` |
| How results are reported: always say what a check does *not* cover, and include a screenshot of each new page type at desktop and mobile before calling it done. | memory: `recanica-working-rules` |
| Large requests: finish one item, look at it in the browser, then start the next. | memory: `recanica-working-rules` |
