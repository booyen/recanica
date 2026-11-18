"use client";

import * as React from "react";
import { ExternalLinkIcon, MonitorIcon, SmartphoneIcon, TabletIcon } from "lucide-react";
import { Button } from "@rekanica/ui/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@rekanica/ui/components/tabs";
import { ToggleGroup, ToggleGroupItem } from "@rekanica/ui/components/toggle-group";
import { CodeFrame } from "./code-frame";

const sizes = { desktop: "100%", tablet: "768px", mobile: "375px" } as const;

export function BlockViewer({
  src, height = 640, html, raw, title,
}: { src: string; height?: number; html: string; raw: string; title: string }) {
  const [size, setSize] = React.useState<keyof typeof sizes>("desktop");
  return (
    <Tabs defaultValue="preview" className="gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <ToggleGroup
          type="single"
          value={size}
          onValueChange={(v) => v && setSize(v as keyof typeof sizes)}
          variant="outline"
          size="sm"
          className="ml-auto hidden md:flex"
        >
          <ToggleGroupItem value="desktop" aria-label="Desktop"><MonitorIcon /></ToggleGroupItem>
          <ToggleGroupItem value="tablet" aria-label="Tablet"><TabletIcon /></ToggleGroupItem>
          <ToggleGroupItem value="mobile" aria-label="Mobile"><SmartphoneIcon /></ToggleGroupItem>
        </ToggleGroup>
        <Button asChild variant="ghost" size="icon-sm" className="ml-auto md:ml-0" aria-label="Open in new tab">
          <a href={src} target="_blank" rel="noreferrer"><ExternalLinkIcon /></a>
        </Button>
      </div>
      <TabsContent value="preview">
        <div className="overflow-hidden rounded-2xl border bg-muted/40">
          <iframe
            src={src}
            title={title}
            loading="lazy"
            className="mx-auto block bg-background transition-[width] duration-300 ease-out-soft"
            style={{ width: sizes[size], maxWidth: "100%", height }}
          />
        </div>
      </TabsContent>
      <TabsContent value="code">
        <CodeFrame html={html} raw={raw} maxHeight={height} />
      </TabsContent>
    </Tabs>
  );
}
