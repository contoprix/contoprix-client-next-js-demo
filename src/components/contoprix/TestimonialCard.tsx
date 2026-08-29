import { Quote, Star } from "lucide-react";

import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { TestimonialCardComponentSettings } from "@/contoprix/generated";
import { initials, mediaUrl } from "./media";

export default function TestimonialCard(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<TestimonialCardComponentSettings>(props);
  if (!data?.quote) return null;

  const avatar = mediaUrl(data.avatar);
  const companyLogo = mediaUrl(data.company_logo);

  return (
    <figure className="flex h-full flex-col border border-slate-200 bg-white p-6" {...previewAttributes}>
      <Quote className="size-6 text-orange-300" aria-hidden />
      <blockquote className="mt-3 flex-1 text-sm leading-6 text-slate-700">&ldquo;{data.quote}&rdquo;</blockquote>

      {typeof data.rating === "number" ? (
        <div className="mt-3 flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`size-3.5 ${index < Math.round(data.rating!) ? "fill-orange-400 text-orange-400" : "text-slate-200"}`}
              aria-hidden
            />
          ))}
        </div>
      ) : null}

      <figcaption className="mt-4 flex items-center gap-3">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element -- media host isn't a configured next/image remote pattern in this demo
          <img src={avatar} alt="" className="size-9 rounded-full object-cover" />
        ) : (
          <span className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-500">
            {initials(data.author_name)}
          </span>
        )}
        <div>
          <p className="text-sm font-medium text-slate-950">{data.author_name}</p>
          {data.author_title ? <p className="text-xs text-slate-500">{data.author_title}</p> : null}
        </div>
        {companyLogo ? (
          // eslint-disable-next-line @next/next/no-img-element -- media host isn't a configured next/image remote pattern in this demo
          <img src={companyLogo} alt="" className="ml-auto h-5 w-auto object-contain" />
        ) : null}
      </figcaption>
    </figure>
  );
}
