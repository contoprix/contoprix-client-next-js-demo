import type { ContoprixComponentProps } from "@contoprix/react";

/** Like Seo -- metadata for a route's <head>, not a visible block. Registered so it doesn't
 * fall through to MissingComponent's placeholder if a page ever attaches it as its own block. */
export default function Canonical(_props: ContoprixComponentProps) {
  return null;
}
