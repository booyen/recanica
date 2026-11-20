import { Banner01 } from "@/registry/web/banner-01";
import { Products01 } from "@/registry/web/products-01";
import { CategoryFilters01 } from "@/registry/web/category-filters-01";

export const metadata = { title: "Shop" };

export default function Page() {
  return (
    <>
      <Banner01 />
      <Products01 titleAs="h1" />
      <CategoryFilters01 />
    </>
  );
}
