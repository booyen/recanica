"use client";

import * as React from "react";
import { CheckIcon, CopyIcon, DownloadIcon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";
import { cn } from "@recanica/ui/lib/utils";
import type { LlmPrompt } from "@/lib/llm";
import { NavItem } from "@recanica/ui/components/nav-item";

export function CopyPromptButton({ text, label = "Copy prompt", className, size = "default", variant = "brand" }: {
  text: string; label?: string; className?: string; size?: "default" | "sm" | "lg"; variant?: "brand" | "outline" | "secondary";
}) {
  const [done, setDone] = React.useState(false);
  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1800); } catch {}
      }}
    >
      {done ? <CheckIcon /> : <CopyIcon />} {done ? "Copied" : label}
    </Button>
  );
}

export function PromptLibrary({ prompts }: { prompts: LlmPrompt[] }) {
  const [active, setActive] = React.useState(prompts[0].id);
  const p = prompts.find((x) => x.id === active)!;
  const download = () => {
    const name = p.id === "rules" ? "CLAUDE.md" : `recanica-${p.id}-prompt.md`;
    const url = URL.createObjectURL(new Blob([p.body], { type: "text/markdown" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: name });
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:sticky lg:top-20 lg:mx-0 lg:flex-col lg:self-start lg:overflow-visible lg:px-0">
        {prompts.map((x, i) => (
          <NavItem key={x.id} onClick={() => setActive(x.id)} active={active === x.id} className={cn("w-auto shrink-0 border lg:w-full lg:shrink", active !== x.id && "text-muted-foreground")}>
            <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="whitespace-nowrap lg:whitespace-normal">{x.title}</span>
          </NavItem>
        ))}
      </div>

      <div className="min-w-0 overflow-hidden rounded-2xl border bg-panel">
        <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h3 className="text-lg">{p.title}</h3>
            <p className="max-w-xl text-sm text-muted-foreground">{p.when}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="icon" aria-label="Download as markdown" onClick={download}><DownloadIcon /></Button>
            <CopyPromptButton text={p.body} variant="outline" />
          </div>
        </div>
        <pre className="max-h-[520px] overflow-auto p-5 font-mono text-[12.5px] leading-6 whitespace-pre-wrap text-muted-foreground">{p.body}</pre>
        <div className="border-t px-5 py-2.5 text-xs text-muted-foreground tabular-nums">
          {p.body.length.toLocaleString("en-US")} characters · ~{Math.round(p.body.length / 4).toLocaleString("en-US")} tokens
        </div>
      </div>
    </div>
  );
}
