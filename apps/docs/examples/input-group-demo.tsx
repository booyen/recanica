"use client";

import { SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText, InputGroupButton } from "@recanica/ui/components/input-group";

export default function InputGroupDemo() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <InputGroup>
        <InputGroupAddon><SearchIcon /></InputGroupAddon>
        <InputGroupInput placeholder="Search customers" aria-label="Search customers" />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon><InputGroupText>$</InputGroupText></InputGroupAddon>
        <InputGroupInput placeholder="0.00" aria-label="0.00" inputMode="decimal" />
        <InputGroupAddon align="inline-end"><InputGroupText>USD</InputGroupText></InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput defaultValue="aturanica.com/c/pro-yearly" readOnly aria-label="Checkout link" />
        <InputGroupAddon align="inline-end"><InputGroupButton>Copy</InputGroupButton></InputGroupAddon>
      </InputGroup>
    </div>
  );
}
