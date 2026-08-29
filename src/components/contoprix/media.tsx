import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import type { ContoprixPreviewAttributes } from "@contoprix/types";

/** `image` fields generate as `string` in generated.ts (a media reference id), but the delivery
 * API actually resolves them to a media object -- see the REST/GraphQL example pages. Narrowed
 * defensively here rather than trusting the generated type for these fields. */
export function mediaUrl(value: unknown): string | null {
  if (value && typeof value === "object" && "Url" in value && typeof (value as { Url: unknown }).Url === "string") {
    return (value as { Url: string }).Url;
  }
  return null;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

interface CardLink {
  label: string;
  url: string;
  target?: "_self" | "_blank" | null;
}

/** Every card component in this app wraps itself in an anchor when its `link` field has a
 * URL -- the whole card becomes clickable rather than requiring a separate CTA click target.
 *
 * `previewAttributes` (the `data-contoprix-*` attributes the visual-editing bridge in Admin's
 * page builder canvas needs to find, hover-outline, and select this block) always lands on the
 * single root element the block actually renders -- the `<a>` when one exists, or `card`
 * itself via `cloneElement` when it doesn't -- never on both, since the bridge keys off exactly
 * one element per block. */
export function linkWrap(
  card: ReactNode,
  link: CardLink | null | undefined,
  label: string,
  previewAttributes?: ContoprixPreviewAttributes,
) {
  if (!link?.url) {
    return isValidElement(card) ? cloneElement(card as ReactElement<Record<string, unknown>>, { ...previewAttributes }) : card;
  }

  return (
    <a
      href={link.url}
      target={link.target === "_blank" ? "_blank" : undefined}
      rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
      className="block h-full"
      aria-label={label}
      {...previewAttributes}
    >
      {card}
    </a>
  );
}
