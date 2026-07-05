import { getContoprixPreviewPage } from "@contoprix/next/server";

import { ContoprixRenderer } from "@/contoprix/ContoprixRenderer";

interface PreviewPageProps {
  params: Promise<{
    pageId: string;
  }>;
}

export default async function PreviewPage({
  params
}: PreviewPageProps) {
  const { pageId } = await params;

  const page = await getContoprixPreviewPage({
    pageId
  });

  return <ContoprixRenderer page={page} />;
}