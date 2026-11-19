import { Avatar, AvatarFallback } from "@recanica/ui/components/avatar";
import { Badge } from "@recanica/ui/components/badge";

export function PostHero01() {
  return (
    <header className="px-gutter pt-section-sm">
      <div className="mx-auto max-w-narrow space-y-6 text-center">
        <Badge variant="outline">Tax</Badge>
        <h1 className="text-display-sm tracking-tight text-balance sm:text-display-md">What changes for small businesses with e-Invoice in 2026</h1>
        <p className="text-muted-foreground sm:text-lg">Who needs to comply, by when, and what the validation QR on your invoice actually does.</p>
        <div className="flex items-center justify-center gap-3 text-sm">
          <Avatar><AvatarFallback>TW</AvatarFallback></Avatar>
          <span className="text-left">Tan Wei Ming<span className="block text-muted-foreground">12 Nov 2026 · 6 min read</span></span>
        </div>
      </div>
      <div className="mx-auto mt-12 aspect-[21/9] max-w-content rounded-3xl border bg-muted" role="img" aria-label="Article cover placeholder" />
    </header>
  );
}

export default PostHero01;
