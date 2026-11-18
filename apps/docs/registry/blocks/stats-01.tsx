const stats = [
  { value: "$120M+", label: "processed for creators" },
  { value: "14k", label: "software businesses" },
  { value: "99.99%", label: "checkout uptime" },
  { value: "40+", label: "payout countries" },
];

export function Stats01() {
  return (
    <section className="px-gutter py-section-sm">
      <dl className="mx-auto grid max-w-content grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-background p-panel">
            <dd className="text-[2rem] leading-none font-light tracking-tight sm:text-display-sm">{s.value}</dd>
            <dt className="mt-2 text-sm text-muted-foreground">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default Stats01;
