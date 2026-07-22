"use client";

import type { ContoprixComponentProps } from "@contoprix/react";

type MediaValue = {
  Url?: string;
  url?: string;
  AltText?: string | null;
  altText?: string | null;
};

type HeaderLink = {
  display_link_name?: string;
  link_url?: string;
  is_link_blank_target?: boolean;
};

type HeaderButton = {
  button_display_name?: string;
  button_icon?: string;
  button_url?: string;
};

type HeaderData = {
  logo?: {
    logo_alt?: string;
    logo_image?: MediaValue | string | null;
  };
  header_links?: {
    link?: HeaderLink[];
  };
  header_buttons?: {
    button?: HeaderButton[];
  };
};

export default function HeaderDetail({ content, previewAttributes }: ContoprixComponentProps) {
  const entry = asRecord(content);
  const data = asRecord(entry?.data) as HeaderData | null;
  const logo = data?.logo;
  const logoUrl = getMediaUrl(logo?.logo_image);
  const links = Array.isArray(data?.header_links?.link)
    ? data.header_links.link
    : [];
  const buttons = Array.isArray(data?.header_buttons?.button)
    ? data.header_buttons.button
    : [];

  return (
    <header {...previewAttributes} className="border-b bg-background">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex shrink-0 items-center" aria-label={logo?.logo_alt || "Home"}>
          {logoUrl ? (
            // The CMS may serve local or customer-configured media hosts.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={logo?.logo_alt || getMediaAlt(logo?.logo_image) || ""}
              className="h-10 w-auto object-contain"
            />
          ) : (
            <span className="font-semibold">{logo?.logo_alt || "Contoprix"}</span>
          )}
        </a>

        <nav className="ml-auto hidden items-center gap-6 md:flex" aria-label="Primary navigation">
          {links.map((link, index) => {
            const href = link.link_url?.trim() || "#";
            const external = link.is_link_blank_target === true;
            return (
              <a
                key={`${href}-${index}`}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.display_link_name || href}
              </a>
            );
          })}
        </nav>

        {buttons.length > 0 ? (
          <div className="flex items-center gap-2">
            {buttons.map((button, index) => (
              <a
                key={`${button.button_display_name || "button"}-${index}`}
                href={button.button_url?.trim() || "#"}
                className="inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium transition-colors hover:bg-muted"
                data-icon={button.button_icon || undefined}
              >
                {button.button_display_name || "Action"}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function getMediaUrl(value: MediaValue | string | null | undefined): string {
  if (typeof value === "string") return value;
  return value?.Url || value?.url || "";
}

function getMediaAlt(value: MediaValue | string | null | undefined): string {
  if (!value || typeof value === "string") return "";
  return value.AltText || value.altText || "";
}
