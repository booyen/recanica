import { SearchIcon } from "lucide-react";
import { Button } from "@rekanica/ui/components/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@rekanica/ui/components/input-group";

const links = [["Home", "Start again from the home page"], ["Pricing", "Plans and fees"], ["Help centre", "Guides and contact"]];

export function Error01() {
  return (
    <div className="flex min-h-[640px] items-center justify-center bg-background px-gutter py-12">
      <div className="w-full max-w-md space-y-8 text-center">
        <p className="text-display-lg font-light text-metallic">404</p>
        <div className="space-y-2">
          <h1 className="text-title">We can&apos;t find that page</h1>
          <p className="text-muted-foreground">The link may be old, or the page was moved. Try searching, or go to one of these:</p>
        </div>
        <InputGroup><InputGroupAddon><SearchIcon /></InputGroupAddon><InputGroupInput placeholder="Search the site" aria-label="Search the site" /></InputGroup>
        <ul className="divide-y rounded-2xl border text-left">
          {links.map(([t, d]) => <li key={t}><a href="#" className="block px-5 py-3 hover:bg-accent/40"><span className="text-sm">{t}</span><span className="block text-xs text-muted-foreground">{d}</span></a></li>)}
        </ul>
        <Button variant="outline">Report a broken link</Button>
      </div>
    </div>
  );
}

export default Error01;
