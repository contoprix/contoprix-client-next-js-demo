import { getContoprixPage } from "@contoprix/next/server";

import { ContoprixRenderer } from "@/contoprix/ContoprixRenderer";

// Webhooks invalidate published pages immediately. This fallback prevents a
// stale build from living indefinitely if a webhook delivery is missed.
export const revalidate = 60;

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export default async function Pages({ params }: Props) {
  const { slug } = await params;
  const page = await getContoprixPage({
    slug: slug ? `/${slug.join("/")}` : "home-page"
  });

  return <ContoprixRenderer page={page} />;
}
