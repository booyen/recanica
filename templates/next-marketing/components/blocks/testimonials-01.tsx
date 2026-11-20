import { Avatar, AvatarFallback } from "@recanica/ui/components/avatar";
import { WebSectionTitle } from "@recanica/ui/components/web-section";
import { Surface } from "@recanica/ui/components/surface";

const quotes = [
  { body: "We moved our entire billing over in an afternoon. Taxes stopped being a weekly fire drill.", name: "Nadia Rahman", role: "Founder, Lumen", initials: "NR" },
  { body: "The dashboard is the first one my co-founder actually opens. It's calm and it's correct.", name: "Leo Tan", role: "CTO, Northwind", initials: "LT" },
  { body: "Benefits are the killer feature. License keys and repo access just happen.", name: "Mei Kato", role: "Indie developer", initials: "MK" },
  { body: "Support replied in 20 minutes with the exact API call I needed.", name: "Arjun Mehta", role: "Engineer, Globex", initials: "AM" },
  { body: "Checkout conversion went up 18% the week we switched.", name: "Chloe Martin", role: "Growth, Initech", initials: "CM" },
  { body: "Refunds, invoices and payouts are on the same screen. I stopped using three other tools.", name: "Hana Lee", role: "Designer, Acme", initials: "HL" },
];

export function Testimonials01() {
  return (
    <section className="px-gutter py-section">
      <div className="mx-auto max-w-content">
        <WebSectionTitle className="max-w-xl">Loved by builders</WebSectionTitle>
        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {quotes.map((q) => (
            <Surface as="figure" inset="lg" className="mb-4 break-inside-avoid" key={q.name}>
              <blockquote className="text-pretty">“{q.body}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 text-sm">
                <Avatar><AvatarFallback>{q.initials}</AvatarFallback></Avatar>
                <span>{q.name}<span className="block text-muted-foreground">{q.role}</span></span>
              </figcaption>
            </Surface>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials01;
