import { notFound } from "next/navigation";

import { getContoprixPage } from "@contoprix/next/server";

import { ContoprixRenderer } from "@/contoprix/ContoprixRenderer";
import { isNotFoundError } from "@/lib/contoprix/errors";

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

  // getContoprixPage() rejects rather than resolving to null when the
  // delivery API 404s (its return type is Promise<ContoprixPage>, never
  // null) -- same contract PagesApi.getBySlug uses under the hood. Publish
  // status is the only thing this route decides on, so a 404 here just
  // means "not published," not a server error.
  const page = await getContoprixPage({ slug: resolvedSlug }).catch((error) => {
    if (isNotFoundError(error)) {
      return null;
    }

    throw error;
  });

  if (!page) {
    notFound();
  }

  return <ContoprixRenderer page={page} />;
}
