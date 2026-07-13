"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { PageRenderer } from "@contoprix/react/client";
import type { ContoprixPage } from "@contoprix/types";

import components from "./components";

const FALLBACK_POLLING_INTERVAL_MS = 60_000;
const REFRESH_DEBOUNCE_MS = 150;
const PREVIEW_MESSAGE_TYPE = "contoprix.preview.refresh";

type PreviewRefreshMessage = {
  type: typeof PREVIEW_MESSAGE_TYPE;
  pageId?: string;
  languageCode?: string;
  occurredAt: number;
};

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
      if (!isPreviewRefreshMessage(event.data)) return;
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

  return <PageRenderer page={page} components={components} />;
}

function isPreviewRefreshMessage(value: unknown): value is PreviewRefreshMessage {
  if (!value || typeof value !== "object") return false;

  const message = value as Partial<PreviewRefreshMessage>;
  return (
    message.type === PREVIEW_MESSAGE_TYPE &&
    typeof message.occurredAt === "number" &&
    (message.pageId === undefined || typeof message.pageId === "string") &&
    (message.languageCode === undefined ||
      typeof message.languageCode === "string")
  );
}

function getAllowedParentOrigins() {
  const origins = new Set<string>();
  const configuredOrigins = process.env.NEXT_PUBLIC_CONTOPRIX_ADMIN_ORIGINS;

  for (const value of configuredOrigins?.split(",") ?? []) {
    const origin = toOrigin(value);
    if (origin) origins.add(origin);
  }

  const referrerOrigin = toOrigin(document.referrer);
  if (referrerOrigin) origins.add(referrerOrigin);

  return origins;
}

function toOrigin(value: string | undefined) {
  if (!value?.trim()) return null;

  try {
    return new URL(value.trim()).origin;
  } catch {
    return null;
  }
}
