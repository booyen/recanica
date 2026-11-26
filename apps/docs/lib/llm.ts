import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import catalog from "./catalog.json";
import { blocks, components, patterns, web } from "./docs";

/** Public base URL for links inside prompts. Placeholder until a domain is chosen. */
export const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://recanica.aturanica.com";

const TOKENS = join(process.cwd(), "../../packages/tokens");

/**
 * One self-contained stylesheet: generated variables + Tailwind scale + theme wiring.
 * (theme.css imports the generated files; inline them so a single paste works anywhere.)
 */
export function tokensCss() {
  const read = (f: string) => readFileSync(join(TOKENS, f), "utf8").trim();
  return [read("generated/css/variables.css"), read("generated/css/tailwind-theme.css"), read("theme.css").replace(/^@import "\.\/generated\/[^"]+";\n/gm, "")].join("\n\n");
}

type ColorRow = { token: string; light: string; dark: string };

/** Semantic colors with resolved hex values, from the generated token JSON. */
export function colorTable(): ColorRow[] {
  const t = JSON.parse(readFileSync(join(TOKENS, "generated/json/tokens.json"), "utf8")) as { color: { light: Record<string, string>; dark: Record<string, string> } };
  const kebab = (k: string) => k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase()).replace(/(\D)(\d)/g, "$1-$2");
  return Object.keys(t.color.light).map((k) => ({ token: kebab(k), light: t.color.light[k], dark: t.color.dark[k] }));
}

/* ---------- The brand guide: the single block every prompt embeds ---------- */

export function brandGuide() {
  const colors = colorTable()
    .map((c) => `| --${c.token} | ${c.light} | ${c.dark} |`)
    .join("\n");
  const template = readFileSync(join(process.cwd(), "../../docs/ai/rules.template.md"), "utf8").replace(/^<!--[\s\S]*?-->\n/, "").replace(/ <!-- copy-lint-ignore[^>]*-->/g, "");
  return template.replace("{{COLOR_TABLE}}", colors);
}

export function componentIndex() {
  return components.map((c) => `- ${c.title} — ${c.description} \`import { … } from "@recanica/ui/components/${c.slug}"\``).join("\n");
}

export function patternIndex() {
  return [
    ...patterns.map((p) => `- Pattern · ${p.title} — ${p.description} (${SITE}/r/${p.slug}.json)`),
    ...blocks.map((b) => `- Block · ${b.title} — ${b.description} (${SITE}/r/${b.slug}.json)`),
    ...web.map((w) => `- Web · ${w.category} · ${w.slug} — ${w.description}${w.use ? ` When: ${w.use}` : ""} (${SITE}/r/${w.slug}.json)`),
  ].join("\n");
}

export function recipesIndex() {
  return catalog.webRecipes.map((r) => `- ${r.page}: ${r.sections.join(" → ")}${r.notes ? ` (${r.notes})` : ""}`).join("\n");
}

export function appLibraryIndex() {
  return catalog.appLibrary.map((c) => `- ${c.category}: ${c.description} → ${c.items.map((i) => i.label).join(", ")}`).join("\n");
}

/* ---------- Copy-paste prompts ---------- */

export type LlmPrompt = { id: string; title: string; when: string; body: string };

