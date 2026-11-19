import { Portfolio01 } from "@/registry/web/portfolio-01";
import { Testimonials01 } from "@/registry/web/testimonials-01";

export const metadata = { title: "Work" };

export default function Page() {
  return (
    <>
      <Portfolio01 />
      <Testimonials01 />
    </>
  );
}
