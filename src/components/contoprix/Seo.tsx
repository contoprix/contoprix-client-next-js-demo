import type { ContoprixComponentProps } from "@contoprix/react";

/**
 * `seo` (meta_title, meta_description, social_image) is metadata, not a visible block -- it
 * belongs in a route's `generateMetadata()`/`<head>`, not the page body. Registered here (so
 * it doesn't fall through to MissingComponent's placeholder if a page ever attaches it as its
 * own block) but intentionally renders nothing.
 */
export default function Seo(_props: ContoprixComponentProps) {
  return null;
}
