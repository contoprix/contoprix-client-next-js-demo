"use client";

import { ContoprixComponentProps } from "@contoprix/react";
import Image from "next/image";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

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

function getMediaUrl(value: unknown) {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  if (!isRecord(value)) return undefined;

  return getText(value, "Url") ?? getText(value, "url");
}

function getMediaAlt(value: unknown) {
  if (!isRecord(value)) return undefined;

  return (
    getText(value, "AltText") ??
    getText(value, "altText") ??
    getText(value, "Caption") ??
    getText(value, "caption")
  );
}

function getHeaderData(contents: unknown) {
  const entries = Array.isArray(contents) ? contents.filter(isRecord) : [];
  const firstEntry = entries[0];

  return isRecord(firstEntry?.data) ? firstEntry.data : {};
}

function getLinks(data: Record<string, unknown>) {
  const value =
    data.linkrepeter ??
    data.linkrepeater ??
    data.linksRepeater ??
    data.links;

  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!isRecord(item)) return null;
      return isRecord(item.links) ? item.links : item;
    })
    .filter((item): item is Record<string, unknown> => Boolean(item));
}

export default function HeaderList({
  contents,
}: ContoprixComponentProps) {
  const data = getHeaderData(contents);
  const logo = isRecord(data.logo) ? data.logo : undefined;
  const logoImage = logo?.logoimage ?? logo?.logoImage ?? logo?.image;
  const logoUrl = getMediaUrl(logoImage);
  const logoAlt = getText(logo, "alttext") ?? getMediaAlt(logoImage) ?? "Logo";
  const links = getLinks(data);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 text-zinc-950 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
        <a href="/" className="flex min-w-0 items-center gap-3 font-bold">
          {logoUrl ? (
            <span className="relative block size-10 overflow-hidden rounded-md bg-zinc-100">
              <Image
                src={logoUrl}
                alt={logoAlt}
                fill
                sizes="40px"
                className="object-cover"
              />
            </span>
          ) : (
            <span className="flex size-10 items-center justify-center rounded-md bg-zinc-950 text-sm font-bold text-white">
              C
            </span>
          )}
          <span className="truncate">Contoprix</span>
        </a>

        {links.length > 0 ? (
          <nav className="flex flex-wrap items-center justify-end gap-2 sm:gap-4">
            {links.map((link, index) => {
              const label =
                getText(link, "linkname") ??
                getText(link, "linkName") ??
                `Link ${index + 1}`;
              const href =
                getText(link, "linkurl") ??
                getText(link, "linkUrl") ??
                "#";
              const isBlank = getBoolean(link, "isblank");

              return (
                <a
                  key={`${label}-${index}`}
                  href={href}
                  target={isBlank ? "_blank" : undefined}
                  rel={isBlank ? "noreferrer" : undefined}
                  className="rounded-md px-2.5 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
                >
                  {label}
                </a>
              );
            })}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
