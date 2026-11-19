import { SinglePortfolio01 } from "@/registry/web/single-portfolio-01";
import { Cta01 } from "@/registry/web/cta-01";

export const metadata = { title: "Case study" };

export default function Page() {
  return (
    <>
      <SinglePortfolio01 />
      <Cta01 />
    </>
  );
}
