"use client";

import { BookmarkIcon } from "lucide-react";
import { Toggle } from "@rekanica/ui/components/toggle";

export default function ToggleDemo() {
  return (
    <div className="flex gap-2">
      <Toggle aria-label="Bookmark"><BookmarkIcon /> Bookmark</Toggle>
      <Toggle variant="outline" aria-label="Bookmark" defaultPressed><BookmarkIcon /></Toggle>
    </div>
  );
}
