"use client";

import { Avatar, AvatarFallback } from "@recanica/ui/components/avatar";
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader } from "@recanica/ui/components/message";
import { Bubble, BubbleContent } from "@recanica/ui/components/bubble";

export default function MessageDemo() {
  return (
    <MessageGroup className="w-full max-w-md text-left">
      <Message>
        <MessageAvatar><Avatar className="size-7"><AvatarFallback>NR</AvatarFallback></Avatar></MessageAvatar>
        <MessageContent>
          <MessageHeader>Nadia Rahman</MessageHeader>
          <Bubble><BubbleContent>Hi! I was charged twice for my Pro plan.</BubbleContent></Bubble>
          <MessageFooter>2:14 PM</MessageFooter>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="secondary"><BubbleContent>Sorry about that. I've refunded the duplicate charge.</BubbleContent></Bubble>
          <MessageFooter>2:16 PM</MessageFooter>
        </MessageContent>
      </Message>
    </MessageGroup>
  );
}
