"use client";

import { usePathname } from "next/navigation";
import { Page } from "@recanica/ui/components/page";

// The docs column is a Page: rhythm and width come from @recanica/ui. Catalog pages (component, pattern,
// block and section previews) need the full width; every other docs page is a reading column.
const WIDE = /^\/docs\/(components|patterns|blocks|web)\/[^/]+/;

export function DocsColumn({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <Page width={WIDE.test(pathname) ? "full" : "reading"}>{children}</Page>;
}
