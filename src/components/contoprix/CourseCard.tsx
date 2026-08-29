import { BookOpen, Clock, Star } from "lucide-react";

import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { CourseCardComponentSettings } from "@/contoprix/generated";
import { initials, linkWrap, mediaUrl } from "./media";

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const LEVEL_STYLES: Record<string, string> = {
  beginner: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  intermediate: "bg-amber-50 text-amber-700 ring-amber-600/20",
  advanced: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export default function CourseCard(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<CourseCardComponentSettings>(props);
  if (!data?.title) return null;

  const thumbnail = mediaUrl(data.thumbnail);
  const instructorPhoto = mediaUrl(data.instructor_photo);
  const levelLabel = data.level ? LEVEL_LABELS[data.level] ?? data.level : null;
  const levelStyle = data.level ? LEVEL_STYLES[data.level] ?? "bg-slate-100 text-slate-700 ring-slate-500/20" : null;
  const priceLabel = formatPrice(data.price);

  const card = (
    <article className="group flex h-full flex-col overflow-hidden border border-slate-200 bg-white transition-colors hover:border-orange-300">
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element -- media host isn't a configured next/image remote pattern in this demo
          <img
            src={thumbnail}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <BookOpen className="size-10" aria-hidden />
          </div>
        )}
        {levelLabel ? (
          <span
            className={`absolute left-3 top-3 inline-flex items-center px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${levelStyle}`}
          >
            {levelLabel}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold leading-snug text-slate-950">{data.title}</h3>

        {data.instructor_name ? (
          <div className="mt-3 flex items-center gap-2">
            {instructorPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element -- media host isn't a configured next/image remote pattern in this demo
              <img src={instructorPhoto} alt="" className="size-6 rounded-full object-cover" />
            ) : (
              <span className="flex size-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-medium text-slate-500">
                {initials(data.instructor_name)}
              </span>
            )}
            <span className="text-sm text-slate-600">{data.instructor_name}</span>
          </div>
        ) : null}

        <div className="mt-4 flex flex-1 flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
          {data.duration ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden />
              {data.duration}
            </span>
          ) : null}
          {typeof data.lesson_count === "number" ? (
            <span className="inline-flex items-center gap-1">
              <BookOpen className="size-3.5" aria-hidden />
              {data.lesson_count} {data.lesson_count === 1 ? "lesson" : "lessons"}
            </span>
          ) : null}
          {typeof data.rating === "number" ? (
            <span className="inline-flex items-center gap-1">
              <Star className="size-3.5 fill-orange-400 text-orange-400" aria-hidden />
              {data.rating.toFixed(1)}
            </span>
          ) : null}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-sm font-semibold text-slate-950">{priceLabel}</span>
          {data.link?.label ? (
            <span className="text-sm font-medium text-orange-600 group-hover:text-orange-700">
              {data.link.label} →
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );

  return linkWrap(card, data.link, data.title, previewAttributes);
}

function formatPrice(price: number | null | undefined): string {
  if (price == null) return "";
  if (price === 0) return "Free";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
}
