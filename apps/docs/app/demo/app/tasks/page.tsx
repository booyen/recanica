"use client";

import * as React from "react";
import { PlusIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@recanica/ui/components/avatar";
import { Badge } from "@recanica/ui/components/badge";
import { Button } from "@recanica/ui/components/button";
import { Input } from "@recanica/ui/components/input";
import { cn } from "@recanica/ui/lib/utils";
import { PageHeader } from "@/components/demo/ui";

type Col = "To do" | "In progress" | "Done";
type Task = { id: number; title: string; col: Col; who: string; tag?: string };
const COLS: Col[] = ["To do", "In progress", "Done"];

export default function TasksPage() {
  const [tasks, setTasks] = React.useState<Task[]>([
    { id: 1, title: "Chase Maju Jaya for instalment 2", col: "To do", who: "HL", tag: "Finance" },
    { id: 2, title: "Photograph new mugs for the shop", col: "To do", who: "MK" },
    { id: 3, title: "Update Pro plan description", col: "In progress", who: "TW", tag: "Product" },
    { id: 4, title: "Send SST return to accountant", col: "In progress", who: "NR", tag: "Finance" },
    { id: 5, title: "Enable MyInvois", col: "Done", who: "TW" },
  ]);
  const [drag, setDrag] = React.useState<number | null>(null);
  const [draft, setDraft] = React.useState("");
  const move = (id: number, col: Col) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, col } : x)));
  return (
    <>
      <PageHeader title="Tasks" description="Drag cards between columns. On mobile, use the move menu on each card." />
      <form className="mb-6 flex max-w-md gap-2" onSubmit={(e) => { e.preventDefault(); if (!draft.trim()) return; setTasks((t) => [...t, { id: Date.now(), title: draft.trim(), col: "To do", who: "NR" }]); setDraft(""); }}>
        <Input placeholder="Add a task" aria-label="New task" value={draft} onChange={(e) => setDraft(e.target.value)} />
        <Button type="submit" size="icon" aria-label="Add task"><PlusIcon /></Button>
      </form>
      <div className="grid gap-4 md:grid-cols-3">
        {COLS.map((col) => (
          <section key={col} onDragOver={(e) => e.preventDefault()} onDrop={() => drag !== null && move(drag, col)} className="min-h-48 rounded-2xl border bg-muted/30 p-3" aria-label={col}>
            <h2 className="mb-3 flex items-center justify-between px-1 text-sm">{col}<span className="text-muted-foreground">{tasks.filter((t) => t.col === col).length}</span></h2>
            <ul className="space-y-2">
              {tasks.filter((t) => t.col === col).map((t) => (
                <li key={t.id} draggable onDragStart={() => setDrag(t.id)} onDragEnd={() => setDrag(null)} className={cn("cursor-grab space-y-3 rounded-xl border bg-card p-3 text-sm active:cursor-grabbing", drag === t.id && "opacity-50", col === "Done" && "text-muted-foreground line-through")}>
                  <p>{t.title}</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6"><AvatarFallback>{t.who}</AvatarFallback></Avatar>
                    {t.tag && <Badge variant="outline">{t.tag}</Badge>}
                    <select aria-label="Move to column" value={t.col} onChange={(e) => move(t.id, e.target.value as Col)} className="ml-auto rounded-md bg-transparent text-xs text-muted-foreground md:hidden">
                      {COLS.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
