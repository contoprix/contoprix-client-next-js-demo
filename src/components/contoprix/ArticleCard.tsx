import { Newspaper } from "lucide-react";

import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { ArticleCardComponentSettings } from "@/contoprix/generated";
import { formatDate, linkWrap, mediaUrl } from "./media";

export default function ArticleCard(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<ArticleCardComponentSettings>(props);
  if (!data?.title) return null;

  const image = mediaUrl(data.image);
  const date = formatDate(data.published_at);

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
            <Newspaper className="size-10" aria-hidden />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {data.category ? (
          <span className="w-fit border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
            {data.category}
          </span>
        ) : null}
        <h3 className="mt-3 text-base font-semibold leading-snug text-slate-950">{data.title}</h3>
        {data.summary ? <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{data.summary}</p> : null}

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          {data.author_name ? <span>{data.author_name}</span> : null}
          {data.author_name && date ? <span aria-hidden>·</span> : null}
          {date ? <span>{date}</span> : null}
        </div>
      </div>
    </article>
  );

  return linkWrap(card, data.link, data.title, previewAttributes);
}
