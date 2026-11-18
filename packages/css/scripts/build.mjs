// Bundles token variables + components into dist/rekanica.css (and a minified copy).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const root = join(import.meta.dirname, "..");
const vars = readFileSync(join(root, "../tokens/generated/css/variables.css"), "utf8");
const comps = readFileSync(join(root, "src/components.css"), "utf8");
const out = `/*! Rekanica CSS — UI framework by Aturanica Labs — MIT */\n${vars}\n${comps}`;
const min = out.replace(/\/\*(?!!)[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,>])\s*/g, "$1").replace(/;}/g, "}").trim();
mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist/rekanica.css"), out);
writeFileSync(join(root, "dist/rekanica.min.css"), min + "\n");
console.log(`dist/rekanica.css ${(out.length / 1024).toFixed(1)} KB · min ${(min.length / 1024).toFixed(1)} KB`);
