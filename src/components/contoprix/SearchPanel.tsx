"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  FileText,
  Loader2,
  Search,
  X,
} from "lucide-react";

type SearchResult = {
  type: string;
  id: string;
  title: string;
  slug?: string | null;
  url?: string | null;
  contentTypeCode?: string | null;
  contentTypeName?: string | null;
  snippet?: string | null;
};

type SearchResponse = {
  items: SearchResult[];
  pagination: {
    total: number;
  };
};

type SearchPanelProps = {
  onClose: () => void;
};

export function SearchPanel({ onClose }: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmedQuery)}&take=8`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Search is unavailable right now.");
        }

        const payload = (await response.json()) as SearchResponse;

        setResults(payload.items ?? []);
        setTotal(payload.pagination?.total ?? 0);
      } catch (searchError) {
        if (controller.signal.aborted) {
          return;
        }

        setResults([]);
        setTotal(0);
        setError(
          searchError instanceof Error
            ? searchError.message
            : "Search is unavailable right now.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return (
    <div className="border-t border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="mx-auto max-w-5xl px-5 py-5 sm:px-8">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 ring-1 ring-transparent transition focus-within:border-orange-500 focus-within:bg-white focus-within:ring-orange-100">
          <Search
            aria-hidden="true"
            className="size-5 shrink-0 text-slate-500"
          />

          <input
            type="search"
            autoFocus
            value={query}
            onChange={(event) => {
              const nextQuery = event.target.value;

              setQuery(nextQuery);

              if (nextQuery.trim().length < 2) {
                setResults([]);
                setTotal(0);
                setLoading(false);
                setError(null);
              }
            }}
            placeholder="Search pages, docs, and content..."
            aria-label="Search"
            className="h-10 min-w-0 flex-1 bg-transparent text-base font-medium text-slate-950 outline-none placeholder:text-slate-400"
          />

          {loading ? (
            <Loader2
              aria-hidden="true"
              className="size-5 shrink-0 animate-spin text-orange-600"
            />
          ) : null}

          <button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-white hover:text-slate-950"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {query.trim().length < 2 ? (
            <EmptyState title="Start typing to search" description="Search published pages and content entries from this website." />
          ) : error ? (
            <EmptyState title="Search unavailable" description={error} />
          ) : !loading && results.length === 0 ? (
            <EmptyState title="No results found" description="Try a different keyword or shorter phrase." />
          ) : (
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm text-slate-500">
                <span>
                  {loading
                    ? "Searching..."
                    : `${total} result${total === 1 ? "" : "s"} found`}
                </span>
                <span>Published content only</span>
              </div>

              <div className="divide-y divide-slate-100">
                {results.map((item) => (
                  <SearchResultLink
                    key={`${item.type}:${item.id}`}
                    item={item}
                    onClose={onClose}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchResultLink({
  item,
  onClose,
}: {
  item: SearchResult;
  onClose: () => void;
}) {
  const href = resolveResultHref(item);

  return (
    <Link
      href={href}
      onClick={onClose}
      className="group grid grid-cols-[auto_1fr_auto] gap-3 px-4 py-4 transition-colors hover:bg-orange-50/70"
    >
      <span className="mt-1 inline-flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-700">
        <FileText aria-hidden="true" className="size-5" />
      </span>

      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-950">{item.title}</span>
          <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {item.type}
          </span>
          {item.contentTypeName ? (
            <span className="text-xs font-medium text-slate-500">
              {item.contentTypeName}
            </span>
          ) : null}
        </span>

        {item.snippet ? (
          <span className="mt-1 line-clamp-2 block text-sm leading-6 text-slate-600">
            {item.snippet}
          </span>
        ) : null}

        <span className="mt-1 block truncate text-xs font-medium text-orange-700">
          {href}
        </span>
      </span>

      <ArrowRight
        aria-hidden="true"
        className="mt-2 size-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-600"
      />
    </Link>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="px-4 py-8 text-center">
      <p className="font-semibold text-slate-950">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function resolveResultHref(item: SearchResult): string {
  if (item.type === "page") {
    return normalizePath(item.url || item.slug);
  }

  if (item.slug) {
    return normalizePath(item.slug);
  }

  return "#";
}

function normalizePath(value?: string | null): string {
  const path = value?.trim();

  if (!path || path === "/") {
    return "/";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return path.startsWith("/") ? path : `/${path}`;
}
