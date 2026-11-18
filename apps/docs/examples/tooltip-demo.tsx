"use client";

import { CopyIcon } from "lucide-react";
import { Button } from "@rekanica/ui/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@rekanica/ui/components/tooltip";

export default function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild><Button variant="outline" size="icon" aria-label="Copy link"><CopyIcon /></Button></TooltipTrigger>
      <TooltipContent>Copy link</TooltipContent>
    </Tooltip>
  );
}
