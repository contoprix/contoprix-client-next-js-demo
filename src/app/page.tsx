import { getContoprixPage } from "@contoprix/next/server";

import { ContoprixRenderer } from "@/contoprix/ContoprixRenderer";

export default async function HomePage() {
  const page = await getContoprixPage({
    slug: "/"
  });

  return <ContoprixRenderer page={page} />;
}