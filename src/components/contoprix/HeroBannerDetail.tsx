"use client";

import type { ContoprixComponentProps } from "@contoprix/react";

type MediaValue = {
  Id?: string;
  id?: string;
  FileName?: string;
  fileName?: string;
  Url?: string;
  url?: string;
  MimeType?: string;
  mimeType?: string;
  AltText?: string | null;
  altText?: string | null;
  Caption?: string | null;
  caption?: string | null;
};

type HeroBannerCta = {
  button_text?: string;
  button_url?: string;
};

type HeroBannerData = {
  banner_image?: MediaValue | string | null;

  // Your current CMS field code contains this spelling.
  tittle?: string;

  // Supports a future corrected field code as well.
  title?: string;

  description?: string;

  hero_banner_cta?: HeroBannerCta | null;
};

export default function HeroBannerDetail({
  content,
}: ContoprixComponentProps) {
  const entry = asRecord(content);
  const data = asRecord(entry?.data) as HeroBannerData | null;

  const imageUrl = getMediaUrl(data?.banner_image);
  const imageAlt =
    getMediaAlt(data?.banner_image) ||
    data?.title ||
    data?.tittle ||
    "Hero banner";

  const title = data?.title?.trim() || data?.tittle?.trim() || "";
  const description = data?.description?.trim() || "";

  const ctaText = data?.hero_banner_cta?.button_text?.trim() || "";
  const ctaUrl = normalizeUrl(
    data?.hero_banner_cta?.button_url?.trim() || "#",
  );

  return (
    <section className="relative isolate min-h-[560px] overflow-hidden bg-slate-950">
      {imageUrl ? (
        <>
          {/* CMS media can come from local or customer-configured hosts. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={imageAlt}
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />

          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />

          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </>
      ) : (
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
      )}

      <div className="mx-auto flex min-h-[560px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-3xl">
          {title ? (
            <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>
          ) : null}

          {description ? (
            <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-white/80 sm:text-lg">
              {description}
            </p>
          ) : null}

          {ctaText ? (
            <div className="mt-9">
              <a
                href={ctaUrl}
                target={isExternalUrl(ctaUrl) ? "_blank" : undefined}
                rel={
                  isExternalUrl(ctaUrl)
                    ? "noopener noreferrer"
                    : undefined
                }
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm transition duration-200 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                {ctaText}
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function asRecord(
  value: unknown,
): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function getMediaUrl(
  value: MediaValue | string | null | undefined,
): string {
  if (typeof value === "string") {
    return value.trim();
  }

  return value?.Url?.trim() || value?.url?.trim() || "";
}

function getMediaAlt(
  value: MediaValue | string | null | undefined,
): string {
  if (!value || typeof value === "string") {
    return "";
  }

  return value.AltText?.trim() || value.altText?.trim() || "";
}

function normalizeUrl(value: string): string {
  const url = value.trim();

  if (!url || url === "#") {
    return "#";
  }

  if (
    url.startsWith("/") ||
    url.startsWith("#") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:") ||
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  if (url.startsWith("www.")) {
    return `https://${url}`;
  }

  return `/${url.replace(/^\/+/, "")}`;
}

function isExternalUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}