"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { PageRenderer } from "@contoprix/react/client";
import type { ContoprixPage } from "@contoprix/types";

import components from "./components";

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
  const controllerRef = useRef<AbortController | null>(null);

  // Fetches the latest preview payload for this page. Its own in-flight /
  // queued dedup stays here since it's specific to how *this app* refetches
  // data - VisualEditingBridge (below) only decides *when* to call this.
  const refresh = useCallback(async () => {
    if (document.visibilityState === "hidden") return;
    if (requestInFlight.current) {
      refreshQueued.current = true;
      return;
    }

    const controller = controllerRef.current;

    requestInFlight.current = true;
    try {
      do {
        refreshQueued.current = false;
        const response = await fetch(
          `/api/contoprix/preview/pages/${encodeURIComponent(pageId)}`,
          { cache: "no-store", signal: controller?.signal }
        );

        if (!response.ok) return;

        const payload = await response.text();
        if (payload !== lastPayload.current) {
          const nextPage = JSON.parse(payload) as ContoprixPage;
          lastPayload.current = payload;
          setPage(nextPage);
        }
      } while (refreshQueued.current && !controller?.signal.aborted);
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
    controllerRef.current = controller;
    return () => controller.abort();
  }, [pageId]);

  useEffect(() => {
    // Compatibility guard for SDK versions that marked resolved content and
    // global layout blocks as visually editable. Phase 1 only supports
    // component blocks owned by the current page draft.
    const editableBlockIds = new Set(
      page.blocks
        .filter((block) => block.kind === "component")
        .map((block) => block.id)
    );

    for (const element of document.querySelectorAll<HTMLElement>("[data-contoprix-block-id]")) {
      const blockId = element.dataset.contoprixBlockId;
      if (blockId && editableBlockIds.has(blockId)) continue;
      delete element.dataset.contoprixPageId;
      delete element.dataset.contoprixVersionId;
      delete element.dataset.contoprixBlockId;
      delete element.dataset.contoprixComponentType;
    }
  }, [page]);

  const allowedOrigins = Array.from(getAllowedParentOrigins());
  const adminOrigin = allowedOrigins[0];

  return <PageRenderer
    page={page}
    components={components}
    visualEditing={adminOrigin ? {
      enabled: true,
      adminOrigin,
      // The rest of our allowed origins (e.g. localhost during dev),
      // beyond the single `adminOrigin` postMessage replies target.
      trustedRefreshOrigins: allowedOrigins,
      onRefresh: () => void refresh()
    } : undefined}
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

function toOrigin(value: string | undefined) {
  if (!value?.trim()) return null;

  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:" ? url.origin : null;
  } catch {
    return null;
  }
}
