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

type FooterLink = {
  link_name?: string;
  link_url?: string;
  is_link_blank_target?: boolean;
};

type FooterLinkGroup = {
  link_title?: string;
  links?: FooterLink[];
};

type FooterLinkItem = {
  footer_links?: FooterLinkGroup;
};

type FooterData = {
  logo?: {
    logo_alt?: string;
    logo_image?: MediaValue | string | null;
  };
  links?: FooterLinkItem[];
  description?: string;
  copyright_text?: string;
};

export default function FooterDetail({
  content,
}: ContoprixComponentProps) {
  const entry = asRecord(content);
  const data = asRecord(entry?.data) as FooterData | null;

  const logo = data?.logo;
  const logoUrl = getMediaUrl(logo?.logo_image);
  const logoAlt =
    logo?.logo_alt?.trim() ||
    getMediaAlt(logo?.logo_image) ||
    "Contoprix";

  const linkGroups = Array.isArray(data?.links)
    ? data.links
        .map((item) => item?.footer_links)
        .filter(isFooterLinkGroup)
    : [];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <a
              href="/"
              className="inline-flex items-center"
              aria-label={`${logoAlt} home`}
            >
              {logoUrl ? (
                // CMS media can come from local or customer-configured hosts.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={logoAlt}
                  className="h-10 w-auto max-w-[180px] object-contain"
                />
              ) : (
                <span className="text-xl font-semibold">
                  {logoAlt}
                </span>
              )}
            </a>

            {data?.description ? (
              <p className="mt-5 text-sm leading-7 text-white/65">
                {data.description}
              </p>
            ) : (
              <p className="mt-5 text-sm leading-7 text-white/65">
                Build, manage, and deliver modern digital experiences
                with Contoprix.
              </p>
            )}
          </div>

          {linkGroups.map((group, groupIndex) => {
            const links = Array.isArray(group.links)
              ? group.links
              : [];

            return (
              <div
                key={`${group.link_title || "footer-group"}-${groupIndex}`}
              >
                {group.link_title ? (
                  <h2 className="text-sm font-semibold tracking-wide text-white">
                    {group.link_title}
                  </h2>
                ) : null}

                {links.length > 0 ? (
                  <ul className="mt-5 space-y-3">
                    {links.map((link, linkIndex) => {
                      const href = normalizeUrl(
                        link.link_url?.trim() || "#",
                      );

                      const openInNewTab =
                        link.is_link_blank_target === true ||
                        isExternalUrl(href);

                      return (
                        <li
                          key={`${href}-${linkIndex}`}
                        >
                          <a
                            href={href}
                            target={
                              openInNewTab
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              openInNewTab
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className="text-sm text-white/65 transition-colors hover:text-white"
                          >
                            {link.link_name?.trim() || href}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-sm text-white/50">
            {data?.copyright_text?.trim() ||
              `© ${currentYear} Contoprix. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}

function asRecord(
  value: unknown,
): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function isFooterLinkGroup(
  value: FooterLinkGroup | undefined,
): value is FooterLinkGroup {
  return Boolean(value && typeof value === "object");
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
  return (
    url.startsWith("http://") ||
    url.startsWith("https://")
  );
}