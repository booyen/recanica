"use client";

import { Badge } from "@rekanica/ui/components/badge";

export default function BadgeDemo() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="brand">Brand</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="muted">Draft</Badge>
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="destructive">Failed</Badge>
    </div>
  );
}
