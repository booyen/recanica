const steps = [
  { title: "Create your account", body: "Sign up with your work email. Takes two minutes." },
  { title: "Add your business details", body: "SSM number, TIN and bank account for payouts." },
  { title: "Send your first invoice", body: "Or share a payment link on WhatsApp." },
  { title: "Get paid", body: "Money lands in your bank in 2 business days." },
];

export function Process01() {
  return (
    <section className="px-gutter py-section">
      <div className="mx-auto max-w-content">
        <h2 className="max-w-xl text-display-sm tracking-tight">How it works</h2>
        <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="space-y-3 bg-background p-panel">
              <span className="flex size-8 items-center justify-center rounded-full border font-mono text-xs">{i + 1}</span>
              <h3>{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Process01;
