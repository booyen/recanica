"use client";

import { Bubble, BubbleContent, BubbleGroup } from "@recanica/ui/components/bubble";

export default function BubbleDemo() {
  return (
    <BubbleGroup className="w-full max-w-sm">
      <Bubble><BubbleContent>Default bubble</BubbleContent></Bubble>
      <Bubble variant="muted"><BubbleContent>Muted bubble</BubbleContent></Bubble>
      <Bubble variant="outline"><BubbleContent>Outline bubble</BubbleContent></Bubble>
      <Bubble align="end" variant="secondary"><BubbleContent>End-aligned reply</BubbleContent></Bubble>
    </BubbleGroup>
  );
}
