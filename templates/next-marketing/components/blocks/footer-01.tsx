// Links point to sections on the home page. Add your own routes (about, contact, legal) as you create those pages.
const columns = [
  { title: "Product", links: [["Features", "#features"], ["Pricing", "#pricing"], ["FAQ", "#faq"]] },
  { title: "Resources", links: [["Recanica docs", "https://github.com/booyen/rekanica-des"]] },
];

export function Footer01() {
  return (
    <footer className="border-t px-gutter pt-section-sm pb-10">
      <div className="mx-auto max-w-content">
        <div className="grid gap-10 lg:grid-cols-[2fr_repeat(2,1fr)]">
          <div className="space-y-3">
            <a href="/" className="flex items-center gap-2"><span className="size-6 rounded-md bg-brand text-brand-foreground" /><span className="font-medium">Aturanica</span></a>
            <p className="max-w-xs text-sm text-muted-foreground">Billing infrastructure for software businesses.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:col-span-2">
            {columns.map((c) => (
              <div key={c.title} className="space-y-3 text-sm">
                <p>{c.title}</p>
                <ul className="space-y-2 text-muted-foreground">
                  {c.links.map(([label, href]) => <li key={href}><a href={href} className="whitespace-nowrap transition-colors hover:text-foreground">{label}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Aturanica Labs · Kuala Lumpur, Malaysia</p>
          <p>Built with Recanica</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer01;
