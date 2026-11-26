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

server.registerTool("get_page_anatomy", {
  title: "How a page is built",
  description: "For a page type (overview, list, detail, form, settings, sign-in, checkout, landing, article, docs): its shell, its regions in reading order and the exact part for each, plus the parts table (React component + rc-* class). Call before building any page.",
  inputSchema: { type: z.string().optional().describe("Page type, e.g. 'list' or 'checkout'. Omit for all types.") },
}, async ({ type }) => {
  const a = data.anatomy;
  const types = type ? a.types.filter((t) => t.type.toLowerCase().includes(type.toLowerCase())) : a.types;
  const out = [
    "# Page anatomy", "", ...a.thinking, "",
    ...types.flatMap((t) => [`## ${t.type}`, t.use, `Shell: ${t.shell}`, ...t.regions.map((r) => `- ${r.region}: ${r.part}${r.note ? ` (${r.note})` : ""}`), ""]),
    "## Parts (React · CSS)", ...data.parts.map((p) => `- ${p.part}: ${p.react} · .${p.css}`),
  ];
  return { content: [{ type: "text", text: out.join("\n") }] };
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

server.registerTool("get_kickoff_questions", {
  title: "Kickoff questionnaire",
  description: "The questions to ask the human at the start of every new project (role, scope, stack, flexibility, definition of done), with defaults and the reason for each. Ask them one group at a time, then save the answers as JSON and run `npx recanica kickoff --answers <file>`.",
  inputSchema: {},
}, async () => text((data.kickoff ?? []).map((q) => `- ${q.id} [${q.group}] ${q.q}${q.options ? `\n  options: ${q.options.map((o) => (typeof o === "string" ? o : o.value)).join(" | ")}` : ""}\n  default: ${JSON.stringify(q.default)} · why: ${q.why}${q.askIf ? ` · ask only if ${q.askIf}` : ""}`).join("\n")));

server.registerTool("check_copy", {
  title: "Check copy for AI slop",
  description: "Check a piece of UI copy (headline, button, empty state, PR text, decision entry) against Recanica's copy rules: AI jargon, hype, assistant voice, placeholder text. Run it on your own words before writing them.",
  inputSchema: { text: z.string().describe("The copy to check") },
}, async ({ text: t }) => {
  const hits = [];
  for (const [src, flags, msg, level] of data.copyRules ?? []) { const m = t.match(new RegExp(src, flags)); if (m) hits.push(`${level === "error" ? "must-fix" : "should"}: "${m[0]}" ${msg}`); }
  return text(hits.length ? hits.join("\n") : "No slop found. (This finds generic phrasing; it can't judge whether the copy is specific to the reader.)");
});

server.registerPrompt("apply-recanica", {
  title: "Apply Recanica to this project",
  description: "Adopt Recanica in an existing project: review busy pages, agree a rework plan, rebuild pages from Recanica patterns (not a reskin).",
  argsSchema: {
    stack: z.string().optional().describe("Known stack, e.g. nextjs, flutter. Leave empty to detect."),
    mode: z.enum(["rework", "reskin"]).optional().describe("rework (default): restructure pages. reskin: tokens and colours only."),
  },
}, ({ stack, mode }) => ({
  messages: [{
    role: "user",
    content: {
      type: "text",
      text: (mode === "reskin" ? [
        "Reskin this project with Recanica tokens only (colours, type, radius). Keep layouts and behaviour.",
        stack ? `The stack is ${stack}.` : "First tell me the stack and where global styles live.",
        "Install tokens (call get_setup), restyle shared components, run `npx recanica check`, list changed files.",
      ] : [
        "Adopt Recanica in this project. This is a REWORK, not a reskin: pages should end up calmer and simpler, not just recoloured.",
        stack ? `The stack is ${stack}.` : "First tell me the stack, styling approach and where global styles live.",
        "1. Install tokens and components for this stack (call get_setup).",
        "2. Start the dev server and run `npx recanica review <url> --crawl`. Read recanica-review.md.",
        "3. For each page, busiest first: tell me what the page is for, the one action that matters, what you would keep, change, merge or remove, and which Recanica pattern it becomes (call get_page_library / get_pattern). Wait for my answer before changing that page.",
        "4. Rebuild agreed pages from the pattern with Recanica components. Don't restyle the old markup. Remove what we agreed to remove.",
        "5. After each page: `npx recanica review` (no busy signals), `npx recanica check`, `npx recanica audit`. Show me the before/after list of what changed.",
      ]).concat(["", "Follow these rules exactly:", "", data.rules]).join("\n"),
    },
  }],
}));

server.registerPrompt("recanica-page", {
  title: "Design or explain a page the Recanica way",
  description: "Write a page brief (purpose, reader, their questions in order, structure, alternatives rejected) before building; check the rendered page; or explain why an existing page is laid out as it is.",
  argsSchema: {
    route: z.string().describe("The page route, e.g. /dashboard/invoices"),
    mode: z.enum(["build", "explain"]).optional().describe("build (default): new page, redesign or rework. explain: reconstruct the reasoning of an existing page."),
  },
}, ({ route, mode }) => ({
  messages: [{
    role: "user",
    content: {
      type: "text",
      text: [
        mode === "explain"
          ? `Explain the page ${route}: follow step E of the skill below. Be honest where the reasoning is weak.`
          : `Design the page ${route}: follow steps 1–6 of the skill below. Write the brief and show it to me before building.`,
        "Brief template:",
        "",
        data.skills["recanica-page"]["brief-template.md"],
        "",
        data.skills["recanica-page"]["SKILL.md"],
        "",
        "Recanica rules:",
        data.rules,
      ].join("\n"),
    },
  }],
}));

await server.connect(new StdioServerTransport());
