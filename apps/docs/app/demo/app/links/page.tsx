"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftIcon, CopyIcon, ExternalLinkIcon, LinkIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@rekanica/ui/components/alert-dialog";
import { Badge } from "@rekanica/ui/components/badge";
import { Button } from "@rekanica/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@rekanica/ui/components/dialog";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@rekanica/ui/components/empty";
import { Field, FieldLabel } from "@rekanica/ui/components/field";
import { Input } from "@rekanica/ui/components/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@rekanica/ui/components/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@rekanica/ui/components/select";
import { StatList, StatRow } from "@rekanica/ui/components/stat";
import { Switch } from "@rekanica/ui/components/switch";
import { cn } from "@rekanica/ui/lib/utils";
import { ago, money, price, uid, useDemo } from "@/lib/demo/store";

function CreateLinkDialog({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (o: boolean) => void; onCreated: (id: string) => void }) {
  const { state, dispatch } = useDemo();
  const products = state.products.filter((p) => !p.archived);
  const [label, setLabel] = React.useState("");
  const [productId, setProductId] = React.useState(products[0]?.id ?? "");
  React.useEffect(() => { if (open) { setLabel(""); setProductId(products[0]?.id ?? ""); } }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    const link = { id: uid("lnk"), label: label.trim() || p.name, productId, active: true, visits: 0, createdAt: new Date().toISOString() };
    dispatch({ type: "upsertLink", link });
    toast.success("Checkout link created");
    onOpenChange(false);
    onCreated(link.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={create} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>New checkout link</DialogTitle>
            <DialogDescription>Share it anywhere. Customers pay without an account.</DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="l-label">Label</FieldLabel>
            <Input id="l-label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Newsletter" />
          </Field>
          <Field>
            <FieldLabel>Product</FieldLabel>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Choose a product" /></SelectTrigger>
              <SelectContent>
                {products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name} · {price(p)}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={!productId}>Create link</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function LinksPageInner() {
  const { state, dispatch } = useDemo();
  const router = useRouter();
  const params = useSearchParams();
  const selectedId = params.get("id");
  const [creating, setCreating] = React.useState(params.get("new") === "1");
  const select = (id: string | null) => router.replace(id ? `/demo/app/links?id=${id}` : "/demo/app/links", { scroll: false });

  const link = state.links.find((l) => l.id === selectedId);
  const product = link && state.products.find((p) => p.id === link.productId);
  const orders = link ? state.orders.filter((o) => o.linkId === link.id) : [];
  const url = link && typeof window !== "undefined" ? `${window.location.origin}/demo/checkout/${link.id}` : "";

  return (
    <div className="-mx-gutter -my-6 flex min-h-[calc(100svh-3rem)] flex-col gap-2 sm:-my-8 md:flex-row">
      <section className={cn("flex flex-col border-b md:w-80 md:shrink-0 md:border-r md:border-b-0", link && "hidden md:flex")}>
        <header className="flex items-center justify-between px-4 py-4">
          <h1 className="text-heading">Checkout Links</h1>
          <Button size="icon-sm" aria-label="New link" onClick={() => setCreating(true)}><PlusIcon /></Button>
        </header>
        <ul className="flex flex-col gap-0.5 px-2 pb-2">
          {state.links.map((l) => {
            const p = state.products.find((x) => x.id === l.productId);
            const sales = state.orders.filter((o) => o.linkId === l.id && o.status === "paid").length;
            return (
              <li key={l.id}>
                <button
                  onClick={() => select(l.id)}
                  className={cn("flex w-full flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-accent", selectedId === l.id && "bg-accent")}
                >
                  <span className="flex items-center justify-between gap-2 text-sm">{l.label}{!l.active && <Badge variant="muted">Paused</Badge>}</span>
                  <span className="text-xs text-muted-foreground">{p?.name ?? "Deleted product"} · {sales} sales</span>
                </button>
              </li>
            );
          })}
          {state.links.length === 0 && <li className="px-3 py-6 text-sm text-muted-foreground">No links yet.</li>}
        </ul>
      </section>

      <section className={cn("flex-1", !link && "hidden md:block")}>
        {link ? (
          <div className="space-y-6 px-gutter py-6">
            <Button variant="ghost" size="sm" className="-ml-2 md:hidden" onClick={() => select(null)}><ArrowLeftIcon /> All links</Button>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-title">{link.label}</h2>
                <p className="text-sm text-muted-foreground">{product ? `${product.name} · ${price(product)}` : "Product deleted"}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild><a href={`/demo/checkout/${link.id}`} target="_blank" rel="noreferrer"><ExternalLinkIcon /> Open</a></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="outline" size="icon" aria-label="Delete link"><Trash2Icon /></Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete “{link.label}”?</AlertDialogTitle>
                      <AlertDialogDescription>The URL stops working. Past orders are kept.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => { dispatch({ type: "deleteLink", id: link.id }); select(null); toast("Link deleted"); }}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <InputGroup>
              <InputGroupInput readOnly value={url} aria-label="Checkout URL" />
              <InputGroupAddon align="inline-end">
                <InputGroupButton onClick={async () => { try { await navigator.clipboard.writeText(url); toast("Link copied"); } catch {} }}><CopyIcon /> Copy</InputGroupButton>
              </InputGroupAddon>
            </InputGroup>

            <label className="flex items-center justify-between gap-4 rounded-xl border p-4">
              <span><span className="block text-sm">Accepting payments</span><span className="block text-sm text-muted-foreground">Paused links show a closed page.</span></span>
              <Switch checked={link.active} onCheckedChange={(c) => { dispatch({ type: "upsertLink", link: { ...link, active: c } }); toast(c ? "Link resumed" : "Link paused"); }} />
            </label>

            <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border bg-border">
              {[["Visits", link.visits], ["Sales", orders.filter((o) => o.status === "paid").length], ["Conversion", link.visits ? `${((orders.length / link.visits) * 100).toFixed(1)}%` : "—"]].map(([k, v]) => (
                <div key={k as string} className="bg-card p-4">
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="text-2xl font-light tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>

            <div>
              <h3 className="mb-2 text-sm text-muted-foreground">Orders from this link</h3>
              {orders.length ? (
                <StatList>
                  {orders.map((o) => {
                    const c = state.customers.find((x) => x.id === o.customerId);
                    return <StatRow key={o.id} primary={c?.name ?? "—"} secondary={money(o.amount)} trailing={ago(o.createdAt)} />;
                  })}
                </StatList>
              ) : <p className="text-sm text-muted-foreground">No orders yet. Open the link and buy something.</p>}
            </div>
          </div>
        ) : (
          <Empty className="h-full">
            <EmptyHeader>
              <EmptyMedia variant="icon"><LinkIcon /></EmptyMedia>
              <EmptyTitle>{state.links.length ? "Select a checkout link" : "No checkout links"}</EmptyTitle>
              <EmptyDescription>Create a new checkout link to share with your customers.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent><Button onClick={() => setCreating(true)}>Create checkout link</Button></EmptyContent>
          </Empty>
        )}
      </section>

      <CreateLinkDialog open={creating} onOpenChange={setCreating} onCreated={(id) => select(id)} />
    </div>
  );
}

export default function LinksPage() {
  return (
    <React.Suspense>
      <LinksPageInner />
    </React.Suspense>
  );
}
