// Builds data/recanica.json: a self-contained snapshot of everything the MCP server serves.
// Sources: docs/ai/rules.template.md, packages/tokens/generated, packages/ui, apps/docs (catalog, demos, registry), docs/guides.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const repo = join(import.meta.dirname, "../../..");
const read = (...p) => readFileSync(join(repo, ...p), "utf8");
const maybe = (...p) => (existsSync(join(repo, ...p)) ? read(...p) : null);

const tokensJson = JSON.parse(read("packages/tokens/generated/json/tokens.json"));
const kebab = (k) => k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase()).replace(/(\D)(\d)/g, "$1-$2");
const colorTable = Object.keys(tokensJson.color.light)
  .map((k) => `| --${kebab(k)} | ${tokensJson.color.light[k]} | ${tokensJson.color.dark[k]} |`)
  .join("\n");
const rules = read("docs/ai/rules.template.md").replace(/^<!--[\s\S]*?-->\n/, "").replace(/ <!-- copy-lint-ignore[^>]*-->/g, "").replace("{{COLOR_TABLE}}", colorTable);

const catalog = JSON.parse(read("apps/docs/lib/catalog.json"));
const uiFile = (slug) => maybe("packages/ui/src/components", `${slug}.tsx`);

const data = {
  version: JSON.parse(read("packages/mcp/package.json")).version,
  builtAt: new Date().toISOString(),
  site: "https://recanica.aturanica.com",
  rules,
  tokens: {
    json: tokensJson,
    css: read("packages/tokens/generated/css/variables.css"),
    "tailwind-v4": [read("packages/tokens/generated/css/tailwind-theme.css"), read("packages/tokens/theme.css")].join("\n\n"),
    "tailwind-v3": read("packages/tokens/generated/tailwind/preset.cjs"),
    flutter: read("packages/tokens/generated/flutter/recanica_tokens.dart"),
    swiftui: read("packages/tokens/generated/ios/RecanicaTokens.swift"),
    compose: read("packages/tokens/generated/android/RecanicaTokens.kt"),
    figma: read("packages/tokens/generated/figma/tokens-studio.json"),
    "plain-css": maybe("packages/css/dist/recanica.css"),
  },
  components: catalog.components.map((c) => ({
    ...c,
    import: `@recanica/ui/components/${c.slug}`,
    source: uiFile(c.slug),
    example: maybe("apps/docs/examples", `${c.slug}-demo.tsx`),
  })),
  patterns: [
    ...catalog.patterns.map((p) => ({ ...p, kind: "pattern", install: `npx shadcn@latest add https://recanica.aturanica.com/r/${p.slug}.json`, source: read("apps/docs/registry/patterns", `${p.slug}.tsx`) })),
    ...catalog.blocks.map((b) => ({ ...b, kind: "block", install: `npx shadcn@latest add https://recanica.aturanica.com/r/${b.slug}.json`, source: read("apps/docs/registry/blocks", `${b.slug}.tsx`) })),
    ...catalog.web.map((w) => ({ ...w, kind: "web", install: `npx shadcn@latest add https://recanica.aturanica.com/r/${w.slug}.json`, source: read("apps/docs/registry/web", `${w.slug}.tsx`) })),
  ],
  appLibrary: catalog.appLibrary,
  webRecipes: catalog.webRecipes,
  guides: Object.fromEntries(
    readdirSync(join(repo, "docs/guides")).filter((f) => f.endsWith(".md")).map((f) => [f.replace(/\.md$/, ""), read("docs/guides", f)])
  ),
};

mkdirSync(join(import.meta.dirname, "../data"), { recursive: true });
const json = JSON.stringify(data);
writeFileSync(join(import.meta.dirname, "../data/recanica.json"), json);
console.log(`data/recanica.json ${(json.length / 1024).toFixed(0)} KB · ${data.components.length} components · ${data.patterns.length} patterns/blocks/web · ${data.webRecipes.length} recipes · ${Object.keys(data.guides).length} guides`);
