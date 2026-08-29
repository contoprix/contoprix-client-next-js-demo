import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { SocialLinkComponentSettings } from "@/contoprix/generated";
import { DynamicIcon } from "./icons";

// lucide-react's own export names don't always match Contoprix's platform values (e.g. "x" is
// still exported as "Twitter" pre-rebrand, and there's no dedicated TikTok glyph) -- mapped
// explicitly rather than passed straight through to resolveIcon's dynamic lookup.
const PLATFORM_ICON_KEY: Record<string, string> = {
  x: "twitter",
  linkedin: "linkedin",
  facebook: "facebook",
  instagram: "instagram",
  youtube: "youtube",
  github: "github",
  tiktok: "music-2",
};

export default function SocialLink(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<SocialLinkComponentSettings>(props);
  if (!data?.url) return null;

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={data.platform}
      className="flex size-8 items-center justify-center border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600"
      {...previewAttributes}
    >
      <DynamicIcon icon={PLATFORM_ICON_KEY[data.platform] ?? data.platform} className="size-4" aria-hidden />
    </a>
  );
}
