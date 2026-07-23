import { notFound } from "next/navigation";

import { getContoprixPage } from "@contoprix/next/server";

import { ContoprixRenderer } from "@/contoprix/ContoprixRenderer";

export const revalidate = 60;
export const dynamicParams = true;

interface Props {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;

  const resolvedSlug = `/${slug.join("/")}`;

  console.log("[Contoprix page request]", {
    slug,
    resolvedSlug,
  });

  const page = await getContoprixPage({
    slug: resolvedSlug,
  });

  console.log("[Contoprix page response]", {
    resolvedSlug,
    found: Boolean(page),
    pageSlug: page?.slug,
  });

  if (!page) {
    notFound();
  }

  return <ContoprixRenderer page={page} />;
}