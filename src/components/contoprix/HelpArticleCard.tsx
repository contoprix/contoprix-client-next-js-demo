import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { HelpArticleCardComponentSettings } from "@/contoprix/generated";
import { DynamicIcon } from "./icons";
import { linkWrap } from "./media";

export default function HelpArticleCard(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<HelpArticleCardComponentSettings>(props);
  if (!data?.title) return null;

  const card = (
    <article className="group flex h-full items-start gap-4 border border-slate-200 bg-white p-5 transition-colors hover:border-orange-300">
      <span className="flex size-9 shrink-0 items-center justify-center border border-emerald-200 bg-emerald-50 text-emerald-600">
        <DynamicIcon icon={data.icon} className="size-4" aria-hidden />
      </span>

      <div className="flex flex-1 flex-col">
        {data.category ? <span className="text-xs font-medium text-slate-500">{data.category}</span> : null}
        <h3 className="mt-1 text-sm font-semibold leading-snug text-slate-950">{data.title}</h3>
        {data.excerpt ? <p className="mt-1 text-sm leading-6 text-slate-600">{data.excerpt}</p> : null}
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
