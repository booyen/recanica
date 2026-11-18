"use client";

import { BadgeCheckIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@rekanica/ui/components/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@rekanica/ui/components/item";

export default function ItemDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Payout account</ItemTitle>
          <ItemDescription>Connect a bank account to receive payouts.</ItemDescription>
        </ItemContent>
        <ItemActions><Button size="sm" variant="outline">Connect</Button></ItemActions>
      </Item>
      <Item variant="outline" size="sm" asChild>
        <a href="#">
          <ItemMedia><BadgeCheckIcon className="size-5" /></ItemMedia>
          <ItemContent><ItemTitle>Your profile is verified.</ItemTitle></ItemContent>
          <ItemActions><ChevronRightIcon className="size-4" /></ItemActions>
        </a>
      </Item>
    </div>
  );
}
