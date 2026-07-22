"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { PageRenderer } from "@contoprix/react/client";
import type { ContoprixPage } from "@contoprix/types";
import {
  isContoprixPreviewRefreshMessage,
} from "@contoprix/types";

import components from "./components";

const FALLBACK_POLLING_INTERVAL_MS = 60_000;
const REFRESH_DEBOUNCE_MS = 150;

export function ContoprixPreviewRenderer({
  pageId,
  initialPage
}: {
  pageId: string;
  initialPage: ContoprixPage;
}) {
  const [page, setPage] = useState(initialPage);
  const requestInFlight = useRef(false);
  const refreshQueued = useRef(false);
  const lastPayload = useRef(JSON.stringify(initialPage));

  const refresh = useCallback(async (signal?: AbortSignal) => {
    if (document.visibilityState === "hidden") return;
    if (requestInFlight.current) {
      refreshQueued.current = true;
      return;
    }

    requestInFlight.current = true;
    try {
      do {
        refreshQueued.current = false;
        const response = await fetch(
          `/api/contoprix/preview/pages/${encodeURIComponent(pageId)}`,
          { cache: "no-store", signal }
        );

        if (!response.ok) return;

        const payload = await response.text();
        if (payload !== lastPayload.current) {
          const nextPage = JSON.parse(payload) as ContoprixPage;
          lastPayload.current = payload;
          setPage(nextPage);
        }
      } while (refreshQueued.current && !signal?.aborted);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        console.warn("Contoprix preview refresh failed.", error);
      }
    } finally {
      requestInFlight.current = false;
    }
  }, [pageId]);

  useEffect(() => {
    const controller = new AbortController();
    let debounceTimer: number | undefined;
    const allowedParentOrigins = getAllowedParentOrigins();
    const timer = window.setInterval(
      () => void refresh(controller.signal),
      FALLBACK_POLLING_INTERVAL_MS
    );
    const onMessage = (event: MessageEvent<unknown>) => {
      if (event.source !== window.parent) return;
      if (!allowedParentOrigins.has(event.origin)) return;
      if (!isContoprixPreviewRefreshMessage(event.data)) return;
      if (event.data.pageId && event.data.pageId !== pageId) return;

      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(
        () => void refresh(controller.signal),
        REFRESH_DEBOUNCE_MS
      );
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void refresh(controller.signal);
    };

    window.addEventListener("message", onMessage);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      controller.abort();
      window.clearTimeout(debounceTimer);
      window.clearInterval(timer);
      window.removeEventListener("message", onMessage);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [pageId, refresh]);

  const adminOrigin = getAllowedParentOrigin();
  return <PageRenderer
    page={page}
    components={components}
    visualEditing={adminOrigin ? { enabled: true, adminOrigin } : undefined}
  />;
}

function getAllowedParentOrigins() {
  const origins = new Set<string>(["https://admin.contoprix.com"]);
  const configuredOrigins = process.env.NEXT_PUBLIC_CONTOPRIX_ADMIN_ORIGINS;

  if (process.env.NODE_ENV === "development") {
    origins.add("http://localhost:3000");
    origins.add("https://localhost:3000");
  }

  for (const value of configuredOrigins?.split(",") ?? []) {
    const origin = toOrigin(value);
    if (origin) origins.add(origin);
  }

  return origins;
}

function getAllowedParentOrigin() {
  return getAllowedParentOrigins().values().next().value as string | undefined;
}

function toOrigin(value: string | undefined) {
  if (!value?.trim()) return null;

  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:" ? url.origin : null;
  } catch {
    return null;
  }
}
