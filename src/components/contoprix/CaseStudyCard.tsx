import { Briefcase } from "lucide-react";

import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { CaseStudyCardComponentSettings } from "@/contoprix/generated";
import { linkWrap, mediaUrl } from "./media";

export default function CaseStudyCard(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<CaseStudyCardComponentSettings>(props);
  if (!data?.title) return null;

  const image = mediaUrl(data.image);
  const clientLogo = mediaUrl(data.client_logo);

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
            <Briefcase className="size-10" aria-hidden />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          {clientLogo ? (
            // eslint-disable-next-line @next/next/no-img-element -- media host isn't a configured next/image remote pattern in this demo
            <img src={clientLogo} alt="" className="size-6 object-contain" />
          ) : null}
          {data.client_name ? <span className="text-sm font-medium text-slate-600">{data.client_name}</span> : null}
          {data.industry ? (
            <span className="ml-auto border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500">
              {data.industry}
            </span>
          ) : null}
        </div>

        <h3 className="mt-3 text-base font-semibold leading-snug text-slate-950">{data.title}</h3>
        {data.summary ? <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{data.summary}</p> : null}

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
