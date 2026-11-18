"use client";

import * as React from "react";
import { BuildingIcon, CreditCardIcon, QrCodeIcon } from "lucide-react";
import { NativeSelect, NativeSelectOption } from "@rekanica/ui/components/native-select";
import { cn } from "@rekanica/ui/lib/utils";
import { FPX_BANKS, hash } from "@/lib/demo/my";

/**
 * Deterministic QR-looking grid for demos (NOT a scannable QR code).
 * Used for MyInvois validation links and DuitNow QR in the demo.
 */
export function DemoQr({ value, size = 112, className, label = "Demo QR" }: { value: string; size?: number; className?: string; label?: string }) {
  const n = 25;
  let h = hash(value);
  const cells: boolean[] = [];
  for (let i = 0; i < n * n; i++) { h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0; cells.push((h & 7) < 3); }
  const finder = (x: number, y: number) => {
    const inBox = (ox: number, oy: number) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
    for (const [ox, oy] of [[0, 0], [n - 7, 0], [0, n - 7]]) {
      if (inBox(ox, oy)) {
        const dx = x - ox, dy = y - oy;
        return dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4) ? 1 : 0;
      }
    }
    return -1;
  };
  return (
    <svg viewBox={`0 0 ${n} ${n}`} width={size} height={size} role="img" aria-label={label} className={cn("rounded-md bg-white p-1.5 text-black", className)} shapeRendering="crispEdges">
      {Array.from({ length: n * n }).map((_, i) => {
        const x = i % n, y = Math.floor(i / n);
        const f = finder(x, y);
        const on = f === -1 ? cells[i] : f === 1;
        return on ? <rect key={i} x={x} y={y} width={1} height={1} fill="currentColor" /> : null;
      })}
    </svg>
  );
}

export type PayMethod = "fpx" | "duitnow" | "card";

export function PaymentMethodPicker({ amountLabel, value, onChange, bank, onBank, reference }: {
  amountLabel: string; value: PayMethod; onChange: (m: PayMethod) => void; bank: string; onBank: (b: string) => void; reference: string;
}) {
  const methods: { id: PayMethod; label: string; hint: string; icon: typeof BuildingIcon }[] = [
    { id: "fpx", label: "FPX online banking", hint: "Pay from your bank account", icon: BuildingIcon },
    { id: "duitnow", label: "DuitNow QR", hint: "Scan with any banking or e-wallet app", icon: QrCodeIcon },
    { id: "card", label: "Card", hint: "Visa, Mastercard, AMEX", icon: CreditCardIcon },
  ];
  return (
    <div className="space-y-3">
      <div role="radiogroup" aria-label="Payment method" className="grid gap-2">
        {methods.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={value === m.id}
            onClick={() => onChange(m.id)}
            className={cn("flex items-center gap-3 rounded-xl border p-3 text-left text-sm transition-colors hover:bg-accent", value === m.id && "border-foreground/40 bg-accent")}
          >
            <m.icon className="size-4 text-muted-foreground" />
            <span className="flex-1">{m.label}<span className="block text-xs text-muted-foreground">{m.hint}</span></span>
            <span className={cn("size-4 rounded-full border", value === m.id && "border-[5px] border-foreground")} />
          </button>
        ))}
      </div>
      {value === "fpx" && (
        <NativeSelect aria-label="Bank" value={bank} onChange={(e) => onBank(e.target.value)} className="w-full">
          {FPX_BANKS.map((b) => <NativeSelectOption key={b} value={b}>{b}</NativeSelectOption>)}
        </NativeSelect>
      )}
      {value === "duitnow" && (
        <div className="flex items-center gap-4 rounded-xl border p-4">
          <DemoQr value={reference} size={96} label="DuitNow QR (demo)" />
          <div className="text-sm">
            <p>Scan to pay {amountLabel}</p>
            <p className="text-xs text-muted-foreground">Demo QR, not scannable. Click pay to simulate a successful transfer.</p>
          </div>
        </div>
      )}
      {value === "card" && (
        <p className="rounded-xl border bg-muted/40 p-3 text-sm text-muted-foreground">Simulated card. No card details are collected in this demo.</p>
      )}
    </div>
  );
}

export const methodLabel = (m: PayMethod, bank: string) => (m === "fpx" ? `FPX · ${bank}` : m === "duitnow" ? "DuitNow QR" : "Card");
