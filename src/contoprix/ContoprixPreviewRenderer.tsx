"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { PageRenderer, buildSchemaRegistry } from "@contoprix/react/client";
import type { ContoprixPage, ContoprixSchemaRegistry } from "@contoprix/types";
import type { SdkSchema } from "@contoprix/client";

import components from "./components";
import { contoprixSchemas } from "./schema";

export function ContoprixPreviewRenderer({
  pageId,
  initialPage
}: {
  pageId: string;
  initialPage: ContoprixPage;
}) {
  const [page, setPage] = useState(initialPage);
  // Starts from the build-time pulled schema, then layers in the live
  // preview-schema endpoint below — a component type created moments ago
  // won't be in the pulled file until the next `contoprix pull`.
  const [schemas, setSchemas] = useState<ContoprixSchemaRegistry>(contoprixSchemas);
  const requestInFlight = useRef(false);
  const refreshQueued = useRef(false);
  const lastPayload = useRef(JSON.stringify(initialPage));
  const controllerRef = useRef<AbortController | null>(null);

  // Best-effort, fire-and-forget alongside the page refresh below — a
  // component type created moments ago needs this to render at all before
  // the next `contoprix pull`, but staleness here isn't as critical as page
  // content, so it skips the in-flight/queued dance that guards `refresh`.
  const refreshSchema = useCallback((signal?: AbortSignal) => {
    fetch("/api/contoprix/preview/schema", { cache: "no-store", signal })
      .then((response) => (response.ok ? response.json() as Promise<SdkSchema> : null))
      .then((sdkSchema) => {
        if (sdkSchema) setSchemas({ ...contoprixSchemas, ...buildSchemaRegistry(sdkSchema) });
      })
      .catch((error) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.warn("Contoprix preview schema refresh failed.", error);
        }
      });
  }, []);

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
    refreshSchema(controller?.signal);

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
  }, [pageId, refreshSchema]);

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;
    refreshSchema(controller.signal);
    return () => controller.abort();
  }, [pageId, refreshSchema]);

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

  const allowedOriginSet = getAllowedParentOrigins();
  const allowedOrigins = Array.from(allowedOriginSet);
  const adminOrigin = resolveAdminOrigin(allowedOriginSet);

  return <PageRenderer
    page={page}
    components={components}
    schemas={schemas}
    renderMode="editor"
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

// The iframe doesn't otherwise know which allowed origin actually embedded
// it (e.g. a local dev admin on localhost:3000 vs. production), so postMessage
// replies were always targeted at the hardcoded production origin below —
// silently dropped by the browser whenever the real parent was anything else.
// The admin app stamps its own origin onto the preview URL (?contoprixAdminOrigin=...)
// specifically so this iframe doesn't have to guess it; document.referrer is
// checked as a fallback but is empty for this navigation in practice.
function resolveAdminOrigin(allowedOrigins: Set<string>) {
  if (typeof window !== "undefined") {
    const fromQuery = new URLSearchParams(window.location.search).get("contoprixAdminOrigin");
    if (fromQuery && allowedOrigins.has(fromQuery)) return fromQuery;
  }
  if (typeof document !== "undefined" && document.referrer) {
    try {
      const referrerOrigin = new URL(document.referrer).origin;
      if (allowedOrigins.has(referrerOrigin)) return referrerOrigin;
    } catch {
      // Malformed/absent referrer falls through to the default below.
    }
  }
  return Array.from(allowedOrigins)[0];
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
