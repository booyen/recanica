import { BarChart3Icon, GlobeIcon, KeyRoundIcon, LayersIcon, ReceiptIcon, ZapIcon } from "lucide-react";
import { WebSectionTitle } from "@recanica/ui/components/web-section";
import { SurfaceGrid } from "@recanica/ui/components/surface";

const features = [
  { icon: ZapIcon, title: "Checkout in one line", body: "Drop-in hosted checkout or embed it. Live in minutes." },
  { icon: LayersIcon, title: "Subscriptions", body: "Trials, upgrades, proration and dunning, built in." },
  { icon: ReceiptIcon, title: "Global tax", body: "We calculate, collect and remit as merchant of record." },
  { icon: KeyRoundIcon, title: "Benefits", body: "License keys, file downloads and repo access on purchase." },
  { icon: BarChart3Icon, title: "Analytics", body: "MRR, churn and cohorts without a spreadsheet." },
  { icon: GlobeIcon, title: "Payouts", body: "Get paid in 40+ countries on your schedule." },
];

export function Features01() {
  return (
    <section className="px-gutter py-section">
      <div className="mx-auto max-w-content">
        <div className="max-w-2xl">
          <WebSectionTitle>Everything to sell software</WebSectionTitle>
          <p className="mt-4 text-muted-foreground sm:text-lg">One platform, from first checkout to thousandth renewal.</p>
        </div>
        <SurfaceGrid className="mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="space-y-3 bg-background p-panel">
              <span className="flex size-10 items-center justify-center rounded-xl border bg-muted"><f.icon className="size-5" /></span>
              <h3>{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </SurfaceGrid>
      </div>
    </section>
  );
}

export default Features01;