export function prompts(): LlmPrompt[] {
  const guide = brandGuide();
  const css = tokensCss();

  return [
    {
      id: "apply",
      title: "Apply Recanica to this project",
      when: "Paste into Claude Code, Cursor, Codex or any coding agent at the root of an existing project. It restyles the app to Recanica.",
      body: `You are restyling this project to the Recanica design system (UI framework by Aturanica Labs).
The rules, tokens and setup are all in this message; do not invent extra brand rules.

## Your task
1. Inspect the project first: framework, styling approach (Tailwind v3/v4, CSS modules, styled-components, plain CSS…), component library, where global styles and the root layout live. Summarize what you found in 3–5 bullets before changing anything.
2. Install the tokens:
   - Tailwind v4: create \`recanica.css\` with the token file below and import it after \`@import "tailwindcss";\` in the global stylesheet.
   - Tailwind v3 / other: copy tier 1 and tier 2 (the :root and .dark CSS variables) into the global stylesheet and map them in the Tailwind config (colors → var(--token), borderRadius, fontFamily). Skip the @theme / @utility / @custom-variant blocks.
   - No Tailwind: keep the CSS variables and write equivalent utility classes or component styles that reference them.
3. Fonts: load Geist and Geist Mono (next/font/google in Next.js, otherwise Google Fonts) and expose them as --font-geist-sans / --font-geist-mono.
4. Theme: default to dark (class="dark" on <html>, or the project's existing theme switcher). Set on <html>.
5. Restyle existing components to the rules below, starting with the shared ones (button, input, card, table, nav/sidebar, dialog). Prefer changing shared components over individual pages. If the project uses shadcn/ui, keep its APIs and only change classes.
6. Rework the main layout into the Recanica app shell or landing structure where it fits, without changing routes or behavior.
7. Do not change business logic, data fetching, routes or copy. Visual changes only.
8. When done, list every file you changed and anything you could not map.

## Acceptance checklist
- No hard-coded colors left in components; everything uses semantic tokens.
- No font-semibold / font-bold.
- Buttons and tabs are pills; cards/panels rounded-2xl with 1px borders and no shadows.
- Works at 375px wide with no horizontal scroll; sidebars collapse into a sheet below 768px.
- Dark and light mode both look correct.

${guide}
## Token file (recanica.css — Tailwind v4)
\`\`\`css
${css}
\`\`\`
`,
    },
    {
      id: "brand",
      title: "Brand & style only (any stack)",
      when: "For non-web or non-Tailwind projects (Flutter, SwiftUI, React Native, Figma, slides, email). The LLM gets the visual language and hex values only.",
      body: `Adopt the Recanica visual language (by Aturanica Labs) in this project.
Translate the rules and tokens below into this project's native theming system (e.g. ThemeData in Flutter, Color assets in SwiftUI, a theme object in React Native, variables in Figma).
Create a single theme/tokens file first, then apply it to existing screens. Do not change behavior or copy.
Report the file you created and the screens you updated.

${guide}`,
    },
    {
      id: "build",
      title: "Build a screen with Recanica",
      when: "For a project that already has Recanica installed. Replace the bracketed part with what you want built.",
      body: `Build the following screen using Recanica (@recanica/ui + @recanica/tokens):

[DESCRIBE THE SCREEN — e.g. "A customers page with a search field, a status filter, a table of customers (name, email, plan, MRR), and a detail sheet when a row is clicked."]

Requirements:
- Use only components from @recanica/ui (import from "@recanica/ui/components/<name>") and Tailwind classes that reference Recanica tokens. No new colors, no inline hex.
- Follow the closest existing pattern or block from the index below and adapt it instead of starting from scratch.
- Mobile-first: correct at 375px, sidebars as sheets below md, secondary table columns hidden on small screens.
- Include empty, loading and error states.
- Use realistic placeholder data in a local array. No network calls unless asked.

## Available components
${componentIndex()}

## Patterns, blocks and web sections you can start from
${patternIndex()}

## Website page recipes (section order)
${recipesIndex()}

## Dashboard / portal page types
${appLibraryIndex()}

${guide}`,
    },
    {
      id: "audit",
      title: "Audit UI against Recanica",
      when: "Paste with a screenshot or a component file. The LLM returns a prioritized list of fixes.",
      body: `Review the attached UI (screenshot or code) against the Recanica design rules below.
Return a prioritized list (most visible first). For each issue: what's wrong, the rule it breaks, and the exact fix (class names or token names).
Check specifically: hue usage, font weights, radius (pills vs rounded-2xl), borders vs shadows, surface layering, spacing rhythm, one-brand-moment, mobile behavior at 375px, empty/loading states.
Finish with a 0–10 score for "feels like Recanica".

${guide}`,
    },
    {
      id: "rules",
      title: "Rules file (CLAUDE.md / .cursorrules / AGENTS.md)",
      when: "Save this as CLAUDE.md, AGENTS.md or .cursor/rules/recanica.mdc in a project so every future AI session follows Recanica automatically.",
      body: `# UI: Recanica

This project uses Recanica, the UI framework by Aturanica Labs. Follow these rules for every UI change.

- Components: import from "@recanica/ui/components/<name>". Do not hand-roll a component that exists there.
- Styling: Tailwind classes that reference Recanica tokens only (bg-background, bg-panel, bg-card, bg-accent, text-foreground, text-muted-foreground, border, p-panel, px-gutter, gap-stack, text-title, text-heading, text-metric…). Never hard-code colors.
- Brand surfaces: bg-brand text-brand-foreground or text-brand. One brand moment per screen.
- Docs for every component, pattern and block: ${SITE}/docs · machine-readable: ${SITE}/llms-full.txt
- Before building a new screen, check the patterns and blocks index and start from the closest one.

${guide}`,
    },
  ];
}

/** Short markdown used by the "Copy for LLM" button on component/pattern/block pages. */
export function pageContext(kind: "component" | "pattern" | "block", title: string, description: string, code: string) {
  const intro =
    kind === "component"
      ? `Use the Recanica **${title}** component (@recanica/ui). ${description}`
      : `Recreate the Recanica **${title}** ${kind} in this project. ${description}`;
  return `${intro}

Follow Recanica's rules: calm, semantic tokens only (the project's --brand is the one accent), regular/light type (no bold), pill buttons, rounded-2xl bordered surfaces without shadows, mobile-first.
Full rules: ${SITE}/llms-full.txt

Reference implementation:
\`\`\`tsx
${code}
\`\`\`
`;
}
