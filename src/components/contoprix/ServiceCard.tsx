import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { ServiceCardComponentSettings } from "@/contoprix/generated";
import { DynamicIcon } from "./icons";
import { linkWrap, mediaUrl } from "./media";

export default function ServiceCard(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<ServiceCardComponentSettings>(props);
  if (!data?.name) return null;

  const image = mediaUrl(data.image);

  const card = (
    <article className="group flex h-full flex-col border border-slate-200 bg-white transition-colors hover:border-orange-300">
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

      <div className="flex flex-1 flex-col p-6">
        {!image ? (
          <span className="mb-4 inline-flex size-10 items-center justify-center border border-orange-200 bg-orange-50 text-orange-600">
            <DynamicIcon icon={data.icon} className="size-[18px]" aria-hidden />
          </span>
        ) : null}
        {data.category ? (
          <span className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-orange-600">
            {data.category}
          </span>
        ) : null}
        <h3 className="text-base font-semibold text-slate-950">{data.name}</h3>
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

  return linkWrap(card, data.link, data.name, previewAttributes);
}
