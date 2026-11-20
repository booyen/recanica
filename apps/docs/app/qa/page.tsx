import Link from "next/link";
import { components } from "@/lib/docs";
import { Heading } from "@recanica/ui/components/page";

export default function Page() {
  return (
    <div className="mx-auto max-w-content px-gutter py-8">
      <Heading level={1}>Component QA</Heading>
      <p className="mt-2 max-w-copy text-muted-foreground">Every component at 240px, 400px and full width. Run <code>pnpm test:qa</code> to audit and screenshot all of them.</p>
      <ul className="mt-6 grid gap-1 sm:grid-cols-3 lg:grid-cols-4">
        {components.map((c) => <li key={c.slug}><Link className="block rounded-lg px-3 py-2 text-sm hover:bg-accent" href={`/qa/${c.slug}`}>{c.title}</Link></li>)}
      </ul>
    </div>
  );
}
