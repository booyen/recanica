import Link from "next/link";
import { web } from "@/lib/docs";

export const metadata = { title: "All sections" };

// Index of the web library. Each section opens on its own page, alone, so spacing and behaviour can be judged in isolation.
export default function SectionsPage() {
  const categories = new Set(web.map((w) => w.category)).size;
  return (
    <div className="mx-auto max-w-content px-gutter py-section-sm">
      <h1 className="text-display-sm tracking-tight">All web sections</h1>
      <p className="mt-3 max-w-copy text-muted-foreground">
        {web.length} sections in {categories} categories. Open one to see it on its own page at mobile, tablet and desktop widths.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {web.map((i) => (
          <Link key={i.slug} href={`/site/sections/${i.slug}`} data-kit-item={i.slug} className="group overflow-hidden rounded-2xl border bg-card transition-colors hover:border-foreground/25">
            {/* Desktop-width render scaled to a thumbnail. */}
            <div className="relative aspect-[16/10] overflow-hidden border-b bg-background">
              <iframe
                src={`/view/web/${i.slug}`}
                title={i.title}
                loading="lazy"
                tabIndex={-1}
                aria-hidden
                className="pointer-events-none absolute top-0 left-0 h-[400%] w-[400%] origin-top-left scale-25 border-0"
              />
            </div>
            <div className="px-4 py-3">
              <p className="truncate text-sm">{i.title}</p>
              <p className="truncate text-xs text-muted-foreground">{i.category}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
