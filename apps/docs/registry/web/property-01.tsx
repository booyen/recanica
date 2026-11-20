import { BathIcon, BedDoubleIcon, HeartIcon, RulerIcon } from "lucide-react";
import { Badge } from "@recanica/ui/components/badge";
import { Button } from "@recanica/ui/components/button";
import { WebSectionTitle } from "@recanica/ui/components/web-section";

const listings = [
  { title: "Corner unit at Mont Kiara", place: "Mont Kiara, Kuala Lumpur", price: "RM 1,280,000", beds: 3, baths: 2, sqft: 1420, tag: "New" },
  { title: "Terrace house near LRT", place: "Subang Jaya, Selangor", price: "RM 890,000", beds: 4, baths: 3, sqft: 1800 },
  { title: "Sea-view apartment", place: "Tanjung Tokong, Penang", price: "RM 3,200 / month", beds: 2, baths: 2, sqft: 1050, tag: "For rent" },
  { title: "Heritage shophouse", place: "Jonker Walk, Melaka", price: "RM 2,450,000", beds: 5, baths: 4, sqft: 3200 },
  { title: "Studio near KLCC", place: "KLCC, Kuala Lumpur", price: "RM 2,100 / month", beds: 1, baths: 1, sqft: 520, tag: "For rent" },
  { title: "Bungalow with garden", place: "Bukit Damansara, KL", price: "RM 6,800,000", beds: 6, baths: 6, sqft: 6200 },
];

/** `titleAs="h1"` when this section is the top of its page (every page needs one h1). */
export function Property01({ titleAs: Title = "h2" }: { titleAs?: "h1" | "h2" }) {
  return (
    <section className="px-gutter py-section-sm">
      <div className="mx-auto max-w-content">
        <div className="flex items-end justify-between gap-4"><WebSectionTitle as={Title}>Featured properties</WebSectionTitle><p className="text-sm text-muted-foreground">{listings.length} listings</p></div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <li key={l.title} className="overflow-hidden rounded-3xl border bg-card">
              <div className="relative aspect-[4/3] bg-muted" role="img" aria-label={l.title}>
                {l.tag && <Badge variant="secondary" className="absolute top-3 left-3">{l.tag}</Badge>}
                <Button variant="secondary" size="icon-sm" className="absolute top-3 right-3" aria-label={`Save ${l.title}`}><HeartIcon /></Button>
              </div>
              <div className="space-y-3 p-5">
                <p className="text-heading tabular-nums">{l.price}</p>
                <div><a href="/site/property/mont-kiara" className="hover:underline">{l.title}</a><p className="text-sm text-muted-foreground">{l.place}</p></div>
                <dl className="flex gap-4 border-t pt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5"><BedDoubleIcon className="size-4" /><dd>{l.beds} <span className="sr-only">bedrooms</span></dd></div>
                  <div className="flex items-center gap-1.5"><BathIcon className="size-4" /><dd>{l.baths} <span className="sr-only">bathrooms</span></dd></div>
                  <div className="flex items-center gap-1.5"><RulerIcon className="size-4" /><dd>{l.sqft.toLocaleString("en-MY")} sqft</dd></div>
                </dl>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Property01;
