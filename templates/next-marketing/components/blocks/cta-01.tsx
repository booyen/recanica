import { ArrowRightIcon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";
import { WebHeroTitle } from "@recanica/ui/components/web-section";

export function Cta01() {
  return (
    <section className="px-gutter py-section-sm">
      <div className="mx-auto max-w-content rounded-3xl border bg-card px-6 py-16 text-center sm:px-12 sm:py-20">
        <div className="mx-auto max-w-2xl space-y-6">
          <WebHeroTitle as="h2" className="text-brand">Start selling today</WebHeroTitle>
          <p className="text-muted-foreground sm:text-lg">No setup fees. No monthly minimum. Your first checkout in five minutes.</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="brand">Create account <ArrowRightIcon /></Button>
            <Button size="lg" variant="outline">Talk to sales</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cta01;
