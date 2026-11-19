import { SingleProduct01 } from "@/registry/web/single-product-01";
import { Products01 } from "@/registry/web/products-01";

export const metadata = { title: "Product" };

export default function Page() {
  return (
    <>
      <SingleProduct01 />
      <Products01 />
    </>
  );
}
