"use client";

import { use } from "react";
import { ProductForm } from "@/components/demo/product-form";
import { NotFound, PageHeader } from "@/components/demo/ui";
import { useDemo } from "@/lib/demo/store";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { state } = useDemo();
  const product = state.products.find((p) => p.id === id);
  if (!product) return <NotFound what="Product" href="/demo/app/products" />;
  return (
    <>
      <PageHeader title={`Edit ${product.name}`} back={{ href: `/demo/app/products/${id}`, label: product.name }} />
      <ProductForm product={product} />
    </>
  );
}
