"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@recanica/ui/components/select";

export default function SelectDemo() {
  return (
    <Select defaultValue="all">
      <SelectTrigger className="w-56"><SelectValue placeholder="Product" /></SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Products</SelectLabel>
          <SelectItem value="all">All products</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
          <SelectItem value="starter">Starter</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
