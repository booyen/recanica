import { examples } from "@/__registry__";
import { highlight, readSource } from "@/lib/highlight";
import { PreviewTabs } from "./preview-tabs";

export async function ComponentPreview({ slug }: { slug: string }) {
  const Example = examples[slug];
  const raw = await readSource(`examples/${slug}-demo.tsx`);
  const html = await highlight(raw);
  return <PreviewTabs preview={Example ? <Example /> : null} html={html} raw={raw} />;
}
