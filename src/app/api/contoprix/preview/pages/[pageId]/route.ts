import { createContoprixClient } from "@contoprix/next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const { pageId } = await params;

  if (!pageId) {
    return Response.json(
      { error: "Page id is required." },
      { status: 400 }
    );
  }

  try {
    const client = createContoprixClient();
    const page = await client.pages.getPreview(pageId);

    return Response.json(page, {
      headers: {
        "Cache-Control": "no-store, max-age=0"
      }
    });
  } catch (error) {
    console.error("Failed to load Contoprix preview page.", error);
    return Response.json(
      { error: "Unable to load preview content." },
      {
        status: 502,
        headers: { "Cache-Control": "no-store" }
      }
    );
  }
}
