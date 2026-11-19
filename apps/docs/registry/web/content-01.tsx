import { CheckIcon } from "lucide-react";
import { cn } from "@rekanica/ui/lib/utils";

const rows = [
  { eyebrow: "Invoicing", title: "Create an invoice in under a minute", body: "Pick a customer, add line items and choose SST. The invoice is numbered, validated with LHDN and sent.", points: ["Payment plans with deposits", "Reminders before and after the due date"] },
  { eyebrow: "Payments", title: "Let customers pay the way they already do", body: "Every invoice links to a payment page with FPX, DuitNow QR and cards. Partial payments are tracked for you.", points: ["Settlement in 2 business days", "Refunds from the same screen"] },
  { eyebrow: "Reports", title: "Know where the money is", body: "See what's paid, what's overdue and what's coming in next month, without opening a spreadsheet.", points: ["Export to CSV for your accountant", "SST summary per period"] },
];

function Img({ label }: { label: string }) {
  return <div className="flex aspect-[4/3] items-center justify-center rounded-3xl border bg-muted text-xs text-muted-foreground" role="img" aria-label={label}>{label}</div>;
}

export function Content01() {
  return (
    <section className="px-gutter py-section">
      <div className="mx-auto max-w-content space-y-section-sm">
        {rows.map((r, i) => (
          <div key={r.title} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className={cn("space-y-4", i % 2 === 1 && "lg:order-2")}>
              <p className="text-sm text-muted-foreground">{r.eyebrow}</p>
              <h2 className="text-heading sm:text-title">{r.title}</h2>
              <p className="text-muted-foreground">{r.body}</p>
              <ul className="space-y-2 text-sm">{r.points.map((p) => <li key={p} className="flex items-center gap-2"><CheckIcon className="size-4" /> {p}</li>)}</ul>
            </div>
            <Img label={`${r.eyebrow} screenshot`} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Content01;
