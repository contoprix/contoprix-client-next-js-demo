import { NextRequest, NextResponse } from "next/server";

type DeliverySearchResult = {
  type: string;
  id: string;
  title: string;
  slug?: string | null;
  url?: string | null;
  contentTypeCode?: string | null;
  contentTypeName?: string | null;
  languageCode: string;
  snippet?: string | null;
  score: number;
  publishedAt?: string | null;
};

type DeliverySearchResponse = {
  query: string;
  languageCode: string;
  items: DeliverySearchResult[];
  pagination: {
    skip: number;
    take: number;
    total: number;
    hasNext: boolean;
  };
};

export async function GET(request: NextRequest) {
  const baseUrl = process.env.CONTOPRIX_BASE_URL;
  const deliveryKey = process.env.CONTOPRIX_DELIVERY_KEY;

  if (!baseUrl || !deliveryKey) {
    return NextResponse.json(
      { message: "Contoprix delivery configuration is missing." },
      { status: 500 },
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json<DeliverySearchResponse>({
      query,
      languageCode: searchParams.get("languageCode") || "en",
      items: [],
      pagination: {
        skip: 0,
        take: 8,
        total: 0,
        hasNext: false,
      },
    });
  }

  const upstreamUrl = new URL(
    "/api/delivery/search",
    baseUrl.replace(/\/$/, ""),
  );

  upstreamUrl.searchParams.set("q", query);
  upstreamUrl.searchParams.set(
    "languageCode",
    searchParams.get("languageCode") || "en",
  );
  upstreamUrl.searchParams.set("take", searchParams.get("take") || "8");
  upstreamUrl.searchParams.set("skip", searchParams.get("skip") || "0");
  upstreamUrl.searchParams.set("sort", searchParams.get("sort") || "relevance");

  const type = searchParams.get("type");
  const contentType = searchParams.get("contentType");

  if (type) {
    upstreamUrl.searchParams.set("type", type);
  }

  if (contentType) {
    upstreamUrl.searchParams.set("contentType", contentType);
  }

  const response = await fetch(upstreamUrl, {
    headers: {
      "x-contoprix-delivery-key": deliveryKey,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { message: "Search request failed." },
      { status: response.status },
    );
  }

  return NextResponse.json(await response.json());
}
