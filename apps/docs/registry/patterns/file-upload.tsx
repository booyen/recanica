"use client";

import * as React from "react";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";
import { Progress } from "@recanica/ui/components/progress";
import { cn } from "@recanica/ui/lib/utils";
import { Heading } from "@recanica/ui/components/page";
import { Surface } from "@recanica/ui/components/surface";

type Upload = { name: string; size: number; progress: number };

const initial: Upload[] = [
  { name: "brand-assets.zip", size: 24_800_000, progress: 100 },
  { name: "course-module-03.mp4", size: 182_000_000, progress: 46 },
];

const fmt = (b: number) => (b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.round(b / 1e3)} KB`);

export default function FileUpload() {
  const [files, setFiles] = React.useState(initial);
  const [over, setOver] = React.useState(false);
  const input = React.useRef<HTMLInputElement>(null);

  const add = (list: FileList | null) => {
    if (!list) return;
    setFiles((f) => [...f, ...Array.from(list).map((x) => ({ name: x.name, size: x.size, progress: 100 }))]);
  };

  return (
    <div className="mx-auto max-w-narrow space-y-4 px-gutter py-8">
      <div>
        <Heading level={1}>Downloadables</Heading>
        <p className="mt-1 text-sm text-muted-foreground">Files customers can download after purchase.</p>
      </div>
      <div
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); add(e.dataTransfer.files); }}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-12 text-center transition-colors",
          over && "border-foreground/40 bg-accent"
        )}
      >
        <span className="flex size-11 items-center justify-center rounded-full border bg-muted"><UploadCloudIcon className="size-5" /></span>
        <div>
          <p className="text-sm">Drop files here or <Button variant="link" size="inline" onClick={() => input.current?.click()}>browse</Button></p>
          <p className="text-xs text-muted-foreground">Up to 2 GB per file.</p>
        </div>
        <input /* recanica-ignore: hidden native file input behind the drop zone */ ref={input} type="file" multiple hidden onChange={(e) => add(e.target.files)} />
      </div>
      <ul className="space-y-2">
        {files.map((f, i) => (
          <Surface as="li" size="sm" tone="plain" inset="sm" className="flex items-center gap-3" key={f.name + i}>
            <FileIcon className="size-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex justify-between gap-2 text-sm">
                <span className="truncate">{f.name}</span>
                <span className="shrink-0 text-muted-foreground tabular-nums">{f.progress < 100 ? `${f.progress}%` : fmt(f.size)}</span>
              </div>
              {f.progress < 100 && <Progress value={f.progress} className="h-1" />}
            </div>
            <Button variant="ghost" size="icon-sm" aria-label={`Remove ${f.name}`} onClick={() => setFiles((x) => x.filter((_, j) => j !== i))}>
              <XIcon />
            </Button>
          </Surface>
        ))}
      </ul>
    </div>
  );
}
