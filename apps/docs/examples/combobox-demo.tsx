"use client";

import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@recanica/ui/components/combobox";

const countries = ["Malaysia", "Singapore", "Indonesia", "Thailand", "Philippines", "Vietnam", "Japan", "Australia"];

export default function ComboboxDemo() {
  return (
    <Combobox items={countries}>
      <ComboboxInput aria-label="Country" placeholder="Select a country" className="w-full max-w-64" />
      <ComboboxContent>
        <ComboboxEmpty>No country found.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
