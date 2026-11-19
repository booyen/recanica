import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/demo/ui";
import { KitCategory } from "@/components/demo/kit";
import { kitSlug } from "@/lib/kit";
import catalog from "@/lib/catalog.json";

const categories = [...new Set(catalog.components.map((c) => c.category))];

export function generateStaticParams() {
  return categories.map((c) => ({ category: kitSlug(c) }));
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const name = categories.find((c) => kitSlug(c) === category);
  if (!name) notFound();
  const items = catalog.components.filter((c) => c.category === name);
  return (
    <>
      <PageHeader title={name} description={`${items.length} components, live. Every one is in the docs with props and code.`} />
      <nav aria-label="Categories" className="-mt-2 mb-6 flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <Link
            key={c}
            href={`/demo/app/ui/${kitSlug(c)}`}
            aria-current={c === name ? "page" : undefined}
            className="rounded-full border px-3 py-1 text-sm whitespace-nowrap text-muted-foreground hover:text-foreground aria-[current=page]:bg-accent aria-[current=page]:text-foreground"
          >
            {c}
          </Link>
        ))}
      </nav>
      <KitCategory category={name} />
    </>
  );
}
