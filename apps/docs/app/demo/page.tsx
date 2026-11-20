"use client";

import Link from "next/link";
import { ArrowRightIcon, LayoutDashboardIcon, RotateCcwIcon, ShoppingCartIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@recanica/ui/components/button";
import { useDemo } from "@/lib/demo/store";
import { Heading } from "@recanica/ui/components/page";
import { SurfaceGrid } from "@recanica/ui/components/surface";

export default function DemoHome() {
  const { state, dispatch } = useDemo();
  const link = state.links.find((l) => l.active);
  return (
    <main className="flex min-h-svh items-center justify-center bg-sidebar px-gutter py-12">
      <div className="w-full max-w-lg space-y-8">
        <div className="space-y-3 text-center">
          <span className="mx-auto block size-10 rounded-xl bg-brand text-brand-foreground" />
          <Heading level={1}>Recanica clickable demo</Heading>
          <p className="text-muted-foreground">
            A working product built with Recanica. Everything is fake data kept in your browser. Nothing is sent anywhere.
          </p>
        </div>
        <SurfaceGrid>
          <Link href={state.signedIn ? "/demo/app" : "/demo/sign-in"} className="group flex items-center gap-4 bg-panel p-5 transition-colors hover:bg-accent">
            <LayoutDashboardIcon className="size-5 text-muted-foreground" />
            <span className="flex-1">Open the seller dashboard<span className="block text-sm text-muted-foreground">Products, customers, invoices, payouts</span></span>
            <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
          {link && (
            <Link href={`/demo/checkout/${link.id}`} className="group flex items-center gap-4 bg-panel p-5 transition-colors hover:bg-accent">
              <ShoppingCartIcon className="size-5 text-muted-foreground" />
              <span className="flex-1">Buy as a customer<span className="block text-sm text-muted-foreground">Checkout link “{link.label}”. The order shows up in the dashboard.</span></span>
              <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </SurfaceGrid>
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" onClick={() => { dispatch({ type: "reset" }); toast("Demo data reset"); }}>
            <RotateCcwIcon /> Reset demo data
          </Button>
          <Link href="/docs" className="-my-1 inline-block py-1 hover:text-foreground">← Back to the design system</Link>
        </div>
      </div>
    </main>
  );
}
