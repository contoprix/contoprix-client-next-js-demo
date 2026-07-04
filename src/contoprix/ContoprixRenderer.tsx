"use client";

import { PageRenderer } from "@contoprix/react/client";
import type { ContoprixPage } from "@contoprix/types";

import components from "./components";

export function ContoprixRenderer({
  page
}: {
  page: ContoprixPage;
}) {
  return (
    <PageRenderer
      page={page}
      components={components}
    />
  );
}