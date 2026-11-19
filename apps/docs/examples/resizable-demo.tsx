"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@recanica/ui/components/resizable";

export default function ResizableDemo() {
  return (
    <ResizablePanelGroup orientation="horizontal" className="min-h-56 max-w-lg rounded-2xl border">
      <ResizablePanel defaultSize="40%">
        <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">List</div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="60%">
        <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">Detail</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
