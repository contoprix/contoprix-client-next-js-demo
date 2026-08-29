import { ArrowUpRight } from "lucide-react";

import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { LinkComponentSettings } from "@/contoprix/generated";

/** Standalone rendering of a "link" block. Most components embed `link`/`cta` fields and
 * render them inline (see Button, Card, FeatureCard) -- this covers a link used as its own
 * top-level block. */
export default function LinkBlock(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<LinkComponentSettings>(props);
  if (!data?.label || !data?.url) return null;

  return (
    <a
      href={data.url}
      target={data.target === "_blank" ? "_blank" : undefined}
      rel={data.target === "_blank" ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700"
      {...previewAttributes}
    >
      {data.label}
      <ArrowUpRight className="size-4" aria-hidden />
    </a>
  );
}
