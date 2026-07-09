"use client";

import { ContoprixComponentProps } from "@contoprix/react";

function getText(source: Record<string, unknown> | undefined, key: string) {
  const value = source?.[key];

  return typeof value === "string" && value.trim().length > 0
    ? value
    : undefined;
}

function getBoolean(source: Record<string, unknown> | undefined, key: string) {
  const value = source?.[key];

  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";

  return false;
}

export default function Links({
  settings,
}: ContoprixComponentProps) {
  const label =
    getText(settings, "linkname") ??
    getText(settings, "linkName") ??
    "Footer";
  const href =
    getText(settings, "linkurl") ??
    getText(settings, "linkUrl") ??
    "#";
  const isBlank = getBoolean(settings, "isblank");

  return (
    <footer className="border-t border-zinc-200 bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-bold">Contoprix</p>
          <p className="mt-1 text-sm text-zinc-400">
            Content powered by Contoprix CMS.
          </p>
        </div>

        <a
          href={href}
          target={isBlank ? "_blank" : undefined}
          rel={isBlank ? "noreferrer" : undefined}
          className="w-fit rounded-md border border-white/15 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-white/30 hover:text-white"
        >
          {label}
        </a>
      </div>
    </footer>
  );
}
