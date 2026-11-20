import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@recanica/ui/components/accordion";
import { WebSectionTitle } from "@recanica/ui/components/web-section";

const faqs = [
  ["How much does it cost?", "Free to start. We take 4% + 40¢ per transaction, including tax handling and payouts."],
  ["Are you a merchant of record?", "Yes. We're the seller of record, so we calculate, collect and remit sales tax and VAT for you."],
  ["Can I migrate existing subscribers?", "Yes. Import customers and subscriptions from Stripe without asking anyone to re-enter a card."],
  ["Which countries can receive payouts?", "40+ countries via bank transfer, with more added every quarter."],
  ["Do you support usage-based billing?", "Yes. Send usage events to meters and bill per unit, tiered or volume."],
];

export function Faq01() {
  return (
    <section className="px-gutter py-section">
      <div className="mx-auto grid max-w-content gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <WebSectionTitle>Questions</WebSectionTitle>
          <p className="mt-4 text-muted-foreground">Can't find an answer? <a href="/site/contact" className="text-foreground underline underline-offset-4">Talk to us</a>.</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map(([q, a]) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger className="text-base">{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default Faq01;
