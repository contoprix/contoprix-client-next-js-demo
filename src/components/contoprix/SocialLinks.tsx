import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { SocialLinksComponentSettings } from "@/contoprix/generated";
import SocialLink from "./SocialLink";

export default function SocialLinks(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<SocialLinksComponentSettings>(props);
  const links = data?.links ?? [];
  if (links.length === 0) return null;

  return (
    <div className="flex items-center gap-2" {...previewAttributes}>
      {links.map((link, index) => (
        <SocialLink key={`${link.platform}-${index}`} settings={link as unknown as Record<string, unknown>} />
      ))}
    </div>
  );
}
