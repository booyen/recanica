"use client";

import Link from "next/link";
import { Badge } from "@recanica/ui/components/badge";
import { PageHeader } from "@/components/demo/ui";
import catalog from "@/lib/catalog.json";
import { Surface } from "@recanica/ui/components/surface";

const tone = { demo: "default", pattern: "outline", component: "muted", web: "secondary", block: "outline" } as const;

export default function LibraryPage() {
  const lib = catalog.appLibrary;
  return (
    <>
      <PageHeader title="Page library" description={`${lib.length} common dashboard and portal page types, with where each one lives in this demo and the docs.`} />
      <div className="grid gap-4 md:grid-cols-2">
        {lib.map((c) => (
          <Surface as="section" key={c.category}>
            <h2>{c.category}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
            <ul className="mt-4 space-y-1.5">
              {c.items.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} target={i.href.startsWith("/docs") ? "_blank" : undefined} className="flex items-center gap-2 py-1 text-sm hover:underline">
                    <Badge variant={tone[i.kind as keyof typeof tone]} className="w-20 justify-center">{i.kind}</Badge>{i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Surface>
        ))}
      </div>
    </>
  );
}
