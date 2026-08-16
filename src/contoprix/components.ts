import type { ComponentRegistry } from "@contoprix/react";

import BlogPostDetail from "@/components/contoprix/BlogPostDetail";
import BlogPostList from "@/components/contoprix/BlogPostList";
import Button from "@/components/contoprix/Button";
import CapabilitiesSection from "@/components/contoprix/CapabilitiesSection";
import ContentList from "@/components/contoprix/ContentList";
import HeroBanner from "@/components/contoprix/HeroBanner";
import Seo from "@/components/contoprix/Seo";

// Custom overrides for every renderable type in the current schema (`npx contoprix validate`
// reports coverage). Anything NOT in this registry -- a brand-new component type added after
// the last `contoprix pull`, or a form/content-entry block -- still falls through to the
// SDK's schema-driven GenericBlockRenderer or the MissingComponent placeholder. See
// "How rendering works" in the README for the exact resolution order.
export const components: ComponentRegistry = {
  "blog_post-detail": BlogPostDetail,
  "blog_post-list": BlogPostList,
  "button": Button,
  "capabilities_section": CapabilitiesSection,
  "content-list": ContentList,
  "hero_banner": HeroBanner,
  "seo": Seo,
};

export default components;
