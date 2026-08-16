import { ArrowUpRight } from "lucide-react";

import type { ContoprixComponentProps } from "@contoprix/react";
import type { CapabilitiesSectionComponentSettings, CapabilityItemComponentSettings } from "@/contoprix/generated";
import { resolveIcon } from "./icons";

export default function CapabilitiesSectionDetail({ content }: ContoprixComponentProps) {
  const data = content as CapabilitiesSectionComponentSettings | undefined;
  const items = (data?.capability_items ?? [])
    .map((wrapper) => wrapper.capability)
    .filter((item): item is CapabilityItemComponentSettings => Boolean(item?.title));

  if (!data?.heading && items.length === 0) return null;

  return (
    <section className="bg-slate-50 px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          {data?.eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">{data.eyebrow}</p>
          ) : null}
          {data?.heading ? (
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{data.heading}</h2>
          ) : null}
          {data?.description ? <p className="mt-4 leading-7 text-slate-600">{data.description}</p> : null}
        </div>

        {items.length > 0 ? (
          <div className="mt-12 grid gap-px overflow-hidden border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
              <CapabilityCard key={`${item.title}-${index}`} item={item} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function CapabilityCard({ item }: { item: CapabilityItemComponentSettings }) {
  const Icon = resolveIcon(item.icon);

  const body = (
    <>
      <span className="inline-flex size-10 items-center justify-center border border-orange-200 bg-orange-50 text-orange-600">
        <Icon className="size-[18px]" aria-hidden />
      </span>
      <h3 className="mt-6 text-base font-semibold text-slate-950">{item.title}</h3>
      {item.description ? <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p> : null}
      {item.link_text && item.link ? (
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-600">
          {item.link_text}
          <ArrowUpRight className="size-4" aria-hidden />
        </span>
      ) : null}
    </>
  );

  const className = `group relative flex min-h-64 flex-col bg-white p-6 transition-colors ${item.highlight ? "ring-1 ring-inset ring-orange-300" : ""} ${item.link ? "hover:bg-orange-50/40" : ""}`;

  if (item.link) {
    return (
      <a href={item.link} className={className} aria-label={item.title}>
        {body}
      </a>
    );
  }

  return <article className={className}>{body}</article>;
}
