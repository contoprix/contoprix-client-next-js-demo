import { Tag } from "lucide-react";

import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { OfferCardComponentSettings } from "@/contoprix/generated";
import { formatDate, linkWrap } from "./media";

export default function OfferCard(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<OfferCardComponentSettings>(props);
  if (!data?.title) return null;

  const validTo = formatDate(data.valid_to);

  const card = (
    <article className="group relative flex h-full flex-col overflow-hidden border border-orange-200 bg-orange-50/40 p-6 transition-colors hover:border-orange-400">
      {typeof data.discount_percent === "number" ? (
        <span className="w-fit bg-orange-600 px-2.5 py-1 text-sm font-semibold text-white">
          {data.discount_percent}% OFF
        </span>
      ) : null}

      <h3 className="mt-4 text-base font-semibold leading-snug text-slate-950">{data.title}</h3>
      {data.description ? (
        <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{data.description}</p>
      ) : null}

      <div className="mt-4 flex items-center justify-between border-t border-orange-200/70 pt-4 text-xs text-slate-500">
        {data.code ? (
          <span className="inline-flex items-center gap-1 border border-dashed border-orange-300 bg-white px-2 py-1 font-mono font-medium text-orange-700">
            <Tag className="size-3" aria-hidden />
            {data.code}
          </span>
        ) : null}
        {validTo ? <span>Ends {validTo}</span> : null}
      </div>

      {data.link?.label ? (
        <span className="mt-4 text-sm font-medium text-orange-600 group-hover:text-orange-700">
          {data.link.label} →
        </span>
      ) : null}
    </article>
  );

  return linkWrap(card, data.link, data.title, previewAttributes);
}
