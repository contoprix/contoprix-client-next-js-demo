import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { CardComponentSettings } from "@/contoprix/generated";
import { linkWrap, mediaUrl } from "./media";

export default function Card(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<CardComponentSettings>(props);
  if (!data?.title) return null;

  const image = mediaUrl(data.image);

  const card = (
    <article className="group flex h-full flex-col overflow-hidden border border-slate-200 bg-white transition-colors hover:border-orange-300">
      {image ? (
        <div className="aspect-video w-full overflow-hidden bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element -- media host isn't a configured next/image remote pattern in this demo */}
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold leading-snug text-slate-950">{data.title}</h3>
        {data.description ? (
          <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{data.description}</p>
        ) : null}
        {data.link?.label ? (
          <span className="mt-4 text-sm font-medium text-orange-600 group-hover:text-orange-700">
            {data.link.label} →
          </span>
        ) : null}
      </div>
    </article>
  );

  return linkWrap(card, data.link, data.title, previewAttributes);
}
