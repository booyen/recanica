"use client";

import * as React from "react";
import { SearchIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@recanica/ui/components/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@recanica/ui/components/input-group";
import { PageHeader } from "@/components/demo/ui";

const apps = [
  { name: "Xero", cat: "Accounting", body: "Sync invoices and payouts to your ledger." },
  { name: "SQL Accounting", cat: "Accounting", body: "Export in SQL's import format." },
  { name: "Shopify", cat: "Commerce", body: "Create customers and orders from your store." },
  { name: "WooCommerce", cat: "Commerce", body: "Payment links on WordPress checkout." },
  { name: "WhatsApp Business", cat: "Messaging", body: "Send invoice links and reminders on WhatsApp." },
  { name: "Slack", cat: "Messaging", body: "Post paid invoices to a channel." },
  { name: "Google Sheets", cat: "Data", body: "Daily export of orders and invoices." },
  { name: "Zapier", cat: "Data", body: "Connect to 6,000+ apps with webhooks." },
];

export default function IntegrationsPage() {
  const [q, setQ] = React.useState("");
  const [on, setOn] = React.useState<Set<string>>(new Set(["WhatsApp Business"]));
  const list = apps.filter((a) => `${a.name} ${a.cat}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader title="Integrations" description={`${on.size} connected`} />
      <InputGroup className="mb-6 sm:max-w-sm"><InputGroupAddon><SearchIcon /></InputGroupAddon><InputGroupInput placeholder="Search integrations" aria-label="Search integrations" value={q} onChange={(e) => setQ(e.target.value)} /></InputGroup>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((a) => {
          const connected = on.has(a.name);
          return (
            <li key={a.name} className="flex flex-col gap-4 rounded-2xl border bg-card p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl border bg-muted text-sm">{a.name[0]}</span>
                <div><p>{a.name}</p><p className="text-xs text-muted-foreground">{a.cat}</p></div>
              </div>
              <p className="flex-1 text-sm text-muted-foreground">{a.body}</p>
              <Button variant={connected ? "outline" : "default"} size="sm" className="self-start" onClick={() => { setOn((s) => { const n = new Set(s); if (connected) n.delete(a.name); else n.add(a.name); return n; }); toast(connected ? `${a.name} disconnected` : `${a.name} connected`); }}>
                {connected ? "Disconnect" : "Connect"}
              </Button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
