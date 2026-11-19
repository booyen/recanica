"use client";

import * as React from "react";
import { CopyIcon, EyeIcon, EyeOffIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@recanica/ui/components/badge";
import { Button } from "@recanica/ui/components/button";
import { Switch } from "@recanica/ui/components/switch";
import { PageHeader, Section } from "@/components/demo/ui";

// Demo-only fake keys; never put real secrets in source.
const keys = [
  { name: "Production server", key: "sk_test_demo_51Hx…4f2a", created: "2 Sep 2026", used: "2 hours ago" },
  { name: "Zapier", key: "sk_test_demo_51Hx…9c1e", created: "12 Oct 2026", used: "Yesterday" },
];
const hooks = [
  { url: "https://api.acme.example/webhooks/billing", events: ["invoice.paid", "order.refunded"], ok: true },
  { url: "https://hooks.zapier.com/hooks/catch/123/abc", events: ["customer.created"], ok: false },
];

export default function DevelopersPage() {
  const [shown, setShown] = React.useState<string | null>(null);
  return (
    <>
      <PageHeader title="Developers" description="API keys and webhooks. Test-mode keys only in this demo." actions={<Button><PlusIcon /> Create key</Button>} />
      <ul className="divide-y rounded-2xl border bg-card">
        {keys.map((k) => (
          <li key={k.name} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-[12rem] flex-1 text-sm"><p className="truncate">{k.name}</p><p className="text-muted-foreground">Created {k.created} · last used {k.used}</p></div>
            <code className="rounded-lg bg-muted px-2 py-1 font-mono text-xs">{shown === k.name ? k.key : "sk_test_demo_••••••••"}</code>
            <Button variant="ghost" size="icon-sm" aria-label={shown === k.name ? "Hide key" : "Reveal key"} onClick={() => setShown(shown === k.name ? null : k.name)}>{shown === k.name ? <EyeOffIcon /> : <EyeIcon />}</Button>
            <Button variant="ghost" size="icon-sm" aria-label="Copy key" onClick={() => { navigator.clipboard?.writeText(k.key).catch(() => {}); toast("Key copied"); }}><CopyIcon /></Button>
          </li>
        ))}
      </ul>
      <Section title="Webhooks" action={<Button variant="outline" size="sm"><PlusIcon /> Add endpoint</Button>}>
        <ul className="divide-y rounded-2xl border bg-card">
          {hooks.map((h) => (
            <li key={h.url} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1 text-sm">
                <p className="truncate font-mono text-xs">{h.url}</p>
                <div className="mt-2 flex flex-wrap gap-1">{h.events.map((e) => <Badge key={e} variant="outline" className="font-mono">{e}</Badge>)}</div>
              </div>
              <Badge variant={h.ok ? "success" : "destructive"}>{h.ok ? "Delivering" : "3 failures"}</Badge>
              <Switch defaultChecked aria-label="Endpoint enabled" />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
