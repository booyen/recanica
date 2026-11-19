"use client";

import { Skeleton } from "@recanica/ui/components/skeleton";

export default function SkeletonDemo() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2"><Skeleton className="h-4 w-full max-w-56" /><Skeleton className="h-4 w-3/4 max-w-40" /></div>
    </div>
  );
}
