"use client";

import Link from "next/link";
import { examples } from "@/__registry__";
import { Heading } from "@recanica/ui/components/page";
import { Surface } from "@recanica/ui/components/surface";

/**
 * One component, three container widths: a narrow sidebar card, a half column, and full width.
 * Components must work in all three without overflow, overlap or wrapped labels.
 * tests/qa.spec.ts audits and screenshots every one of these boards.
 */
const frames = [
  { id: "narrow", label: "240px · sidebar card", className: "w-60", px: 240 },
  { id: "half", label: "400px · half column", className: "w-[25rem]", px: 400 },
  { id: "full", label: "Full width", className: "w-full", px: Infinity },
];

export function QABoard({ slug, title, prev, next, minWidth = 0 }: { slug: string; title: string; prev: string; next: string; minWidth?: number }) {
  const Example = examples[slug];
  return (
    <div className="mx-auto max-w-content space-y-6 px-gutter py-8">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Component QA</p>
          <Heading level={1}>{title}</Heading>
        </div>
        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link className="py-1 hover:text-foreground" href={`/qa/${prev}`}>← {prev}</Link>
          <Link className="py-1 hover:text-foreground" href="/qa">All</Link>
          <Link className="py-1 hover:text-foreground" href={`/qa/${next}`}>{next} →</Link>
          <Link className="py-1 hover:text-foreground" href={`/docs/components/${slug}`}>Docs</Link>
        </nav>
      </header>
      <div className="flex flex-wrap items-start gap-6">
        {frames.map((f) => (
          <section key={f.id} data-qa-frame={f.id} className={`${f.className} max-w-full shrink-0 space-y-2`}>
            <p className="text-xs text-muted-foreground">{f.label}</p>
            {f.px < minWidth ? (
              <Surface as="p" tone="plain" inset="sm" dashed className="text-sm text-muted-foreground">Needs at least {minWidth}px. Use it in wider containers, or the mobile alternative in the docs.</Surface>
            ) : (
              <div data-qa-box /* recanica-ignore: QA measurement frame */ className="@container rounded-2xl border bg-panel p-4">
                {Example ? <Example /> : <p className="text-sm text-destructive">No example</p>}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
