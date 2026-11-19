"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@recanica/ui/components/tabs";

const ranges = ["All time", "12m", "3m", "30d", "Today"];

export default function TabsDemo() {
  return (
    <Tabs defaultValue="30d" className="items-center">
      <TabsList>
        {ranges.map((r) => <TabsTrigger key={r} value={r === "All time" ? "all" : r.toLowerCase()}>{r}</TabsTrigger>)}
      </TabsList>
      {ranges.map((r) => (
        <TabsContent key={r} value={r === "All time" ? "all" : r.toLowerCase()} className="text-sm text-muted-foreground">Showing: {r}</TabsContent>
      ))}
    </Tabs>
  );
}
