// Starts the server over stdio and calls every tool once.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { join } from "node:path";

const client = new Client({ name: "smoke", version: "0.0.0" });
await client.connect(new StdioClientTransport({ command: process.execPath, args: [join(import.meta.dirname, "../src/index.js")] }));
const { tools } = await client.listTools();
console.log("tools:", tools.map((t) => t.name).join(", "));
const call = async (name, args = {}) => {
  const r = await client.callTool({ name, arguments: args });
  const t = r.content[0].text;
  console.log(`✓ ${name}(${JSON.stringify(args)}) → ${t.length} chars · ${t.split("\n")[0].slice(0, 70)}`);
  return t;
};
await call("get_rules");
await call("get_tokens", { format: "flutter" });
await call("list_components", { category: "Forms" });
await call("get_component", { name: "button" });
await call("list_patterns", { kind: "block" });
await call("get_pattern", { name: "invoices-01" });
await call("search", { query: "invoice payment plan" });
await call("list_patterns", { kind: "web", category: "Hero" });
await call("get_recipe", { page: "product" });
await call("get_page_library");
await call("get_setup", { stack: "html" });
const { prompts } = await client.listPrompts();
console.log("prompts:", prompts.map((p) => p.name).join(", "));
const p = await client.getPrompt({ name: "apply-recanica", arguments: { stack: "nextjs" } });
console.log(`✓ apply-recanica → ${p.messages[0].content.text.length} chars`);
await client.close();
