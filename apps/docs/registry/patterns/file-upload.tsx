"use client";

import * as React from "react";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";
import { Progress } from "@recanica/ui/components/progress";
import { cn } from "@recanica/ui/lib/utils";

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
        <h1 className="text-title">Downloadables</h1>
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
          <p className="text-sm">Drop files here or <button type="button" className="underline underline-offset-4" onClick={() => input.current?.click()}>browse</button></p>
          <p className="text-xs text-muted-foreground">Up to 2 GB per file.</p>
        </div>
        <input ref={input} type="file" multiple hidden onChange={(e) => add(e.target.files)} />
      </div>
      <ul className="space-y-2">
        {files.map((f, i) => (
          <li key={f.name + i} className="flex items-center gap-3 rounded-xl border p-3">
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
          </li>
        ))}
      </ul>
    </div>
  );
}
