"use client";

import { ContoprixComponentProps } from "@contoprix/react";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getText(source: Record<string, unknown>, key: string) {
  const value = source[key];

  return typeof value === "string" && value.trim().length > 0
    ? value
    : undefined;
}

export default function Hero({
  content,
}: ContoprixComponentProps) {
  const contentData = isRecord(content) && isRecord(content.data)
    ? content.data
    : {};

  const title =
    getText(contentData, "ttitle") ??
    getText(contentData, "title") ??
    "Welcome to Contoprix";

  const banner =
    getText(contentData, "banner") ??
    getText(contentData, "description") ??
    "Enterprise Headless CMS & Digital Experience Platform";

  return (
    <section className="bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
          {banner}
        </p>

        <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">
          {title}
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Build, manage, and publish composable content blocks from Contoprix.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <button className="rounded-md bg-white px-6 py-3 font-medium text-black">
            Get Started
          </button>

          <button className="rounded-md border border-white px-6 py-3">
            Documentation
          </button>
        </div>
      </div>
    </section>
  );
}
