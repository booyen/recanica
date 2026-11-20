import { CheckIcon, MailIcon, PackageIcon, TruckIcon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";
import { WebSectionTitle } from "@recanica/ui/components/web-section";
import { SurfaceGrid } from "@recanica/ui/components/surface";
import { IconBadge } from "@recanica/ui/components/layout";

const next = [
  { icon: MailIcon, title: "Receipt sent", body: "To nadia@example.com. Keep it for returns." },
  { icon: PackageIcon, title: "Packing", body: "We pack orders within 1 business day." },
  { icon: TruckIcon, title: "Delivery", body: "Tracking link by SMS when it ships." },
];

export function ThankYou01() {
  return (
    <section className="flex min-h-[600px] items-center px-gutter py-section-sm">
      <div className="mx-auto w-full max-w-narrow space-y-10 text-center">
        <div className="space-y-4">
          <IconBadge className="mx-auto"><CheckIcon className="size-5" /></IconBadge>
          <WebSectionTitle as="h1">Thank you, Nadia</WebSectionTitle>
          <p className="text-muted-foreground">Order <span className="font-mono text-foreground">#AC-20431</span> is confirmed. Total paid RM254.00.</p>
        </div>
        <SurfaceGrid as="ol" className="text-left sm:grid-cols-3">
          {next.map((n) => <li key={n.title} className="space-y-2 bg-background p-5"><n.icon className="size-4 text-muted-foreground" /><p className="text-sm">{n.title}</p><p className="text-sm text-muted-foreground">{n.body}</p></li>)}
        </SurfaceGrid>
        <div className="flex flex-col justify-center gap-2 sm:flex-row">
          <Button>Track order</Button>
          <Button variant="outline">Continue shopping</Button>
        </div>
      </div>
    </section>
  );
}

export default ThankYou01;
