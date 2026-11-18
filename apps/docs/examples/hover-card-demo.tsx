"use client";

import { Avatar, AvatarFallback } from "@rekanica/ui/components/avatar";
import { Button } from "@rekanica/ui/components/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@rekanica/ui/components/hover-card";

export default function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild><Button variant="link">@acme-studio</Button></HoverCardTrigger>
      <HoverCardContent className="flex gap-3">
        <Avatar><AvatarFallback>AS</AvatarFallback></Avatar>
        <div className="space-y-1 text-sm">
          <p>Acme Studio</p>
          <p className="text-muted-foreground">Design tools for small teams. 1,284 customers.</p>
          <p className="text-xs text-muted-foreground">Joined March 2025</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
