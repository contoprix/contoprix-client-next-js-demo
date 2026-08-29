import { Award as AwardIcon } from "lucide-react";

import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { AwardCardComponentSettings } from "@/contoprix/generated";
import { linkWrap, mediaUrl } from "./media";

export default function AwardCard(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<AwardCardComponentSettings>(props);
  if (!data?.title) return null;

  const image = mediaUrl(data.image);

  const card = (
    <article className="group flex h-full flex-col items-center border border-slate-200 bg-white p-6 text-center transition-colors hover:border-orange-300">
      <div className="flex size-16 items-center justify-center">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- media host isn't a configured next/image remote pattern in this demo
          <img src={image} alt="" className="max-h-16 max-w-16 object-contain" />
        ) : (
          <AwardIcon className="size-10 text-orange-400" aria-hidden />
        )}
      </div>

      <h3 className="mt-4 text-base font-semibold text-slate-950">{data.title}</h3>
      {data.issuer || data.year ? (
        <p className="mt-1 text-sm text-slate-500">
          {[data.issuer, data.year].filter(Boolean).join(" · ")}
        </p>
      ) : null}
      {data.description ? (
        <p className="mt-2 text-sm leading-6 text-slate-600">{data.description}</p>
      ) : null}
      {data.link?.label ? (
        <span className="mt-4 text-sm font-medium text-orange-600 group-hover:text-orange-700">
          {data.link.label} →
        </span>
      ) : null}
    </article>
  );

  return linkWrap(card, data.link, data.title, previewAttributes);
}
