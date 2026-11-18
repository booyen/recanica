#!/usr/bin/env node
/**
 * Rekanica MCP server (stdio).
 *   claude mcp add rekanica -- npx -y @rekanica/mcp
 *   { "mcpServers": { "rekanica": { "command": "npx", "args": ["-y", "@rekanica/mcp"] } } }
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const data = JSON.parse(readFileSync(join(import.meta.dirname, "../data/rekanica.json"), "utf8"));
const text = (t) => ({ content: [{ type: "text", text: t }] });
const fence = (lang, code) => "```" + lang + "\n" + code + "\n```";

const STACKS = {
  nextjs: "setup-nextjs", "vite-react": "setup-vite-react", "tailwind-v3": "setup-tailwind-v3", html: "setup-html",
  flutter: "setup-flutter", swiftui: "setup-swiftui", compose: "setup-compose", figma: "setup-figma",
};
const TOKEN_FORMATS = ["json", "css", "tailwind-v4", "tailwind-v3", "flutter", "swiftui", "compose", "figma", "plain-css"];

const server = new McpServer({ name: "rekanica", version: data.version });

server.registerTool("get_rules", {
  title: "Rekanica design rules",
  description: "The complete Rekanica brand and UI rules (identity, color tokens with hex values, surfaces, type, spacing, shape, components, do/don't). Read this before writing any UI.",
  inputSchema: {},
}, async () => text(data.rules));

server.registerTool("get_tokens", {
  title: "Design tokens",
  description: "Rekanica tokens in a platform format: json (resolved hex), css (variables), tailwind-v4, tailwind-v3 (preset), flutter, swiftui, compose, figma (Tokens Studio), plain-css (full rk-* component stylesheet).",
  inputSchema: { format: z.enum(TOKEN_FORMATS).describe("Output format") },
}, async ({ format }) => {
  const v = data.tokens[format];
  if (!v) return text(`Format ${format} is not available in this build.`);
  return text(typeof v === "string" ? v : JSON.stringify(v, null, 2));
});

server.registerTool("list_components", {
  title: "List components",
  description: "All @rekanica/ui React components with category, description and import path.",
  inputSchema: { category: z.string().optional().describe("Filter by category, e.g. Forms, Overlays") },
}, async ({ category }) => {
  const list = data.components.filter((c) => !category || c.category.toLowerCase() === category.toLowerCase());
  return text(list.map((c) => `- ${c.slug} (${c.category}): ${c.description}  import from "${c.import}"`).join("\n"));
});

server.registerTool("get_component", {
  title: "Get component",
  description: "Source code and a usage example for one @rekanica/ui component.",
  inputSchema: { name: z.string().describe("Component slug, e.g. button, dialog, stat, data-table is a pattern") },
}, async ({ name }) => {
  const c = data.components.find((x) => x.slug === name.toLowerCase() || x.title.toLowerCase() === name.toLowerCase());
  if (!c) return text(`No component "${name}". Use list_components or search.`);
  return text([`# ${c.title}`, c.description, `Import: \`${c.import}\``, "## Example", fence("tsx", c.example ?? "(none)"), "## Source", fence("tsx", c.source ?? "(source not bundled)")].join("\n\n"));
});

server.registerTool("list_patterns", {
  title: "List patterns and blocks",
  description: "Composed app patterns (data table, list/detail, settings, auth, invoices…) and marketing/app blocks, with install commands.",
  inputSchema: { kind: z.enum(["pattern", "block", "all"]).default("all") },
}, async ({ kind }) => {
  const list = data.patterns.filter((p) => kind === "all" || p.kind === kind);
  return text(list.map((p) => `- ${p.slug} [${p.kind}/${p.category}]: ${p.description}`).join("\n"));
});

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
  title: "Search Rekanica",
  description: "Keyword search across components, patterns, blocks and guides.",
  inputSchema: { query: z.string() },
}, async ({ query }) => {
  const q = query.toLowerCase().split(/\s+/).filter(Boolean);
  const score = (s) => q.reduce((n, w) => n + (s.toLowerCase().includes(w) ? 1 : 0), 0);
  const hits = [
    ...data.components.map((c) => ({ s: score(`${c.slug} ${c.title} ${c.description} ${c.category}`) * 2, line: `component ${c.slug}: ${c.description}` })),
    ...data.patterns.map((p) => ({ s: score(`${p.slug} ${p.title} ${p.description} ${p.category}`) * 2, line: `${p.kind} ${p.slug}: ${p.description}` })),
    ...Object.entries(data.guides).map(([k, v]) => ({ s: score(v), line: `guide ${k}` })),
  ].filter((h) => h.s > 0).sort((a, b) => b.s - a.s).slice(0, 15);
  return text(hits.length ? hits.map((h) => `- ${h.line}`).join("\n") : "No matches.");
});

server.registerTool("get_setup", {
  title: "Setup guide",
  description: `How to install Rekanica in a project. Stacks: ${Object.keys(STACKS).join(", ")}, ai.`,
  inputSchema: { stack: z.enum([...Object.keys(STACKS), "ai", "overview"]) },
}, async ({ stack }) => {
  const key = stack === "overview" ? "README" : stack === "ai" ? "ai" : STACKS[stack];
  return text(data.guides[key] ?? `No guide for ${stack}.`);
});

server.registerPrompt("apply-rekanica", {
  title: "Apply Rekanica to this project",
  description: "Restyle the current project to Rekanica (detects the stack, installs tokens, updates shared components).",
  argsSchema: { stack: z.string().optional().describe("Known stack, e.g. nextjs, flutter. Leave empty to detect.") },
}, ({ stack }) => ({
  messages: [{
    role: "user",
    content: {
      type: "text",
      text: [
        "Restyle this project to the Rekanica design system (UI framework by Aturanica Labs).",
        stack ? `The stack is ${stack}.` : "First inspect the project and tell me its stack, styling approach and where global styles live.",
        "Then: install the tokens for this stack (call get_setup), load Geist, default to dark mode with data-finish=\"flat\",",
        "restyle shared components first (button, input, card, table, nav, dialog), keep behavior/routes/copy unchanged,",
        "check 375px width has no horizontal scroll, and list every changed file. Follow these rules exactly:",
        "",
        data.rules,
      ].join("\n"),
    },
  }],
}));

await server.connect(new StdioServerTransport());
