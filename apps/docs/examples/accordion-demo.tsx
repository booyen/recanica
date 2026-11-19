"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@recanica/ui/components/accordion";

export default function AccordionDemo() {
  return (
    <Accordion type="single" collapsible defaultValue="a" className="w-full max-w-lg">
      <AccordionItem value="a"><AccordionTrigger>What payment methods do you support?</AccordionTrigger><AccordionContent>Cards, bank transfer and local wallets.</AccordionContent></AccordionItem>
      <AccordionItem value="b"><AccordionTrigger>Can I cancel anytime?</AccordionTrigger><AccordionContent>Yes. Your plan stays active until the end of the period.</AccordionContent></AccordionItem>
      <AccordionItem value="c"><AccordionTrigger>Do you handle sales tax?</AccordionTrigger><AccordionContent>We calculate, collect and remit tax as merchant of record.</AccordionContent></AccordionItem>
    </Accordion>
  );
}
