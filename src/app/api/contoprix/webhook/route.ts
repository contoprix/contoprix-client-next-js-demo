import { handleContoprixWebhook } from "@contoprix/next/server";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  const secret = process.env.CONTOPRIX_WEBHOOK_SECRET;

  if (!secret) {
    console.error("CONTOPRIX_WEBHOOK_SECRET is not configured.");
    return Response.json(
      { error: "Webhook processing is not configured." },
      { status: 503 }
    );
  }

  return handleContoprixWebhook(request, {
    secret,
    onPagePublished(event) {
      const slug = event.data.slug?.trim().replace(/^\/+|\/+$/g, "");

      // The delivery slug is "home-page", but this app mounts it at "/".
      if (!slug || slug === "home-page") {
        revalidatePath("/");
      }
    }
  });
}
