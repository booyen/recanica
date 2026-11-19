import { notFound } from "next/navigation";
import { web } from "@/lib/docs";
import { SectionViewer } from "@/components/site/section-viewer";

export function generateStaticParams() {
  return web.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: web.find((w) => w.slug === slug)?.title ?? "Section" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = web.findIndex((w) => w.slug === slug);
  if (i < 0) notFound();
  const item = web[i];
  const prev = web[(i - 1 + web.length) % web.length];
  const next = web[(i + 1) % web.length];
  return <SectionViewer item={item} prev={prev} next={next} index={i + 1} total={web.length} />;
}
