"use client";

import { CheckIcon } from "lucide-react";
import { Marker, MarkerContent, MarkerIcon } from "@rekanica/ui/components/marker";

export default function MarkerDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Marker variant="separator"><MarkerContent>Today</MarkerContent></Marker>
      <Marker><MarkerIcon><CheckIcon /></MarkerIcon><MarkerContent>Refund issued by Leo Tan</MarkerContent></Marker>
      <Marker variant="border"><MarkerContent>Conversation assigned to Billing</MarkerContent></Marker>
    </div>
  );
}
