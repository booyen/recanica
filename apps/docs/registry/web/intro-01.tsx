const points = [
  { title: "For small teams", body: "Built for studios and shops of 1–50 people. No finance team required." },
  { title: "Malaysia first", body: "SST, MyInvois e-Invoice, FPX and DuitNow out of the box." },
  { title: "Fair pricing", body: "3% per transaction. No setup fee, no monthly minimum." },
];

export function Intro01() {
  return (
    <section className="px-gutter py-section-sm">
      <div className="mx-auto max-w-content">
        <p className="max-w-3xl text-heading text-balance sm:text-title">
          Acme is billing software for small businesses that sell online.{" "}
          <span className="text-muted-foreground">It takes care of invoices, payments and tax, so you can spend the afternoon on the work that pays.</span>
        </p>
        <div className="mt-12 grid gap-8 border-t pt-8 sm:grid-cols-3">
          {points.map((p) => (
            <div key={p.title}>
              <h3>{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Intro01;
