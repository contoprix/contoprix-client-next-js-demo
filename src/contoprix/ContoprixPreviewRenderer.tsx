"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { PageRenderer } from "@contoprix/react/client";
import type { ContoprixPage } from "@contoprix/types";

import components from "./components";

const POLLING_INTERVAL_MS = 3_000;

export function ContoprixPreviewRenderer({
  pageId,
  initialPage
}: {
  pageId: string;
  initialPage: ContoprixPage;
}) {
  const [page, setPage] = useState(initialPage);
  const requestInFlight = useRef(false);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    if (requestInFlight.current || document.visibilityState === "hidden") return;

    requestInFlight.current = true;
    try {
      const response = await fetch(
        `/api/contoprix/preview/pages/${encodeURIComponent(pageId)}`,
        { cache: "no-store", signal }
      );

      if (!response.ok) return;
      setPage(await response.json() as ContoprixPage);
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
    const timer = window.setInterval(
      () => void refresh(controller.signal),
      POLLING_INTERVAL_MS
    );
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void refresh(controller.signal);
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      controller.abort();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [refresh]);

  return <PageRenderer page={page} components={components} />;
}
