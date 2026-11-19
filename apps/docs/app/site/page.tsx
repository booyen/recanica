import { Hero03 } from "@/registry/web/hero-03";
import { LogoCloud01 } from "@/registry/web/logo-cloud-01";
import { Intro01 } from "@/registry/web/intro-01";
import { Content01 } from "@/registry/web/content-01";
import { Process01 } from "@/registry/web/process-01";
import { Bento02 } from "@/registry/web/bento-02";
import { Testimonial02 } from "@/registry/web/testimonial-02";
import { Pricing01 } from "@/registry/web/pricing-01";
import { Faq01 } from "@/registry/web/faq-01";
import { Cta01 } from "@/registry/web/cta-01";

export const metadata = { title: "Home" };

export default function Page() {
  return (
    <>
      <Hero03 />
      <LogoCloud01 />
      <Intro01 />
      <Content01 />
      <Process01 />
      <Bento02 />
      <Testimonial02 />
      <Pricing01 />
      <Faq01 />
      <Cta01 />
    </>
  );
}
