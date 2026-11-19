import { notFound } from "next/navigation";
import { QABoard } from "@/components/docs/qa-board";
import { components } from "@/lib/docs";

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = components.findIndex((c) => c.slug === slug);
  if (i < 0) notFound();
  const prev = components[(i - 1 + components.length) % components.length].slug;
  const next = components[(i + 1) % components.length].slug;
  return <QABoard slug={slug} title={components[i].title} prev={prev} next={next} minWidth={components[i].minWidth} />;
}
