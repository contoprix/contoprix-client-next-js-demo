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

type DeliveryPageSummary = {
  pageId?: string;
  id?: string;
  name?: string;
  title?: string;
  slug?: string;
  url?: string;
  languageCode?: string;
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

  const payload = await response.json();
  const normalized = normalizeSearchPayload(payload, query);

  if (normalized.items.length > 0) {
    return NextResponse.json(normalized);
  }

  return NextResponse.json(
    await searchPagesFallback({
      baseUrl,
      deliveryKey,
      query,
      languageCode: upstreamUrl.searchParams.get("languageCode") || "en",
      take: Number(upstreamUrl.searchParams.get("take") || "8"),
    }),
  );
}

function normalizeSearchPayload(
  payload: unknown,
  query: string,
): DeliverySearchResponse {
  if (Array.isArray(payload)) {
    const items = payload.filter(isSearchResult);

    return {
      query,
      languageCode: items[0]?.languageCode || "en",
      items,
      pagination: {
        skip: 0,
        take: items.length,
        total: items.length,
        hasNext: false,
      },
    };
  }

  if (payload && typeof payload === "object") {
    const record = payload as Partial<DeliverySearchResponse>;
    const items = Array.isArray(record.items)
      ? record.items.filter(isSearchResult)
      : [];

    return {
      query: record.query || query,
      languageCode: record.languageCode || "en",
      items,
      pagination: {
        skip: record.pagination?.skip ?? 0,
        take: record.pagination?.take ?? items.length,
        total: record.pagination?.total ?? items.length,
        hasNext: record.pagination?.hasNext ?? false,
      },
    };
  }

  return {
    query,
    languageCode: "en",
    items: [],
    pagination: {
      skip: 0,
      take: 0,
      total: 0,
      hasNext: false,
    },
  };
}

async function searchPagesFallback({
  baseUrl,
  deliveryKey,
  query,
  languageCode,
  take,
}: {
  baseUrl: string;
  deliveryKey: string;
  query: string;
  languageCode: string;
  take: number;
}): Promise<DeliverySearchResponse> {
  const childrenUrl = new URL(
    "/api/delivery/pages/children",
    baseUrl.replace(/\/$/, ""),
  );

  childrenUrl.searchParams.set("slug", "/");
  childrenUrl.searchParams.set("languageCode", languageCode);
  childrenUrl.searchParams.set("recursive", "true");

  const response = await fetch(childrenUrl, {
    headers: {
      "x-contoprix-delivery-key": deliveryKey,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return emptyResponse(query, languageCode, take);
  }

  const pages = (await response.json()) as unknown;
  const normalizedQuery = query.toLowerCase();
  const items = Array.isArray(pages)
    ? pages
        .filter(isPageSummary)
        .filter((page) =>
          `${page.name || page.title || ""} ${page.slug || ""}`
            .toLowerCase()
            .includes(normalizedQuery),
        )
        .slice(0, take)
        .map((page) => ({
          type: "page",
          id: page.pageId || page.id || page.slug || page.name || "page",
          title: page.name || page.title || page.slug || "Untitled page",
          slug: page.slug,
          url: page.url || page.slug,
          languageCode: page.languageCode || languageCode,
          snippet: page.slug ? `Published page at ${page.slug}` : null,
          score: 1,
        }))
    : [];

  return {
    query,
    languageCode,
    items,
    pagination: {
      skip: 0,
      take,
      total: items.length,
      hasNext: false,
    },
  };
}

function emptyResponse(
  query: string,
  languageCode: string,
  take: number,
): DeliverySearchResponse {
  return {
    query,
    languageCode,
    items: [],
    pagination: {
      skip: 0,
      take,
      total: 0,
      hasNext: false,
    },
  };
}

function isSearchResult(value: unknown): value is DeliverySearchResult {
  return Boolean(
    value &&
      typeof value === "object" &&
      "id" in value &&
      "title" in value,
  );
}

function isPageSummary(value: unknown): value is DeliveryPageSummary {
  return Boolean(
    value &&
      typeof value === "object" &&
      ("slug" in value || "url" in value || "name" in value),
  );
}
