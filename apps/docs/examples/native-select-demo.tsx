"use client";

import { NativeSelect, NativeSelectOption } from "@recanica/ui/components/native-select";

export default function NativeSelectDemo() {
  return (
    <NativeSelect className="w-56" defaultValue="monthly" aria-label="Billing cycle">
      <NativeSelectOption value="monthly">Monthly</NativeSelectOption>
      <NativeSelectOption value="yearly">Yearly</NativeSelectOption>
      <NativeSelectOption value="one-time">One-time</NativeSelectOption>
    </NativeSelect>
  );
}
