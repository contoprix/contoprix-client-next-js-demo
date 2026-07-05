"use client";

import { ContoprixComponentProps } from "@contoprix/react";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getText(source: Record<string, unknown> | undefined, key: string) {
  const value = source?.[key];

  return typeof value === "string" && value.trim().length > 0
    ? value
    : undefined;
}

function getItems(data: Record<string, unknown>) {
  const value = data.repetore ?? data.repeater ?? data.items;

  return Array.isArray(value)
    ? value.filter(isRecord)
    : [];
}

export default function CollectionDetail({
  content,
}: ContoprixComponentProps) {
  const data = isRecord(content) && isRecord(content.data)
    ? content.data
    : {};

  const items = getItems(data);
  const title = getText(data, "title") ?? "Collection";
  const description =
    getText(data, "description") ??
    "A curated group of Contoprix content entries.";

  return (
    <section className="bg-white px-6 py-16 text-zinc-950">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Collection
          </p>

          <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
            {title}
          </h2>

          <p className="mt-4 text-base leading-7 text-zinc-600">
            {description}
          </p>
        </div>

        {items.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => {
              const itemTitle = getText(item, "title") ?? `Item ${index + 1}`;
              const itemDescription = getText(item, "desc") ?? getText(item, "description");

              return (
                <article
                  key={`${itemTitle}-${index}`}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-700 text-sm font-bold text-white">
                    {index + 1}
                  </div>

                  <h3 className="mt-4 text-xl font-bold leading-tight">
                    {itemTitle}
                  </h3>

                  {itemDescription ? (
                    <p className="mt-3 text-sm leading-6 text-zinc-600">
                      {itemDescription}
                    </p>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm font-medium text-zinc-500">
            No collection items found.
          </div>
        )}
      </div>
    </section>
  );
}
