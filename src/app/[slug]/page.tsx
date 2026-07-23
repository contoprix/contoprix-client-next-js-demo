import { notFound } from "next/navigation";

import { getContoprixPage } from "@contoprix/next/server";

import { ContoprixRenderer } from "@/contoprix/ContoprixRenderer";

// Temporarily force request-time rendering while debugging.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

interface Props {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function Pages({ params }: Props) {
  const { slug } = await params;

  const resolvedSlug = slug?.length
    ? `/${slug.join("/")}`
    : "/";

  console.log("[Contoprix page request]", {
    resolvedSlug,
    nodeEnv: process.env.NODE_ENV,
    hasBaseUrl: Boolean(process.env.CONTOPRIX_BASE_URL),
    hasDeliveryKey: Boolean(process.env.CONTOPRIX_DELIVERY_KEY),
    hasWebsiteId: Boolean(process.env.CONTOPRIX_WEBSITE_ID),
  });

  try {
    const page = await getContoprixPage({
      slug: resolvedSlug,
    });

    console.log("[Contoprix page response]", {
      resolvedSlug,
      found: Boolean(page),
      pageId: page?.pageId,
      pageSlug: page?.slug,
    });

    if (!page) {
      console.error("[Contoprix page not found]", {
        resolvedSlug,
      });

      notFound();
    }

    return <ContoprixRenderer page={page} />;
  } catch (error) {
    console.error("[Contoprix page fetch failed]", {
      resolvedSlug,
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
    });

    throw error;
  }
}