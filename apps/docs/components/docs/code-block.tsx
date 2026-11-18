import { highlight } from "@/lib/highlight";
import { CodeFrame } from "./code-frame";

/** Server-rendered, shiki-highlighted code with a copy button. */
export async function CodeBlock({ code, lang = "tsx", title, maxHeight }: { code: string; lang?: string; title?: string; maxHeight?: number }) {
  const html = await highlight(code, lang);
  return <CodeFrame html={html} raw={code} title={title} maxHeight={maxHeight} />;
}
