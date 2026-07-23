"use client";

import { ArrowUpRight } from "lucide-react";

import type { ContoprixComponentProps } from "@contoprix/react";

type HeroCallout = {
  callout_icon?: string | null;
  description?: string | null;
  __componentTypeId?: string;
};

type HeroBannerData = {
  eyebrow?: string | null;
  heading?: string | null;
  description?: string | null;
  callout?: HeroCallout | null;
};

export default function HeroBannerDetail({
  content,
  previewAttributes,
}: ContoprixComponentProps) {
  const entry = asRecord(content);
  const data = asRecord(entry?.data) as HeroBannerData | null;
  const isEmptyPublishedEntry =
    entry &&
    Object.keys(data ?? {}).length === 0;

  const eyebrow = data?.eyebrow?.trim() || "";
  const heading = data?.heading?.trim() || "";
  const description = data?.description?.trim() || "";
  const calloutDescription =
    data?.callout?.description?.trim() || "";

  if (
    !eyebrow &&
    !heading &&
    !description &&
    !calloutDescription
  ) {
    if (process.env.NODE_ENV === "development" && isEmptyPublishedEntry) {
      return (
        <section
          {...previewAttributes}
          className="mx-auto my-10 w-full max-w-5xl border border-amber-300 bg-amber-50 px-6 py-5 text-slate-900"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Contoprix demo notice
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-950">
            The page loaded, but this published hero entry has no delivery data.
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-700">
            The CMS returned the block for{" "}
            <code>{String(entry?.contentTypeCode ?? "unknown")}</code>,
            but <code>content.data</code> was empty, so there was nothing to render.
          </p>
        </section>
      );
    }

    return null;
  }

  return (
    <section
      {...previewAttributes}
      className="relative isolate min-h-[660px] overflow-hidden border-t border-white/10 bg-[#07101a] text-white lg:min-h-[760px]"
    >
      {/* Main dark-to-orange background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-[linear-gradient(105deg,#07101a_0%,#08111b_44%,#141214_66%,#422010_100%)]"
      />

      {/* Right orange glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_86%_12%,rgba(255,92,20,0.22),transparent_35%)]"
      />

      {/* Grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:66px_66px]"
      />

      {/* Soft bottom darkening */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent_55%,rgba(2,8,15,0.2)_100%)]"
      />

      <div className="mx-auto grid min-h-[660px] max-w-[1880px] grid-cols-1 gap-14 px-6 py-20 sm:px-10 lg:min-h-[760px] lg:grid-cols-[minmax(0,2.65fr)_minmax(320px,0.85fr)] lg:items-center lg:gap-20 lg:px-[60px] lg:py-24 xl:gap-28">
        {/* Main content */}
        <div className="max-w-[1210px]">
          {eyebrow ? (
            <div className="mb-12 flex items-center gap-5 lg:mb-14">
              <span
                aria-hidden="true"
                className="h-[2px] w-[60px] bg-[#ff5a0a]"
              />

              <span className="text-[14px] font-bold uppercase tracking-[0.3em] text-[#ff5a0a] sm:text-[15px]">
                {eyebrow}
              </span>
            </div>
          ) : null}

          {heading ? (
            <h1 className="max-w-[1210px] text-balance text-[50px] font-semibold leading-[0.98] tracking-[-0.052em] text-[#f8f8f7] sm:text-[68px] lg:text-[82px] xl:text-[104px]">
              {formatHeading(heading)}
            </h1>
          ) : null}

          {description ? (
            <p className="mt-10 max-w-[1120px] text-[20px] leading-[1.55] tracking-[-0.015em] text-[#bec0c4] sm:text-[24px] lg:mt-12 lg:text-[28px] lg:leading-[1.65]">
              {description}
            </p>
          ) : null}
        </div>

        {/* Right callout */}
        {calloutDescription ? (
          <aside className="relative self-end border-l border-white/15 py-2 pl-8 lg:self-center lg:pl-9 xl:pl-12">
            <ArrowUpRight
              aria-hidden="true"
              className="mb-9 size-7 text-[#ff5a0a] sm:size-8"
              strokeWidth={2}
            />

            <p className="max-w-[390px] text-[18px] leading-[1.75] tracking-[-0.01em] text-[#bec0c4] sm:text-[20px] lg:text-[21px]">
              {calloutDescription}
            </p>
          </aside>
        ) : null}
      </div>
    </section>
  );
}

/**
 * Makes a two-sentence heading display like the reference:
 *
 * Purpose-built capabilities.
 * No plugin sprawl.
 *
 * CMS editors do not need to add a manual line break.
 */
function formatHeading(heading: string) {
  const lines = splitHeadingIntoLines(heading);

  if (lines.length <= 1) {
    return heading;
  }

  return lines.map((line, index) => (
    <span
      key={`${line}-${index}`}
      className="block"
    >
      {line}
    </span>
  ));
}

function splitHeadingIntoLines(value: string): string[] {
  const manualLines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (manualLines.length > 1) {
    return manualLines;
  }

  const sentences =
    value.match(/[^.!?]+[.!?]+|[^.!?]+$/g)
      ?.map((sentence) => sentence.trim())
      .filter(Boolean) || [];

  if (sentences.length === 2) {
    return sentences;
  }

  return [value];
}

function asRecord(
  value: unknown,
): Record<string, unknown> | null {
  return value &&
    typeof value === "object" &&
    !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}
