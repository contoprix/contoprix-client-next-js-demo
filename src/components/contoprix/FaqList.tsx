import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { FaqListComponentSettings } from "@/contoprix/generated";
import FaqItem from "./FaqItem";

export default function FaqList(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<FaqListComponentSettings>(props);
  const items = data?.items ?? [];
  if (items.length === 0) return null;

  return (
    <section className="px-5 py-16 sm:px-8 lg:py-20" {...previewAttributes}>
      <div className="mx-auto max-w-3xl">
        {data?.heading ? (
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{data.heading}</h2>
        ) : null}
        <div className="space-y-3">
          {items.map((item, index) => (
            <FaqItem key={`${item.question}-${index}`} settings={item as unknown as Record<string, unknown>} />
          ))}
        </div>
      </div>
    </section>
  );
}
