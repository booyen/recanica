"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArchiveIcon, ArchiveRestoreIcon, CheckIcon, LinkIcon, PencilIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@recanica/ui/components/badge";
import { Button } from "@recanica/ui/components/button";
import { Stat, StatGroup, StatHeader, StatList, StatRow, StatValue } from "@recanica/ui/components/stat";
import { NotFound, PageHeader, Section } from "@/components/demo/ui";
import { ago, money, price, uid, useDemo } from "@/lib/demo/store";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { state, dispatch } = useDemo();
  const router = useRouter();
  const product = state.products.find((p) => p.id === id);
  if (!product) return <NotFound what="Product" href="/demo/app/products" />;

  const orders = state.orders.filter((o) => o.productId === id);
  const paid = orders.filter((o) => o.status === "paid");
  const subs = state.subscriptions.filter((s) => s.productId === id && s.status === "active");
  const links = state.links.filter((l) => l.productId === id);

  const createLink = () => {
    const link = { id: uid("lnk"), label: product.name, productId: id, active: true, visits: 0, createdAt: new Date().toISOString() };
    dispatch({ type: "upsertLink", link });
    toast.success("Checkout link created");
    router.push(`/demo/app/links?id=${link.id}`);
  };

  return (
    <>
      <PageHeader
        back={{ href: "/demo/app/products", label: "Catalogue" }}
        title={<span className="flex flex-wrap items-center gap-2">{product.name} {product.archived && <Badge variant="muted">Archived</Badge>}</span>}
        description={product.description || "No description"}
        actions={
          <>
            <Button variant="outline" asChild><Link href={`/demo/app/products/${id}/edit`}><PencilIcon /> Edit</Link></Button>
            <Button
              variant="outline"
              onClick={() => {
                dispatch({ type: "archiveProduct", id, archived: !product.archived });
                toast(product.archived ? "Product restored" : "Product archived");
              }}
            >
              {product.archived ? <><ArchiveRestoreIcon /> Restore</> : <><ArchiveIcon /> Archive</>}
            </Button>
            {!product.archived && <Button onClick={createLink}><LinkIcon /> Checkout link</Button>}
          </>
        }
      />

      <StatGroup>
        <Stat><StatHeader title="Price" /><StatValue value={price(product)} caption={product.type === "recurring" ? "subscription" : "one-time"} /></Stat>
        <Stat><StatHeader title="Revenue" /><StatValue value={<span className="text-brand">{money(paid.reduce((a, o) => a + o.amount, 0))}</span>} caption={`${paid.length} orders`} /></Stat>
        <Stat><StatHeader title="Active subscriptions" /><StatValue value={subs.length} /></Stat>
      </StatGroup>

      <div className="grid gap-x-6 lg:grid-cols-2">
        <Section title="Benefits">
          {product.benefits.length ? (
            <ul className="divide-y rounded-2xl border bg-card">
              {product.benefits.map((b) => <li key={b} className="flex items-center gap-2 px-5 py-3 text-sm"><CheckIcon className="size-4" /> {b}</li>)}
            </ul>
          ) : <p className="text-sm text-muted-foreground">No benefits attached.</p>}
        </Section>
        <Section title="Checkout links">
          {links.length ? (
            <ul className="divide-y rounded-2xl border bg-card">
              {links.map((l) => (
                <li key={l.id}>
                  <Link href={`/demo/app/links?id=${l.id}`} className="flex items-center justify-between px-5 py-3 text-sm hover:bg-accent/50">
                    {l.label} <span className="text-muted-foreground">{l.visits} visits</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-muted-foreground">No links yet.</p>}
        </Section>
      </div>

      <Section title="Recent orders">
        {orders.length ? (
          <div className="rounded-2xl border bg-card px-panel">
            <StatList className="border-t-0">
              {orders.slice(0, 8).map((o) => {
                const c = state.customers.find((x) => x.id === o.customerId);
                return <StatRow key={o.id} primary={c?.name ?? "—"} secondary={o.status === "refunded" ? "Refunded" : money(o.amount)} trailing={ago(o.createdAt)} />;
              })}
            </StatList>
          </div>
        ) : <p className="text-sm text-muted-foreground">No orders yet. Share a checkout link to make your first sale.</p>}
      </Section>
    </>
  );
}
