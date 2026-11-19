"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BoxIcon, PlusIcon } from "lucide-react";
import { Badge } from "@recanica/ui/components/badge";
import { Button } from "@recanica/ui/components/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@recanica/ui/components/empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@recanica/ui/components/table";
import { Tabs, TabsList, TabsTrigger } from "@recanica/ui/components/tabs";
import { PageHeader } from "@/components/demo/ui";
import { money, price, useDemo } from "@/lib/demo/store";

export default function ProductsPage() {
  const { state } = useDemo();
  const router = useRouter();
  const [tab, setTab] = React.useState("active");
  const list = state.products.filter((p) => (tab === "active" ? !p.archived : p.archived));

  return (
    <>
      <PageHeader
        title="Catalogue"
        description="Products your customers can buy."
        actions={<Button asChild><Link href="/demo/app/products/new"><PlusIcon /> New product</Link></Button>}
      />
      <Tabs value={tab} onValueChange={setTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="active">Active <span className="text-xs text-muted-foreground">{state.products.filter((p) => !p.archived).length}</span></TabsTrigger>
          <TabsTrigger value="archived">Archived <span className="text-xs text-muted-foreground">{state.products.filter((p) => p.archived).length}</span></TabsTrigger>
        </TabsList>
      </Tabs>

      {list.length === 0 ? (
        <Empty className="rounded-2xl border">
          <EmptyHeader>
            <EmptyMedia variant="icon"><BoxIcon /></EmptyMedia>
            <EmptyTitle>{tab === "active" ? "No products yet" : "Nothing archived"}</EmptyTitle>
            <EmptyDescription>{tab === "active" ? "Create your first product to start selling." : "Archived products show up here."}</EmptyDescription>
          </EmptyHeader>
          {tab === "active" && <EmptyContent><Button asChild><Link href="/demo/app/products/new">Create product</Link></Button></EmptyContent>}
        </Empty>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Product</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden text-right md:table-cell">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((p) => {
                const revenue = state.orders.filter((o) => o.productId === p.id && o.status === "paid").reduce((a, o) => a + o.amount, 0);
                return (
                  <TableRow key={p.id} className="cursor-pointer" onClick={() => router.push(`/demo/app/products/${p.id}`)}>
                    <TableCell className="pl-4">
                      <Link href={`/demo/app/products/${p.id}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>{p.name}</Link>
                      <span className="block max-w-xs truncate text-xs text-muted-foreground">{p.description || "No description"}</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell"><Badge variant="muted">{p.type === "recurring" ? "Subscription" : "One-time"}</Badge></TableCell>
                    <TableCell className="tabular-nums">{price(p)}</TableCell>
                    <TableCell className="hidden text-right tabular-nums md:table-cell">{money(revenue)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
