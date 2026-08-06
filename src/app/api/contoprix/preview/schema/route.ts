import { createContoprixClient } from "@contoprix/next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = createContoprixClient();
    const schema = await client.sdk.getPreviewSchema();

    return Response.json(schema, {
      headers: {
        "Cache-Control": "no-store, max-age=0"
      }
    });
  } catch (error) {
    console.error("Failed to load Contoprix preview schema.", error);
    return Response.json(
      { error: "Unable to load preview schema." },
      {
        status: 502,
        headers: { "Cache-Control": "no-store" }
      }
    );
  }
}
