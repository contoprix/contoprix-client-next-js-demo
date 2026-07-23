"use client";

import { PageRenderer } from "@contoprix/react/client";
import type { ContoprixPage } from "@contoprix/types";

import components from "./components";

export function ContoprixRenderer({
  page
}: {
  page: ContoprixPage;
}) {
  console.log("ContoprixRenderer page", page);
  return (
    <PageRenderer
      page={page}
      components={components}
    />
  );
}