"use client";

import { LinkIcon } from "lucide-react";
import { Button } from "@rekanica/ui/components/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@rekanica/ui/components/empty";

export default function EmptyDemo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon"><LinkIcon /></EmptyMedia>
        <EmptyTitle>No checkout links</EmptyTitle>
        <EmptyDescription>Create a new checkout link to share with your customers.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent><Button>Create checkout link</Button></EmptyContent>
    </Empty>
  );
}
