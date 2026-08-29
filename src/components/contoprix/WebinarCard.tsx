import { Clock, PlayCircle } from "lucide-react";

import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { WebinarCardComponentSettings } from "@/contoprix/generated";
import { linkWrap, mediaUrl } from "./media";

const STATUS_LABELS: Record<string, string> = {
  upcoming: "Upcoming",
  on_demand: "On-Demand",
};

export default function WebinarCard(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<WebinarCardComponentSettings>(props);
  if (!data?.title) return null;

  const thumbnail = mediaUrl(data.thumbnail);
  const statusLabel = data.status ? STATUS_LABELS[data.status] ?? data.status : null;
  const scheduled = formatDateTime(data.scheduled_at);

  const card = (
    <article className="group flex h-full flex-col overflow-hidden border border-slate-200 bg-white transition-colors hover:border-orange-300">
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element -- media host isn't a configured next/image remote pattern in this demo
          <img
            src={thumbnail}
            alt=""
            className="h-full w-full object-cover opacity-80 transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayCircle className="size-10 text-white" aria-hidden />
        </div>
        {statusLabel ? (
          <span className="absolute left-3 top-3 inline-flex items-center bg-orange-600 px-2 py-0.5 text-xs font-medium text-white">
            {statusLabel}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold leading-snug text-slate-950">{data.title}</h3>
        {data.presenter_name ? <p className="mt-2 text-sm text-slate-600">{data.presenter_name}</p> : null}

        <div className="mt-4 flex flex-1 items-end flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          {scheduled ? <span>{scheduled}</span> : null}
          {typeof data.duration_minutes === "number" ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden />
              {data.duration_minutes} min
            </span>
          ) : null}
        </div>

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

function formatDateTime(value: string | null | undefined): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
