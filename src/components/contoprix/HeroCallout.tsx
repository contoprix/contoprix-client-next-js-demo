import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { HeroCalloutComponentSettings } from "@/contoprix/generated";
import { DynamicIcon } from "./icons";

/** HeroBanner renders a `callout` field inline using the same data shape -- this is the
 * standalone rendering for a hero_callout block used on its own. */
export default function HeroCallout(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<HeroCalloutComponentSettings>(props);
  if (!data?.description) return null;

  return (
    <aside className="max-w-xs border-l border-slate-200 pl-6" {...previewAttributes}>
      {data.callout_icon ? <DynamicIcon icon={data.callout_icon} className="mb-3 size-6 text-orange-600" aria-hidden /> : null}
      <p className="text-base leading-7 text-slate-600">{data.description}</p>
    </aside>
  );
}
