import { BookOpen } from "lucide-react";

import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { DocArticleCardComponentSettings } from "@/contoprix/generated";
import { linkWrap } from "./media";

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  intermediate: "bg-amber-50 text-amber-700 ring-amber-600/20",
  advanced: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export default function DocArticleCard(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<DocArticleCardComponentSettings>(props);
  if (!data?.title) return null;

  const difficultyStyle = data.difficulty
    ? DIFFICULTY_STYLES[data.difficulty] ?? "bg-slate-100 text-slate-700 ring-slate-500/20"
    : null;

  const card = (
    <article className="group flex h-full flex-col border border-slate-200 bg-white p-6 transition-colors hover:border-orange-300">
      <span className="inline-flex size-9 items-center justify-center border border-sky-200 bg-sky-50 text-sky-600">
        <BookOpen className="size-4" aria-hidden />
      </span>

      <div className="mt-4 flex items-center gap-2">
        {data.category ? <span className="text-xs font-medium text-slate-500">{data.category}</span> : null}
        {data.difficulty ? (
          <span
            className={`inline-flex items-center px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${difficultyStyle}`}
          >
            {data.difficulty[0].toUpperCase() + data.difficulty.slice(1)}
          </span>
        ) : null}
      </div>

      <h3 className="mt-2 text-base font-semibold leading-snug text-slate-950">{data.title}</h3>
      {data.summary ? <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{data.summary}</p> : null}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        {data.estimated_time ? <span className="text-xs text-slate-500">{data.estimated_time}</span> : null}
        {data.link?.label ? (
          <span className="text-sm font-medium text-orange-600 group-hover:text-orange-700">
            {data.link.label} →
          </span>
        ) : null}
      </div>
    </article>
  );

  return linkWrap(card, data.link, data.title, previewAttributes);
}
