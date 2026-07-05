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

export default function HeroList({
  contents,
}: ContoprixComponentProps) {
  const entries = Array.isArray(contents)
    ? contents.filter(isRecord)
    : [];

  return (
    <section className="bg-zinc-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
              Hero list
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              Latest hero entries
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-slate-300">
            Content pulled from the selected Contoprix hero list block.
          </p>
        </div>

        {entries.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry, index) => {
              const data = isRecord(entry.data) ? entry.data : {};
              const title =
                getText(data, "ttitle") ??
                getText(data, "title") ??
                `Hero ${index + 1}`;
              const banner =
                getText(data, "banner") ??
                getText(data, "description") ??
                "Hero content";

              return (
                <article
                  key={getText(entry, "id") ?? `${title}-${index}`}
                  className="rounded-lg border border-white/10 bg-white/5 p-5"
                >
                  <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
                    {banner}
                  </p>

                  <h3 className="mt-4 text-2xl font-bold leading-tight">
                    {title}
                  </h3>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-dashed border-white/20 bg-white/5 p-6 text-sm font-medium text-slate-300">
            No hero entries found.
          </div>
        )}
      </div>
    </section>
  );
}
