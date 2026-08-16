import type { ContoprixComponentProps } from "@contoprix/react";
import type { HeroBannerComponentSettings } from "@/contoprix/generated";
import { resolveIcon } from "./icons";

export default function HeroBannerDetail({ content }: ContoprixComponentProps) {
  const data = content as HeroBannerComponentSettings | undefined;
  if (!data?.heading) return null;

  const CalloutIcon = data.callout?.callout_icon ? resolveIcon(data.callout.callout_icon) : null;

  return (
    <section className="border-b border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:py-28">
        <div>
          {data.eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">{data.eyebrow}</p>
          ) : null}
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl">
            {splitHeading(data.heading).map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </h1>
          {data.description ? (
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{data.description}</p>
          ) : null}
        </div>

        {data.callout?.description ? (
          <aside className="max-w-xs border-l border-slate-700 pl-6">
            {CalloutIcon ? <CalloutIcon className="mb-4 size-6 text-orange-500" aria-hidden /> : null}
            <p className="text-base leading-7 text-slate-300">{data.callout.description}</p>
          </aside>
        ) : null}
      </div>
    </section>
  );
}

/** CMS editors write the heading as one or two plain sentences, no manual line break required
 * -- each sentence renders on its own line if there are exactly two. */
function splitHeading(value: string): string[] {
  const manualLines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (manualLines.length > 1) return manualLines;

  const sentences = value.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) ?? [];
  return sentences.length === 2 ? sentences : [value];
}
