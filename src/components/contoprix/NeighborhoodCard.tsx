import { MapPinned } from "lucide-react";

import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { NeighborhoodCardComponentSettings } from "@/contoprix/generated";
import { linkWrap, mediaUrl } from "./media";

export default function NeighborhoodCard(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<NeighborhoodCardComponentSettings>(props);
  if (!data?.name) return null;

  const image = mediaUrl(data.image);

  const card = (
    <article className="group flex h-full flex-col overflow-hidden border border-slate-200 bg-white transition-colors hover:border-orange-300">
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- media host isn't a configured next/image remote pattern in this demo
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <MapPinned className="size-10" aria-hidden />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold leading-snug text-slate-950">{data.name}</h3>
        {data.description ? (
          <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{data.description}</p>
        ) : null}

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-600">
          {typeof data.property_count === "number" ? (
            <span>
              {data.property_count} {data.property_count === 1 ? "home" : "homes"}
            </span>
          ) : null}
          {data.price_range ? <span className="font-medium text-slate-950">{data.price_range}</span> : null}
        </div>
      </div>
    </article>
  );

  return linkWrap(card, data.link, data.name, previewAttributes);
}
