import { CheckCircle2 } from "lucide-react";

import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { DoctorCardComponentSettings } from "@/contoprix/generated";
import { initials, linkWrap, mediaUrl } from "./media";

export default function DoctorCard(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<DoctorCardComponentSettings>(props);
  if (!data?.name) return null;

  const photo = mediaUrl(data.photo);

  const card = (
    <article className="group flex h-full flex-col items-center border border-slate-200 bg-white p-6 text-center transition-colors hover:border-orange-300">
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element -- media host isn't a configured next/image remote pattern in this demo
        <img src={photo} alt="" className="size-20 rounded-full object-cover" />
      ) : (
        <span className="flex size-20 items-center justify-center rounded-full bg-slate-100 text-lg font-medium text-slate-500">
          {initials(data.name)}
        </span>
      )}

      <h3 className="mt-4 text-base font-semibold text-slate-950">{data.name}</h3>
      {data.specialty ? <p className="mt-1 text-sm text-slate-600">{data.specialty}</p> : null}
      {data.credentials ? <p className="mt-1 text-xs text-slate-500">{data.credentials}</p> : null}
      {data.location ? <p className="mt-2 text-xs text-slate-500">{data.location}</p> : null}
      {data.accepting_new_patients ? (
        <span className="mt-3 inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          <CheckCircle2 className="size-3" aria-hidden />
          Accepting new patients
        </span>
      ) : null}
      {data.link?.label ? (
        <span className="mt-4 text-sm font-medium text-orange-600 group-hover:text-orange-700">
          {data.link.label} →
        </span>
      ) : null}
    </article>
  );

  return linkWrap(card, data.link, data.name, previewAttributes);
}
