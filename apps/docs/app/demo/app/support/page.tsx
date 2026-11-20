"use client";

import * as React from "react";
import { PlusIcon, SendIcon } from "lucide-react";
import { Badge } from "@recanica/ui/components/badge";
import { Button } from "@recanica/ui/components/button";
import { Textarea } from "@recanica/ui/components/textarea";
import { cn } from "@recanica/ui/lib/utils";
import { PageHeader } from "@/components/demo/ui";
import { NavItem } from "@recanica/ui/components/nav-item";

type Ticket = { id: string; subject: string; status: "Open" | "Waiting on you" | "Solved"; updated: string; thread: { from: "you" | "support"; text: string; at: string }[] };

export default function SupportPage() {
  const [tickets, setTickets] = React.useState<Ticket[]>([
    { id: "#1042", subject: "Payout delayed after public holiday", status: "Waiting on you", updated: "2h ago", thread: [
      { from: "you", text: "My payout from Friday hasn't arrived. Is it because of the holiday?", at: "Mon 9:12am" },
      { from: "support", text: "Yes, banks were closed on Monday. It will arrive by Wednesday. Can you confirm the last 4 digits of your account?", at: "Mon 10:40am" },
    ] },
    { id: "#1031", subject: "How do I cancel a validated e-Invoice?", status: "Solved", updated: "3d ago", thread: [{ from: "you", text: "I sent an invoice with the wrong amount.", at: "Fri" }, { from: "support", text: "Void it within 72 hours from the invoice page and we'll cancel it in MyInvois.", at: "Fri" }] },
  ]);
  const [active, setActive] = React.useState(tickets[0].id);
  const [reply, setReply] = React.useState("");
  const t = tickets.find((x) => x.id === active)!;
  const tone = { Open: "warning", "Waiting on you": "secondary", Solved: "success" } as const;
  return (
    <>
      <PageHeader title="Support" description="We reply within one business day. Urgent payout issues within 2 hours." actions={<Button><PlusIcon /> New ticket</Button>} />
      <div className="grid gap-4 md:grid-cols-[18rem_1fr]">
        <ul className="divide-y rounded-2xl border bg-card">
          {tickets.map((x) => (
            <li key={x.id}>
              <NavItem onClick={() => setActive(x.id)} active={active === x.id} className="block rounded-none p-4">
                <span className="flex items-center justify-between gap-2"><span className="font-mono text-xs text-muted-foreground">{x.id}</span><Badge variant={tone[x.status]}>{x.status}</Badge></span>
                <span className="mt-1 block">{x.subject}</span>
                <span className="text-xs text-muted-foreground">Updated {x.updated}</span>
              </NavItem>
            </li>
          ))}
        </ul>
        <section className="flex flex-col rounded-2xl border bg-card">
          <h2 className="border-b p-4">{t.subject}</h2>
          <ol className="flex-1 space-y-4 p-4">
            {t.thread.map((m, i) => (
              <li key={i} className={cn("max-w-[80%] rounded-2xl px-4 py-3 text-sm", m.from === "you" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted")}>
                {m.text}<span className="mt-1 block text-xs opacity-60">{m.from === "you" ? "You" : "Hana, Acme support"} · {m.at}</span>
              </li>
            ))}
          </ol>
          {t.status !== "Solved" && (
            <form className="flex gap-2 border-t p-3" onSubmit={(e) => { e.preventDefault(); if (!reply.trim()) return; setTickets((all) => all.map((x) => (x.id === t.id ? { ...x, status: "Open", updated: "just now", thread: [...x.thread, { from: "you", text: reply.trim(), at: "Now" }] } : x))); setReply(""); }}>
              <Textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply" aria-label="Reply" className="min-h-10" />
              <Button type="submit" size="icon" aria-label="Send reply"><SendIcon /></Button>
            </form>
          )}
        </section>
      </div>
    </>
  );
}
