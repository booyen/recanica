import { MailIcon } from "lucide-react";
import { Badge } from "@recanica/ui/components/badge";
import { Button } from "@recanica/ui/components/button";
import { WebSectionTitle } from "@recanica/ui/components/web-section";

export function SingleTeam01() {
  return (
    <section className="px-gutter py-section-sm">
      <div className="mx-auto grid max-w-content gap-10 md:grid-cols-[18rem_1fr] md:gap-16">
        <div className="flex aspect-[4/5] items-center justify-center rounded-3xl border bg-muted text-display-sm font-light text-muted-foreground" role="img" aria-label="Photo of Mei Kato">MK</div>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">Design</p>
            <WebSectionTitle as="h1">Mei Kato</WebSectionTitle>
          </div>
          <p className="max-w-copy text-muted-foreground">Mei leads design at Acme. Before joining, she spent six years designing banking apps in Tokyo and Singapore. She cares about invoices that customers can read without squinting.</p>
          <div className="flex flex-wrap gap-2">{["Product design", "Design systems", "Accessibility"].map((t) => <Badge key={t} variant="outline">{t}</Badge>)}</div>
          <dl className="grid max-w-md grid-cols-2 gap-4 border-t pt-6 text-sm">
            <div><dt className="text-muted-foreground">Based in</dt><dd>Kuala Lumpur</dd></div>
            <div><dt className="text-muted-foreground">Joined</dt><dd>March 2024</dd></div>
          </dl>
          <Button variant="outline"><MailIcon /> Email Mei</Button>
        </div>
      </div>
    </section>
  );
}

export default SingleTeam01;
