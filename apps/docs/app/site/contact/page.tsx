import { Contact01 } from "@/registry/web/contact-01";
import { Faq01 } from "@/registry/web/faq-01";

export const metadata = { title: "Contact" };

export default function Page() {
  return (
    <>
      <Contact01 />
      <Faq01 />
    </>
  );
}
