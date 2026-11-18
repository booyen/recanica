import { Avatar, AvatarFallback } from "@rekanica/ui/components/avatar";

const quotes = [
  { body: "We moved our entire billing over in an afternoon. Taxes stopped being a weekly fire drill.", name: "Nadia Rahman", role: "Founder, Lumen", initials: "NR" },
  { body: "The dashboard is the first one my co-founder actually opens. It's calm and it's correct.", name: "Leo Tan", role: "CTO, Northwind", initials: "LT" },
  { body: "Benefits are the killer feature. License keys and repo access just happen.", name: "Mei Kato", role: "Indie developer", initials: "MK" },
  { body: "Support answered in minutes, with code. That never happens.", name: "Arjun Mehta", role: "Engineer, Globex", initials: "AM" },
  { body: "Checkout conversion went up 18% the week we switched.", name: "Chloe Martin", role: "Growth, Initech", initials: "CM" },
  { body: "It feels like it was designed by people who sell software themselves.", name: "Hana Lee", role: "Designer, Acme", initials: "HL" },
];

export function Testimonials01() {
  return (
    <section className="px-gutter py-section">
      <div className="mx-auto max-w-content">
        <h2 className="max-w-xl text-display-sm tracking-tight">Loved by builders</h2>
        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {quotes.map((q) => (
            <figure key={q.name} className="mb-4 break-inside-avoid rounded-2xl border bg-card p-panel">
              <blockquote className="text-pretty">“{q.body}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 text-sm">
                <Avatar><AvatarFallback>{q.initials}</AvatarFallback></Avatar>
                <span>{q.name}<span className="block text-muted-foreground">{q.role}</span></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials01;
