const logos = ["Northwind", "Lumen", "Acme", "Globex", "Initech", "Umbrella"];

export function LogoCloud01() {
  return (
    <section className="px-gutter py-section-sm">
      <div className="mx-auto max-w-content text-center">
        <p className="text-sm text-muted-foreground">Trusted by teams shipping every day</p>
        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-3 lg:grid-cols-6">
          {logos.map((l) => (
            <div key={l} className="flex h-20 items-center justify-center bg-background text-lg tracking-tight text-muted-foreground transition-colors hover:text-foreground">
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LogoCloud01;
