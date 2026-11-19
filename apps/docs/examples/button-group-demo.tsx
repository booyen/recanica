"use client";

import { ChevronDownIcon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";
import { ButtonGroup } from "@recanica/ui/components/button-group";

export default function ButtonGroupDemo() {
  return (
    <ButtonGroup>
      <Button variant="outline">Archive</Button>
      <Button variant="outline">Report</Button>
      <Button variant="outline" size="icon" aria-label="More"><ChevronDownIcon /></Button>
    </ButtonGroup>
  );
}
