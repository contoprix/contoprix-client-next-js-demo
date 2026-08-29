import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { FaqItemComponentSettings } from "@/contoprix/generated";
import { RichText } from "./richtext";

export default function FaqItem(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<FaqItemComponentSettings>(props);
  if (!data?.question) return null;

  return (
    <div className="border border-slate-200 bg-white p-5" {...previewAttributes}>
      <h3 className="text-sm font-semibold text-slate-950">{data.question}</h3>
      {data.answer ? (
        <div className="mt-2 text-sm">
          <RichText value={data.answer} />
        </div>
      ) : null}
    </div>
  );
}
