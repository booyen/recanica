# Design language · `/docs/design-language`

Status: explained · Updated: 2026-11-20

**Purpose:** say what Recanica believes and what to do about it, so a person or an AI can apply it to any page.

**Reader:**
- Most often a designer or developer starting on Recanica, or an AI tool loading the rules.
- Second, someone mid-build checking one principle.
- Third, a maintainer checking how a rule is enforced.

**Their questions, in order**
1. What are the principles? (scan, about 10 seconds)
2. What do I do to follow principle X? (look up one)
3. How strict is each rule, and what can my project change?
4. How do I adopt this in a new or existing project?
5. How is it enforced, and where did it come from? (maintainers)

**Main action:** none, it's a reference page. Success is the reader knowing what to do.

**Page type → pattern:** reference/docs → DocsPageHeader, reading column (max-w-3xl), H2 sections.

**Structure**
| # | Section | Answers | Why here |
|---|---|---|---|
| 1 | Principles (overview list) | Q1 | First question; the whole language fits on one screen. Calm is first and marked Mandatory |
| 2 | Applying them | Q2 | Right after the overview; each overview row links here |
| 3 | In a new project / levels / responsive type / good page / existing project / layouts | Q3–Q4 | Practical use, after the principles are known |
| 4 | How it's enforced | Q5 | Maintainer detail, so it goes last |
| 5 | Where these ideas come from | Q5 | Provenance, last |

**Left out on purpose:**
- Rule IDs and token names: they live in GOVERNANCE.md and the CLI docs.
- Component examples: they live in the component pages.

**Alternatives rejected**
- Three columns per principle (rules / built / checked): uneven column lengths left holes, and it mixed readers and maintainers. This was the first version.
- A 2×4 grid of cards: 2–5 rules each, so uneven heights.
- Accordions: they hide the rules, which are the point.

**Width and adapting:** one reading column (48rem) for everything. At 375px the overview rows stack the name above the summary.

## Honest review of "Applying them" (as built)

What I decided, and why:
- **H3 per principle with a bullet list, one column.** This one is justified: a reader looking up one principle scans for the heading, then reads short single-idea rules. One column keeps one right edge, and it matches the overview the user chose.

What was habit, not reasoning:
- **Rules in muted grey.** In this section the rules ARE the main content, yet they're the quietest text on the page. I applied the docs default (paragraphs are muted) without asking what this section is for. Muted is for supporting text.
- **Headings barely stand out.** Each H3 is the same size as the rules and only slightly brighter. With 8 groups and about 30 bullets, the landmarks are too weak to scan, so it reads as one long list.
- **It repeats the overview's structure without its advantage.** The overview already uses "name on the left, text on the right". The detail switches to a stacked heading over a list, so the eye has to re-learn the layout halfway down.

**Proposed fix:**
- Use the same "label left, content right" rows as the overview: principle name in a fixed left column on desktop, rules on the right in normal foreground text, and a hairline divider between principles. This halves the length on desktop and gives strong landmarks. It stacks to heading-then-list at 375px.
- Alternative: keep the stacked layout, but make the rules foreground and give each heading a real step up (text-lg), with more space above each group.

**Check:** review 100 (the review doesn't measure emphasis inversion: muted main content). Screenshots at 1280 and 375 looked at ✓.
