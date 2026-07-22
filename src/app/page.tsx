import { getContoprixPage } from "@contoprix/next/server";

import { ContoprixRenderer } from "@/contoprix/ContoprixRenderer";

// Webhooks invalidate this page immediately after a publish. ISR is a safety
// net for missed or delayed webhook deliveries.
export const revalidate = 60;

export default async function HomePage() {
  const page = await getContoprixPage({
    slug: "home-page"
  });

  return <ContoprixRenderer page={page} />;
}
