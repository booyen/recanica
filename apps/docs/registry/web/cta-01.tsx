import { ArrowRightIcon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";

export function Cta01() {
  return (
    <section className="px-gutter py-section-sm">
      <div className="relative mx-auto max-w-content overflow-hidden rounded-3xl border bg-card px-6 py-16 text-center sm:px-12 sm:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-48 mx-auto h-80 max-w-2xl rounded-full bg-foreground/10 blur-3xl" />
        <div className="relative mx-auto max-w-2xl space-y-6">
          <h2 className="text-display-sm tracking-tight text-balance text-brand sm:text-display-md">Start selling today</h2>
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
