"use client";

import { CopyIcon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@recanica/ui/components/tooltip";

export default function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild><Button variant="outline" size="icon" aria-label="Copy link"><CopyIcon /></Button></TooltipTrigger>
      <TooltipContent>Copy link</TooltipContent>
    </Tooltip>
  );
}
