import { getContoprixPage } from "@contoprix/next/server";

import { ContoprixRenderer } from "@/contoprix/ContoprixRenderer";
interface Props {
params: Promise<{ slug?: string[] }>;
}
export default async function Pages({ params }: Props) {
  const { slug } = await params;
  const page = await getContoprixPage({
    slug: slug ? `/${slug.join('/')}` : "home-page"
  });

  return <ContoprixRenderer page={page} />;
}