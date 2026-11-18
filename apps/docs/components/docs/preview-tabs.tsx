"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@rekanica/ui/components/tabs";
import { CodeFrame } from "./code-frame";

export function PreviewTabs({ preview, html, raw }: { preview: React.ReactNode; html: string; raw: string }) {
  return (
    <Tabs defaultValue="preview" className="gap-4">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <div className="flex min-h-[320px] w-full items-center justify-center overflow-x-auto rounded-2xl border bg-panel p-6 sm:p-10">
          <div className="w-full max-w-full [&>*]:mx-auto">{preview}</div>
        </div>
      </TabsContent>
      <TabsContent value="code">
        <CodeFrame html={html} raw={raw} maxHeight={560} />
      </TabsContent>
    </Tabs>
  );
}
