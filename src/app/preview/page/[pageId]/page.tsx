import { createContoprixClient } from "@contoprix/next/server";

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

  const client = createContoprixClient();
  const page = await client.pages.getPreview(pageId);

  return <ContoprixRenderer page={page} />;
}
