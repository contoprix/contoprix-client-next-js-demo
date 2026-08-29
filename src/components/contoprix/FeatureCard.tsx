import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { FeatureCardComponentSettings } from "@/contoprix/generated";
import { DynamicIcon } from "./icons";
import { linkWrap, mediaUrl } from "./media";

export default function FeatureCard(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<FeatureCardComponentSettings>(props);
  if (!data?.title) return null;

  const image = mediaUrl(data.image);

  const card = (
    <article className="group flex h-full flex-col border border-slate-200 bg-white p-6 transition-colors hover:border-orange-300">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- media host isn't a configured next/image remote pattern in this demo
        <img src={image} alt="" className="mb-4 h-32 w-full object-cover" />
      ) : (
        <span className="mb-4 inline-flex size-10 items-center justify-center border border-orange-200 bg-orange-50 text-orange-600">
          <DynamicIcon icon={data.icon} className="size-[18px]" aria-hidden />
        </span>
      )}
      <h3 className="text-base font-semibold text-slate-950">{data.title}</h3>
      {data.description ? (
        <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{data.description}</p>
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
