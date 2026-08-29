import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { StructuredDataComponentSettings } from "@/contoprix/generated";

/** Unlike Seo/Canonical/OpenGraph/TwitterCard, structured_data (JSON-LD) is meant to be
 * emitted as a <script type="application/ld+json"> tag in the page body -- it has no head-only
 * requirement, so it's safe (and correct) to render here rather than in generateMetadata(). */
export default function StructuredData(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<StructuredDataComponentSettings>(props);
  if (!data?.data) return null;

  // JSON.stringify doesn't escape "</script>" inside string values, which would otherwise let
  // arbitrary CMS content break out of the script tag early -- escape the slash so it can't.
  const json = JSON.stringify({ "@context": "https://schema.org", "@type": data.schema_type, ...data.data }).replace(
    /<\/script/gi,
    "<\\/script",
  );

  // A <script> tag has no rendered box, so it's never hoverable/selectable in the visual
  // builder canvas regardless -- previewAttributes is still spread for consistency with every
  // other block, in case a future SDK version finds another way to surface it.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} {...previewAttributes} />;
}
