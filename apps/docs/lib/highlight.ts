import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { codeToHtml } from "shiki";

export async function highlight(code: string, lang = "tsx") {
  return codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark-default" },
    defaultColor: false,
  });
}

/** Read a file relative to the docs app root (build time only). */
export async function readSource(rel: string) {
  return (await readFile(join(process.cwd(), rel), "utf8")).trimEnd();
}

/** Pull `@recanica/ui` import statements out of a source file for the Usage section. */
export function uiImports(src: string) {
  const m = src.match(/import[\s\S]*?from\s+"@recanica\/ui\/[^"]+";?/g) ?? [];
  return m.map((s) => s.replace(/\s+/g, " ").replace("{ ", "{ ").trim()).join("\n");
}
