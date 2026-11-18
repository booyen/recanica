import { Bento02 } from "@/components/blocks/bento-02";
import { Cta01 } from "@/components/blocks/cta-01";
import { Faq01 } from "@/components/blocks/faq-01";
import { Features01 } from "@/components/blocks/features-01";
import { Footer01 } from "@/components/blocks/footer-01";
import { Hero02 } from "@/components/blocks/hero-02";
import { LogoCloud01 } from "@/components/blocks/logo-cloud-01";
import { Navbar01 } from "@/components/blocks/navbar-01";
import { Pricing01 } from "@/components/blocks/pricing-01";
import { Testimonials01 } from "@/components/blocks/testimonials-01";

// A full landing page composed only from Rekanica blocks. Edit the copy inside components/blocks/*.
export default function Home() {
  return (
    <>
      <Navbar01 />
      <main>
        <Hero02 />
        <LogoCloud01 />
        <Features01 />
        <Bento02 />
        <Testimonials01 />
        <Pricing01 />
        <Faq01 />
        <Cta01 />
      </main>
      <Footer01 />
    </>
  );
}
