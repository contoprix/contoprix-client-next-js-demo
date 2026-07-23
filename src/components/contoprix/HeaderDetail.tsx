"use client";

import { useState } from "react";
import {
  Home,
  LogIn,
  Menu,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";

import type { ContoprixComponentProps } from "@contoprix/react";
import Link from "next/link";

type MediaValue = {
  Id?: string;
  id?: string;

  FileName?: string;
  fileName?: string;

  Url?: string;
  url?: string;

  AltText?: string | null;
  altText?: string | null;

  Caption?: string | null;
  MimeType?: string;
};

type LogoField = {
  logo?: MediaValue | string | null;
  alt_text?: string | null;
  __componentTypeId?: string;
};

type NavigationLink = {
  title?: string;
  icon?: string | null;
  link?: string | null;
  innewtab?: boolean;
  __componentTypeId?: string;
};

type NavigationLinkItem = {
  links?: NavigationLink | null;
};

type HeaderButton = {
  title?: string;
  icon?: string | null;
  button_url?: string | null;
  button_type?: "button" | "link" | string;
  innewtab?: boolean;
  variant?: "icon" | "ghost" | "outline" | "primary";
  __componentTypeId?: string;
};

type HeaderButtonItem = {
  button?: HeaderButton | null;
};

type HeaderData = {
  logo_field?: LogoField | null;
  navigation_links?: NavigationLinkItem[] | null;
  header_buttons?: HeaderButtonItem[] | null;
};

export default function HeaderDetail({
  content,
  previewAttributes,
}: ContoprixComponentProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const contentEntry = asRecord(content);
  const data = asRecord(contentEntry?.data) as HeaderData | null;

  const logoField = data?.logo_field;
  const logoUrl = getMediaUrl(logoField?.logo);

  const logoAlt =
    logoField?.alt_text ||
    getMediaAlt(logoField?.logo) ||
    "Contoprix";

  const navigationLinks = normalizeNavigationLinks(
    data?.navigation_links,
  );

  const headerButtons = normalizeHeaderButtons(
    data?.header_buttons,
  );

  function handleButtonAction(button: HeaderButton) {
    const action = button.icon?.trim().toLowerCase();
    const title = button.title?.trim().toLowerCase();

    if (action === "search" || title === "search") {
      setSearchOpen((current) => !current);
      return;
    }

    if (
      action === "login" ||
      action === "log-in" ||
      title === "login"
    ) {
      const destination =
        normalizeOptionalHref(button.button_url) || "/login";

      window.location.href = destination;
      return;
    }

    const destination = normalizeOptionalHref(
      button.button_url,
    );

    if (destination) {
      window.location.href = destination;
    }
  }

  return (
    <header
      {...previewAttributes}
      className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white"
    >
      <div className="mx-auto flex min-h-[88px] max-w-[1880px] items-center px-5 sm:px-8 lg:min-h-[108px] lg:px-14 xl:px-16">
        {/* Logo */}
        <Link
          href="/"
          aria-label={logoAlt}
          className="flex shrink-0 items-center"
        >
          {logoUrl ? (
            // CMS media can use an external or customer-configured host.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={logoAlt}
              className="h-12 w-auto max-w-[210px] object-contain sm:h-14"
            />
          ) : (
            <span className="text-2xl font-bold tracking-tight text-slate-950">
              {logoAlt}
            </span>
          )}
        </Link>

        {/* Desktop navigation */}
        {navigationLinks.length > 0 ? (
          <nav
            aria-label="Primary navigation"
            className="hidden flex-1 items-center justify-center gap-8 lg:flex xl:gap-10"
          >
            {navigationLinks.map((item, index) => {
              const href = normalizeHref(item.link);
              const Icon = resolveIcon(item.icon);
              const openInNewTab =
                item.innewtab === true;

              return (
                <Link
                  key={`${item.title || href}-${index}`}
                  href={href}
                  target={
                    openInNewTab ? "_blank" : undefined
                  }
                  rel={
                    openInNewTab
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="inline-flex items-center gap-2 whitespace-nowrap text-[16px] font-semibold text-slate-700 transition-colors hover:text-orange-600 xl:text-[17px]"
                >
                  {Icon ? (
                    <Icon
                      aria-hidden="true"
                      className="size-[18px]"
                      strokeWidth={2}
                    />
                  ) : null}

                  <span>{item.title || href}</span>
                </Link>
              );
            })}
          </nav>
        ) : (
          <div className="hidden flex-1 lg:block" />
        )}

        {/* Desktop header actions */}
        <div className="ml-auto hidden shrink-0 items-center gap-2 lg:flex">
          {headerButtons.map((button, index) => (
            <HeaderAction
              key={`${button.title || "action"}-${index}`}
              button={button}
              onAction={handleButtonAction}
            />
          ))}
        </div>

        {/* Mobile actions */}
        <div className="ml-auto flex items-center gap-1 lg:hidden">
          {headerButtons
            .filter((button) => isSearchButton(button))
            .slice(0, 1)
            .map((button, index) => (
              <HeaderAction
                key={`mobile-search-${index}`}
                button={button}
                onAction={handleButtonAction}
                compact
              />
            ))}

          <button
            type="button"
            aria-label={
              mobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
            onClick={() =>
              setMobileMenuOpen((current) => !current)
            }
            className="inline-flex size-11 items-center justify-center rounded-md text-slate-950 transition-colors hover:bg-slate-100"
          >
            {mobileMenuOpen ? (
              <X
                aria-hidden="true"
                className="size-6"
              />
            ) : (
              <Menu
                aria-hidden="true"
                className="size-6"
              />
            )}
          </button>
        </div>
      </div>

      {/* Search panel */}
      {searchOpen ? (
        <div className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center gap-3 px-5 py-5 sm:px-8">
            <Search
              aria-hidden="true"
              className="size-5 shrink-0 text-slate-500"
            />

            <input
              type="search"
              autoFocus
              placeholder="Search Contoprix..."
              aria-label="Search"
              className="h-12 min-w-0 flex-1 border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-orange-600"
            />

            <button
              type="button"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            >
              <X
                aria-hidden="true"
                className="size-5"
              />
            </button>
          </div>
        </div>
      ) : null}

      {/* Mobile menu */}
      {mobileMenuOpen ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="px-5 py-5 sm:px-8">
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col"
            >
              {navigationLinks.map((item, index) => {
                const href = normalizeHref(item.link);
                const Icon = resolveIcon(item.icon);
                const openInNewTab =
                  item.innewtab === true;

                return (
                  <Link
                    key={`mobile-${item.title || href}-${index}`}
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
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="flex min-h-14 items-center gap-3 border-b border-slate-100 py-3 text-base font-semibold text-slate-700 transition-colors hover:text-orange-600"
                  >
                    {Icon ? (
                      <Icon
                        aria-hidden="true"
                        className="size-5"
                      />
                    ) : null}

                    <span>{item.title || href}</span>
                  </Link>
                );
              })}
            </nav>

            {headerButtons.length > 0 ? (
              <div className="mt-5 grid gap-3">
                {headerButtons
                  .filter(
                    (button) =>
                      !isSearchButton(button),
                  )
                  .map((button, index) => (
                    <HeaderAction
                      key={`mobile-action-${button.title}-${index}`}
                      button={button}
                      onAction={(selectedButton) => {
                        setMobileMenuOpen(false);
                        handleButtonAction(selectedButton);
                      }}
                      mobile
                    />
                  ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}

type HeaderActionProps = {
  button: HeaderButton;
  onAction: (button: HeaderButton) => void;
  compact?: boolean;
  mobile?: boolean;
};

function HeaderAction({
  button,
  onAction,
  compact = false,
  mobile = false,
}: HeaderActionProps) {
  const title = button.title?.trim() || "Action";
  const Icon = resolveIcon(button.icon);
  const href = normalizeOptionalHref(
    button.button_url,
  );

  const isSearch = isSearchButton(button);
  const isLogin = isLoginButton(button);

  const elementType = button.button_type
    ?.trim()
    .toLowerCase();

  const shouldRenderAsLink =
    elementType === "link" && Boolean(href);

  const classes = getButtonClasses({
    button,
    compact,
    mobile,
    isSearch,
    isLogin,
  });

  if (shouldRenderAsLink && href) {
    return (
      <a
        href={href}
        target={
          button.innewtab === true
            ? "_blank"
            : undefined
        }
        rel={
          button.innewtab === true
            ? "noopener noreferrer"
            : undefined
        }
        aria-label={title}
        className={classes}
      >
        {Icon ? (
          <Icon
            aria-hidden="true"
            className="size-5 shrink-0"
            strokeWidth={2}
          />
        ) : null}

        {!compact ? <span>{title}</span> : null}
      </a>
    );
  }

  return (
    <button
      type="button"
      aria-label={title}
      onClick={() => onAction(button)}
      className={classes}
    >
      {Icon ? (
        <Icon
          aria-hidden="true"
          className="size-5 shrink-0"
          strokeWidth={2}
        />
      ) : null}

      {!compact ? <span>{title}</span> : null}
    </button>
  );
}

type ButtonClassOptions = {
  button: HeaderButton;
  compact: boolean;
  mobile: boolean;
  isSearch: boolean;
  isLogin: boolean;
};

function getButtonClasses({
  button,
  compact,
  mobile,
  isSearch,
  isLogin,
}: ButtonClassOptions): string {
  if (compact || isSearch) {
    return [
      "inline-flex size-11 items-center justify-center",
      "rounded-md text-slate-950",
      "transition-colors hover:bg-slate-100",
    ].join(" ");
  }

  const baseClasses = [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap font-semibold",
    "transition-colors",
    mobile
      ? "min-h-12 w-full px-5 text-base"
      : "h-[52px] px-5 text-[16px]",
  ];

  const variant =
    button.variant ||
    (isLogin ? "ghost" : "outline");

  switch (variant) {
    case "primary":
      return [
        ...baseClasses,
        "border border-orange-600",
        "bg-orange-600 text-slate-950",
        "hover:border-orange-700 hover:bg-orange-700",
      ].join(" ");

    case "outline":
      return [
        ...baseClasses,
        "border border-slate-300 bg-white",
        "text-slate-950",
        "hover:border-slate-400 hover:bg-slate-50",
      ].join(" ");

    case "icon":
      return [
        "inline-flex size-11 items-center justify-center",
        "rounded-md text-slate-950",
        "transition-colors hover:bg-slate-100",
      ].join(" ");

    case "ghost":
    default:
      return [
        ...baseClasses,
        "border border-transparent bg-transparent",
        "text-slate-950 hover:bg-slate-100",
      ].join(" ");
  }
}

function normalizeNavigationLinks(
  items: NavigationLinkItem[] | null | undefined,
): NavigationLink[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => item?.links)
    .filter(
      (item): item is NavigationLink =>
        Boolean(item?.title || item?.link),
    );
}

function normalizeHeaderButtons(
  items: HeaderButtonItem[] | null | undefined,
): HeaderButton[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => item?.button)
    .filter(
      (item): item is HeaderButton =>
        Boolean(
          item?.title ||
            item?.icon ||
            item?.button_url,
        ),
    );
}

function isSearchButton(
  button: HeaderButton,
): boolean {
  const icon = button.icon?.trim().toLowerCase();
  const title = button.title
    ?.trim()
    .toLowerCase();

  return icon === "search" || title === "search";
}

function isLoginButton(
  button: HeaderButton,
): boolean {
  const icon = button.icon?.trim().toLowerCase();
  const title = button.title
    ?.trim()
    .toLowerCase();

  return (
    icon === "login" ||
    icon === "log-in" ||
    icon === "signin" ||
    icon === "sign-in" ||
    title === "login" ||
    title === "sign in"
  );
}

function normalizeHref(
  value?: string | null,
): string {
  return normalizeOptionalHref(value) || "#";
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

  return `/${href}`;
}

function resolveIcon(
  value?: string | null,
): LucideIcon | null {
  const icon = value?.trim().toLowerCase();

  switch (icon) {
    case "home":
      return Home;

    case "search":
      return Search;

    case "login":
    case "log-in":
    case "signin":
    case "sign-in":
      return LogIn;

    case "menu":
      return Menu;

    case "close":
    case "x":
      return X;

    default:
      return null;
  }
}

function getMediaUrl(
  value: MediaValue | string | null | undefined,
): string {
  if (typeof value === "string") {
    return value.trim();
  }

  return value?.Url || value?.url || "";
}

function getMediaAlt(
  value: MediaValue | string | null | undefined,
): string {
  if (!value || typeof value === "string") {
    return "";
  }

  return value.AltText || value.altText || "";
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