import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const baseUrl = process.env.CONTOPRIX_BASE_URL;

  if (!baseUrl) {
    return new Response("CONTOPRIX_BASE_URL is not configured", {
      status: 500,
    });
  }

  const { path } = await context.params;
  const cleanPath = path
    .filter((part) => part.length > 0 && part !== "." && part !== "..")
    .map(encodeURIComponent)
    .join("/");

  if (!cleanPath) {
    return new Response("Missing upload path", { status: 400 });
  }

  const uploadUrl = `${baseUrl.replace(/\/$/, "")}/uploads/${cleanPath}`;
  const upstream = await fetch(uploadUrl, {
    cache: "no-store",
  });

  if (!upstream.ok || !upstream.body) {
    return new Response("Upload not found", {
      status: upstream.status,
    });
  }

  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");
  const contentLength = upstream.headers.get("content-length");
  const cacheControl = upstream.headers.get("cache-control");

  if (contentType) headers.set("content-type", contentType);
  if (contentLength) headers.set("content-length", contentLength);
  headers.set("cache-control", cacheControl ?? "public, max-age=3600");

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
