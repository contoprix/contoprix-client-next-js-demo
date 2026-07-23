"use client";

import {
  Braces,
  FileText,
  Image,
  LayoutTemplate,
  Search,
  ShieldCheck,
  Languages,
  ClipboardCheck,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

import type { ContoprixComponentProps } from "@contoprix/react";

type CapabilityItem = {
  icon?: string | null;
  title?: string | null;
  description?: string | null;
  link_text?: string | null;
  link?: string | null;
  highlight?: boolean;
  __componentTypeId?: string;
};

type CapabilityItemWrapper = {
  capability?: CapabilityItem | null;
};

type CapabilitiesSectionData = {
  eyebrow?: string | null;
  heading?: string | null;
  description?: string | null;
  capability_items?: CapabilityItemWrapper[] | null;
};

export default function CapabilitiesSectionDetail({
  content,
  previewAttributes,
}: ContoprixComponentProps) {
  const entry = asRecord(content);
  const data = asRecord(
    entry?.data,
  ) as CapabilitiesSectionData | null;

  const eyebrow = data?.eyebrow?.trim() || "";
  const heading = data?.heading?.trim() || "";
  const description = data?.description?.trim() || "";

  const items = normalizeCapabilityItems(
    data?.capability_items,
  );

  if (
    !eyebrow &&
    !heading &&
    !description &&
    items.length === 0
  ) {
    return null;
  }

  return (
    <section
      {...previewAttributes}
      className="bg-[#f7f7f5] text-slate-950"
    >
      <div className="mx-auto max-w-[1880px] px-6 py-20 sm:px-10 lg:px-[60px] lg:py-28">
        <div className="max-w-4xl">
          {eyebrow ? (
            <div className="mb-6 flex items-center gap-4">
              <span
                aria-hidden="true"
                className="h-px w-6 bg-[#ff5a0a]"
              />

              <span className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#ff5a0a]">
                {eyebrow}
              </span>
            </div>
          ) : null}

          {heading ? (
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-[44px] lg:leading-[1.08]">
              {heading}
            </h2>
          ) : null}

          {description ? (
            <p className="mt-5 max-w-2xl text-[16px] leading-7 text-slate-600 sm:text-[17px]">
              {description}
            </p>
          ) : null}
        </div>

        {items.length > 0 ? (
          <div className="mt-14 grid grid-cols-1 border-l border-t border-slate-300 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
              <CapabilityCard
                key={`${item.title || "capability"}-${index}`}
                item={item}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function CapabilityCard({
  item,
}: {
  item: CapabilityItem;
}) {
  const title = item.title?.trim() || "";
  const description =
    item.description?.trim() || "";

  const linkText =
    item.link_text?.trim() || "";

  const href = normalizeOptionalHref(
    item.link,
  );

  const Icon = resolveCapabilityIcon(
    item.icon,
  );

  const cardContent = (
    <>
      <div className="inline-flex size-10 items-center justify-center border border-orange-200 bg-orange-50 text-[#ff5a0a]">
        <Icon
          aria-hidden="true"
          className="size-[18px]"
          strokeWidth={1.8}
        />
      </div>

      {title ? (
        <h3 className="mt-9 text-[18px] font-semibold tracking-[-0.02em] text-slate-950">
          {title}
        </h3>
      ) : null}

      {description ? (
        <p className="mt-4 text-[14px] leading-6 text-slate-600 sm:text-[15px]">
          {description}
        </p>
      ) : null}

      {linkText && href ? (
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#ff5a0a]">
          {linkText}

          <ArrowUpRight
            aria-hidden="true"
            className="size-4"
          />
        </span>
      ) : null}
    </>
  );

  const classes = [
    "group relative min-h-[280px]",
    "border-b border-r border-slate-300",
    "px-6 py-10 sm:px-7 lg:min-h-[300px] lg:px-8",
    "transition-colors duration-200",
    item.highlight
      ? "bg-white"
      : "bg-[#f7f7f5]",
    href
      ? "hover:bg-white"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        aria-label={title || linkText || "Capability"}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <article className={classes}>
      {cardContent}
    </article>
  );
}

function normalizeCapabilityItems(
  items: CapabilityItemWrapper[] | null | undefined,
): CapabilityItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => item?.capability)
    .filter(
      (item): item is CapabilityItem =>
        Boolean(
          item?.title ||
            item?.description ||
            item?.icon,
        ),
    );
}

function resolveCapabilityIcon(
  value?: string | null,
): LucideIcon {
  const icon = value
    ?.trim()
    .toLowerCase();

  switch (icon) {
    case "text":
    case "file":
    case "file-text":
    case "content":
    case "content-management":
      return FileText;

    case "page":
    case "layout":
    case "page-builder":
    case "layout-template":
      return LayoutTemplate;

    case "code":
    case "schema":
    case "schema-builder":
    case "braces":
      return Braces;

    case "media":
    case "image":
    case "photo":
      return Image;

    case "search":
    case "seo":
      return Search;

    case "language":
    case "languages":
    case "localization":
      return Languages;

    case "security":
    case "shield":
    case "shield-check":
      return ShieldCheck;

    case "governance":
    case "clipboard":
    case "clipboard-check":
      return ClipboardCheck;

    default:
      return FileText;
  }
}

function normalizeOptionalHref(
  value?: string | null,
): string | null {
  const href = value?.trim();

  if (!href) {
    return null;
  }

  if (
    href.startsWith("/") ||
    href.startsWith("#") ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return href;
  }

  return `/${href.replace(/^\/+/, "")}`;
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