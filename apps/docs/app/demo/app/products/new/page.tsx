"use client";

import { ProductForm } from "@/components/demo/product-form";
import { PageHeader } from "@/components/demo/ui";

export default function NewProductPage() {
  return (
    <>
      <PageHeader title="New product" description="Create something your customers can buy." back={{ href: "/demo/app/products", label: "Catalogue" }} />
      <ProductForm />
    </>
  );
}
