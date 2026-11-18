"use client";

import { Input } from "@rekanica/ui/components/input";

export default function InputDemo() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Input placeholder="name@company.example" type="email" />
      <Input placeholder="Disabled" disabled />
      <Input placeholder="Invalid" aria-invalid />
    </div>
  );
}
