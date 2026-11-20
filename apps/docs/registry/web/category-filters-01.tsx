"use client";

import * as React from "react";
import { SlidersHorizontalIcon } from "lucide-react";
import { Badge } from "@recanica/ui/components/badge";
import { Button } from "@recanica/ui/components/button";
import { Checkbox } from "@recanica/ui/components/checkbox";
import { Label } from "@recanica/ui/components/label";
import { NativeSelect, NativeSelectOption } from "@recanica/ui/components/native-select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@recanica/ui/components/sheet";
import { Slider } from "@recanica/ui/components/slider";

const groups = { Category: ["Coffee", "Tea", "Equipment", "Gifts"], Roast: ["Light", "Medium", "Dark"], Origin: ["Sabah", "Johor", "Imported"] };
type Key = keyof typeof groups;

function Filters({ sel, toggle, price, setPrice }: { sel: Record<Key, string[]>; toggle: (g: Key, v: string) => void; price: number[]; setPrice: (v: number[]) => void }) {
  return (
    <div className="space-y-6">
      {(Object.keys(groups) as Key[]).map((g) => (
        <fieldset key={g} className="space-y-2">
          <legend className="mb-2 text-sm">{g}</legend>
          {groups[g].map((v) => (
            <div key={v} className="flex items-center gap-2">
              <Checkbox id={`${g}-${v}`} checked={sel[g].includes(v)} onCheckedChange={() => toggle(g, v)} />
              <Label htmlFor={`${g}-${v}`} className="font-normal text-muted-foreground">{v}</Label>
            </div>
          ))}
        </fieldset>
      ))}
      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm">Price</legend>
        <Slider value={price} onValueChange={setPrice} min={0} max={300} step={10} />
        <p className="text-xs text-muted-foreground tabular-nums">RM{price[0]} – RM{price[1]}</p>
      </fieldset>
    </div>
  );
}

export function CategoryFilters01() {
  const [sel, setSel] = React.useState<Record<Key, string[]>>({ Category: ["Coffee"], Roast: [], Origin: ["Sabah"] });
  const [price, setPrice] = React.useState([0, 200]);
  const toggle = (g: Key, v: string) => setSel((s) => ({ ...s, [g]: s[g].includes(v) ? s[g].filter((x) => x !== v) : [...s[g], v] }));
  const active = (Object.keys(sel) as Key[]).flatMap((g) => sel[g].map((v) => [g, v] as const));
  const count = 24 - active.length * 4;
  return (
    <section className="px-gutter py-8">
      <div className="mx-auto grid max-w-content gap-8 lg:grid-cols-[14rem_1fr]">
        <aside className="hidden lg:block"><Filters sel={sel} toggle={toggle} price={price} setPrice={setPrice} /></aside>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Sheet>
              <SheetTrigger asChild><Button variant="outline" size="sm" className="lg:hidden"><SlidersHorizontalIcon /> Filters {active.length > 0 && `(${active.length})`}</Button></SheetTrigger>
              <SheetContent side="left" className="w-80"><SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader><div className="overflow-y-auto px-4"><Filters sel={sel} toggle={toggle} price={price} setPrice={setPrice} /></div></SheetContent>
            </Sheet>
            <p className="text-sm text-muted-foreground">{count} products</p>
            <NativeSelect aria-label="Sort by" className="ml-auto w-44" defaultValue="popular">
              <NativeSelectOption value="popular">Most popular</NativeSelectOption>
              <NativeSelectOption value="new">Newest</NativeSelectOption>
              <NativeSelectOption value="low">Price: low to high</NativeSelectOption>
              <NativeSelectOption value="high">Price: high to low</NativeSelectOption>
            </NativeSelect>
          </div>
          {active.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {active.map(([g, v]) => (
                <Badge key={g + v} variant="secondary" onRemove={() => toggle(g, v)} removeLabel={`Remove ${v}`}>{v}</Badge>
              ))}
              <Button variant="link" size="sm" onClick={() => setSel({ Category: [], Roast: [], Origin: [] })}>Clear all</Button>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-square rounded-2xl border bg-muted" />)}</div>
        </div>
      </div>
    </section>
  );
}

export default CategoryFilters01;
