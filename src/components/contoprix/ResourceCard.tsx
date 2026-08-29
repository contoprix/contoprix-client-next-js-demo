import { FileText, Lock } from "lucide-react";

import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { ResourceCardComponentSettings } from "@/contoprix/generated";
import { linkWrap, mediaUrl } from "./media";

const RESOURCE_TYPE_LABELS: Record<string, string> = {
  guide: "Guide",
  whitepaper: "Whitepaper",
  template: "Template",
  report: "Report",
  video: "Video",
  dataset: "Dataset",
};

export default function ResourceCard(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<ResourceCardComponentSettings>(props);
  if (!data?.title) return null;

  const thumbnail = mediaUrl(data.thumbnail);
  const typeLabel = data.resource_type ? RESOURCE_TYPE_LABELS[data.resource_type] ?? data.resource_type : null;

  const card = (
    <article className="group flex h-full gap-4 border border-slate-200 bg-white p-4 transition-colors hover:border-orange-300">
      <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden bg-slate-100">
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element -- media host isn't a configured next/image remote pattern in this demo
          <img src={thumbnail} alt="" className="h-full w-full object-cover" />
        ) : (
          <FileText className="size-6 text-slate-300" aria-hidden />
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2">
          {typeLabel ? (
            <span className="w-fit border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
              {typeLabel}
            </span>
          ) : null}
          {data.gated ? (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Lock className="size-3" aria-hidden />
              Gated
            </span>
          ) : null}
        </div>
        <h3 className="mt-2 text-sm font-semibold leading-snug text-slate-950">{data.title}</h3>
        {data.description ? (
          <p className="mt-1 flex-1 text-sm leading-6 text-slate-600">{data.description}</p>
        ) : null}
        {data.link?.label ? (
          <span className="mt-2 text-sm font-medium text-orange-600 group-hover:text-orange-700">
            {data.link.label} →
          </span>
        ) : null}
      </div>
    </article>
  );

  return linkWrap(card, data.link, data.title, previewAttributes);
}
