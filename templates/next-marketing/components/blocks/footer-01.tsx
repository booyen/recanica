const columns = [
  { title: "Product", links: ["Checkout", "Subscriptions", "Benefits", "Analytics", "Pricing"] },
  { title: "Developers", links: ["Docs", "API reference", "SDKs", "Status"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
  { title: "Legal", links: ["Terms", "Privacy", "Acceptable use"] },
];

export function Footer01() {
  return (
    <footer className="border-t px-gutter pt-section-sm pb-10">
      <div className="mx-auto max-w-content">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div className="space-y-3">
            <a href="#" className="flex items-center gap-2"><span className="size-6 rounded-md bg-metallic" /><span className="font-medium">Aturanica</span></a>
            <p className="max-w-xs text-sm text-muted-foreground">Billing infrastructure for software businesses.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-4">
            {columns.map((c) => (
              <div key={c.title} className="space-y-3 text-sm">
                <p>{c.title}</p>
                <ul className="space-y-2 text-muted-foreground">
                  {c.links.map((l) => <li key={l}><a href="#" className="transition-colors hover:text-foreground">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Aturanica. All rights reserved.</p>
          <p>Made with Rekanica.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer01;
