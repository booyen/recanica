#!/usr/bin/env node
/**
 * Recanica MCP server (stdio).
 *   claude mcp add recanica -- npx -y @recanica/mcp
 *   { "mcpServers": { "recanica": { "command": "npx", "args": ["-y", "@recanica/mcp"] } } }
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const data = JSON.parse(readFileSync(join(import.meta.dirname, "../data/recanica.json"), "utf8"));
const text = (t) => ({ content: [{ type: "text", text: t }] });
const fence = (lang, code) => "```" + lang + "\n" + code + "\n```";

const STACKS = {
  nextjs: "setup-nextjs", "vite-react": "setup-vite-react", "tailwind-v3": "setup-tailwind-v3", html: "setup-html",
  flutter: "setup-flutter", swiftui: "setup-swiftui", compose: "setup-compose", figma: "setup-figma",
};
const TOKEN_FORMATS = ["json", "css", "tailwind-v4", "tailwind-v3", "flutter", "swiftui", "compose", "figma", "plain-css"];

const server = new McpServer({ name: "recanica", version: data.version });

server.registerTool("get_rules", {
  title: "Recanica design rules",
  description: "The complete Recanica brand and UI rules (identity, color tokens with hex values, surfaces, type, spacing, shape, components, do/don't). Read this before writing any UI.",
  inputSchema: {},
}, async () => text(data.rules));

server.registerTool("get_tokens", {
  title: "Design tokens",
  description: "Recanica tokens in a platform format: json (resolved hex), css (variables), tailwind-v4, tailwind-v3 (preset), flutter, swiftui, compose, figma (Tokens Studio), plain-css (full rc-* component stylesheet).",
  inputSchema: { format: z.enum(TOKEN_FORMATS).describe("Output format") },
}, async ({ format }) => {
  const v = data.tokens[format];
  if (!v) return text(`Format ${format} is not available in this build.`);
  return text(typeof v === "string" ? v : JSON.stringify(v, null, 2));
});

server.registerTool("list_components", {
  title: "List components",
  description: "All @recanica/ui React components with category, description and import path.",
  inputSchema: { category: z.string().optional().describe("Filter by category, e.g. Forms, Overlays") },
}, async ({ category }) => {
  const list = data.components.filter((c) => !category || c.category.toLowerCase() === category.toLowerCase());
  return text(list.map((c) => `- ${c.slug} (${c.category}): ${c.description}  import from "${c.import}"`).join("\n"));
});

server.registerTool("get_component", {
  title: "Get component",
  description: "Source code and a usage example for one @recanica/ui component.",
  inputSchema: { name: z.string().describe("Component slug, e.g. button, dialog, stat, data-table is a pattern") },
}, async ({ name }) => {
  const c = data.components.find((x) => x.slug === name.toLowerCase() || x.title.toLowerCase() === name.toLowerCase());
  if (!c) return text(`No component "${name}". Use list_components or search.`);
  return text([`# ${c.title}`, c.description, `Import: \`${c.import}\``, "## Example", fence("tsx", c.example ?? "(none)"), "## Source", fence("tsx", c.source ?? "(source not bundled)")].join("\n\n"));
});

server.registerTool("list_patterns", {
  title: "List patterns, blocks and web sections",
  description: "App patterns (data table, list/detail, settings, auth…), app blocks (shell, invoices) and the web library (49 website sections in 42 categories: headers, heroes, blog, shop, property, careers, events, utility pages). Includes when-to-use notes.",
  inputSchema: { kind: z.enum(["pattern", "block", "web", "all"]).default("all"), category: z.string().optional().describe("e.g. Hero, Pricing, Single product") },
}, async ({ kind, category }) => {
  const list = data.patterns.filter((p) => (kind === "all" || p.kind === kind) && (!category || p.category.toLowerCase() === category.toLowerCase()));
  return text(list.map((p) => `- ${p.slug} [${p.kind}/${p.category}]: ${p.description}${p.use ? ` When: ${p.use}` : ""}`).join("\n") || "No matches.");
});

server.registerTool("get_recipe", {
  title: "Website page recipes",
  description: "Ordered section lists for common website pages (SaaS landing, lead-gen, about, blog, shop, product, checkout, property, events, careers, contact, 404…). Use this to compose a page from web sections.",
  inputSchema: { page: z.string().optional().describe("Page type, e.g. 'landing', 'product page'. Empty lists all.") },
}, async ({ page }) => {
  const list = data.webRecipes.filter((r) => !page || r.page.toLowerCase().includes(page.toLowerCase()));
  return text(list.map((r) => `## ${r.page}\n${r.sections.map((s, i) => `${i + 1}. ${s}`).join("\n")}${r.notes ? `\nNotes: ${r.notes}` : ""}`).join("\n\n") || "No recipe matches. Call without arguments to list all.");
});

server.registerTool("get_page_library", {
  title: "Dashboard / portal page library",
  description: "Common dashboard and customer-portal page types (auth, overview, reports, tables, detail, forms, settings, team & roles, notifications, audit log, developers, integrations, tasks, calendar, files, support, empty states, customer portal) and which Recanica patterns/components implement each.",
  inputSchema: {},
}, async () => text(data.appLibrary.map((c) => `## ${c.category}\n${c.description}\n${c.items.map((i) => `- ${i.kind}: ${i.label} (${data.site}${i.href})`).join("\n")}`).join("\n\n")));

server.registerTool("get_pattern", {
  title: "Get pattern or block",
  description: "Full source of a pattern or block, plus its install command. Adapt it rather than starting from scratch.",
  inputSchema: { name: z.string().describe("Slug, e.g. data-table, invoices-01, hero-01") },
}, async ({ name }) => {
  const p = data.patterns.find((x) => x.slug === name.toLowerCase());
  if (!p) return text(`No pattern or block "${name}". Use list_patterns or search.`);
  return text([`# ${p.title} (${p.kind})`, p.description, `Install: \`${p.install}\``, fence("tsx", p.source)].join("\n\n"));
});

server.registerTool("search", {
  title: "Search Recanica",
  description: "Keyword search across components, patterns, blocks and guides.",
  inputSchema: { query: z.string() },
}, async ({ query }) => {
  const q = query.toLowerCase().split(/\s+/).filter(Boolean);
  const score = (s) => q.reduce((n, w) => n + (s.toLowerCase().includes(w) ? 1 : 0), 0);
  const hits = [
    ...data.components.map((c) => ({ s: score(`${c.slug} ${c.title} ${c.description} ${c.category}`) * 2, line: `component ${c.slug}: ${c.description}` })),
    ...data.patterns.map((p) => ({ s: score(`${p.slug} ${p.title} ${p.description} ${p.category} ${p.use ?? ""}`) * 2, line: `${p.kind} ${p.slug}: ${p.description}` })),
    ...data.webRecipes.map((r) => ({ s: score(`${r.page} ${r.notes}`) * 2, line: `recipe "${r.page}": ${r.sections.join(" → ")}` })),
    ...Object.entries(data.guides).map(([k, v]) => ({ s: score(v), line: `guide ${k}` })),
  ].filter((h) => h.s > 0).sort((a, b) => b.s - a.s).slice(0, 15);
  return text(hits.length ? hits.map((h) => `- ${h.line}`).join("\n") : "No matches.");
});

server.registerTool("get_setup", {
  title: "Setup guide",
  description: `How to install Recanica in a project. Stacks: ${Object.keys(STACKS).join(", ")}, ai.`,
  inputSchema: { stack: z.enum([...Object.keys(STACKS), "ai", "overview"]) },
}, async ({ stack }) => {
  const key = stack === "overview" ? "README" : stack === "ai" ? "ai" : STACKS[stack];
  return text(data.guides[key] ?? `No guide for ${stack}.`);
});

server.registerPrompt("apply-recanica", {
  title: "Apply Recanica to this project",
  description: "Restyle the current project to Recanica (detects the stack, installs tokens, updates shared components).",
  argsSchema: { stack: z.string().optional().describe("Known stack, e.g. nextjs, flutter. Leave empty to detect.") },
}, ({ stack }) => ({
  messages: [{
    role: "user",
    content: {
      type: "text",
      text: [
        "Restyle this project to the Recanica design system (UI framework by Aturanica Labs).",
        stack ? `The stack is ${stack}.` : "First inspect the project and tell me its stack, styling approach and where global styles live.",
        "Before changing code, show me a short mockup plan: the screens you will restyle, the Recanica patterns each maps to,",
        "and anything you would change or drop. Wait for my answer, then:",
        "install the tokens for this stack (call get_setup), load Geist, default to dark mode,",
        "restyle shared components first (button, input, card, table, nav, dialog), keep behavior/routes/copy unchanged,",
        "check 375px, ~900px and 1280px widths (no horizontal scroll, no wrapped button or nav labels),",
        "run `npx recanica check` and fix every error, and list every changed file. Follow these rules exactly:",
        "",
        data.rules,
      ].join("\n"),
    },
  }],
}));

await server.connect(new StdioServerTransport());
