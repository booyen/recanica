import { CheckIcon } from "lucide-react";
import { Badge } from "@recanica/ui/components/badge";
import { Button } from "@recanica/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@recanica/ui/components/card";
import { cn } from "@recanica/ui/lib/utils";

const tiers = [
  { name: "Starter", price: "$0", blurb: "For individuals trying things out.", features: ["1 workspace", "Community support", "Basic analytics"] },
  { name: "Pro", price: "$29", blurb: "For growing teams.", features: ["Unlimited workspaces", "Priority support", "Advanced analytics", "SSO"], featured: true },
  { name: "Enterprise", price: "Custom", blurb: "For large organizations.", features: ["Dedicated success manager", "SLA", "Audit logs"] },
];

export function Pricing01() {
  return (
    <section className="mx-auto max-w-content px-gutter py-section">
      <div className="mb-12 text-center">
        <h2 className="text-display-sm tracking-tight">Simple pricing</h2>
        <p className="mt-3 text-muted-foreground">Start free. Upgrade when you're ready.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {tiers.map((t) => (
          <Card key={t.name} className={cn(t.featured && "border-foreground/25 shadow-float")}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t.name}</CardTitle>
                {t.featured && <Badge variant="brand">Popular</Badge>}
              </div>
              <CardDescription>{t.blurb}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-4xl font-light tracking-tight text-brand">
                {t.price}
                {t.price.startsWith("$") && <span className="text-base font-normal text-muted-foreground">/mo</span>}
              </p>
              <ul className="space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2"><CheckIcon className="size-4 text-brand" />{f}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className="w-full" variant={t.featured ? "brand" : "outline"}>Choose {t.name}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default Pricing01;
