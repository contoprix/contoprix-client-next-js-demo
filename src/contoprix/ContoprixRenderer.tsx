"use client";

import { BlockRenderer, PageRenderer } from "@contoprix/react/client";
import type { ContoprixPage } from "@contoprix/types";

import components from "./components";
import { contoprixSchemas } from "./schema";

export function ContoprixRenderer({
  page,
  includeLayout = false,
}: {
  page: ContoprixPage;
  includeLayout?: boolean;
}) {
  console.log("ContoprixRenderer page", page);

  if (!includeLayout) {
    return (
      <>
        {[...page.blocks]
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((block, index) => (
            <BlockRenderer
              key={`${block.id}-${index}`}
              block={block}
              components={components}
              schemas={contoprixSchemas}
            />
          ))}
      </>
    );
  }

  return (
    <PageRenderer
      page={page}
      components={components}
      schemas={contoprixSchemas}
    />
  );
}
