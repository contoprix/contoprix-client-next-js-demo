import { MapPin, Star, Store } from "lucide-react";

import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { ListingCardComponentSettings } from "@/contoprix/generated";
import { linkWrap, mediaUrl } from "./media";

export default function ListingCard(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<ListingCardComponentSettings>(props);
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
            <Store className="size-10" aria-hidden />
          </div>
        )}
        {data.category ? (
          <span className="absolute left-3 top-3 inline-flex items-center bg-white/90 px-2 py-0.5 text-xs font-medium text-slate-700">
            {data.category}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold leading-snug text-slate-950">{data.name}</h3>
          {typeof data.rating === "number" ? (
            <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-slate-700">
              <Star className="size-3.5 fill-orange-400 text-orange-400" aria-hidden />
              {data.rating.toFixed(1)}
            </span>
          ) : null}
        </div>
        {data.location ? (
          <span className="mt-2 inline-flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="size-3.5" aria-hidden />
            {data.location}
          </span>
        ) : null}
      </div>
    </article>
  );

  return linkWrap(card, data.link, data.name, previewAttributes);
}
