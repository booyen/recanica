"use client";

import { Input } from "@recanica/ui/components/input";

export default function InputDemo() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Input placeholder="name@company.example" aria-label="name@company.example" type="email" />
      <Input placeholder="Disabled" aria-label="Disabled" disabled />
      <Input placeholder="Invalid" aria-label="Invalid" aria-invalid />
    </div>
  );
}
