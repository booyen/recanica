import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { pager } from "@/lib/docs";

export function Pager({ href }: { href: string }) {
  const { prev, next } = pager(href);
  return (
    <div className="mt-16 grid gap-3 border-t pt-8 sm:grid-cols-2">
      {prev ? (
        <Link href={prev.href} className="group rounded-2xl border p-4 transition-colors hover:bg-accent">
          <span className="flex items-center gap-1 text-xs text-muted-foreground"><ArrowLeftIcon className="size-3" /> Previous</span>
          <span className="mt-1 block">{prev.title}</span>
        </Link>
      ) : <span />}
      {next && (
        <Link href={next.href} className="group rounded-2xl border p-4 text-right transition-colors hover:bg-accent">
          <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">Next <ArrowRightIcon className="size-3" /></span>
          <span className="mt-1 block">{next.title}</span>
        </Link>
      )}
    </div>
  );
}
