const events = [
  { date: "2022", title: "Started in a shared office in Bangsar", body: "Two founders, one invoice template and a lot of spreadsheets." },
  { date: "2023", title: "First 100 customers", body: "Mostly design studios and online shops in the Klang Valley." },
  { date: "2024", title: "FPX and DuitNow payments", body: "Customers could pay invoices directly instead of transferring manually." },
  { date: "2025", title: "MyInvois e-Invoice", body: "Every invoice validated with LHDN automatically." },
  { date: "2026", title: "Payment plans", body: "Deposits and instalments for larger projects." },
];

export function Timeline01() {
  return (
    <section className="px-gutter py-section">
      <div className="mx-auto max-w-narrow">
        <h2 className="text-display-sm tracking-tight">Our story so far</h2>
        <ol className="relative mt-12 space-y-10 border-l pl-8">
          {events.map((e) => (
            <li key={e.date} className="relative">
              <span className="absolute top-1.5 -left-[37px] size-2.5 rounded-full border-2 border-background bg-foreground" aria-hidden />
              <time className="font-mono text-xs text-muted-foreground">{e.date}</time>
              <h3 className="mt-1">{e.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{e.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Timeline01;
