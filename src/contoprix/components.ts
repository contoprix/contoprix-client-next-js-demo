import type { ComponentRegistry } from "@contoprix/react";

// This demo intentionally ships with zero custom overrides. Every block on
// every page -- header, footer, and CMS content alike -- resolves through
// the SDK's schema-driven GenericBlockRenderer (or MissingComponent for
// forms/content blocks it doesn't attempt to generically render). That's a
// deliberate choice, not a placeholder state: it's the fastest way to see
// what your content model looks like rendered with zero custom UI, and the
// baseline every custom override in a real project improves on.
//
// To add one back, register it here:
//
//   import HeroBannerDetail from "@/components/contoprix/HeroBannerDetail";
//
//   export const components: ComponentRegistry = {
//     "hero_banner-detail": HeroBannerDetail,
//   };
//
// See "How rendering works" in the README for the full resolution order.
export const components: ComponentRegistry = {};

export default components;
