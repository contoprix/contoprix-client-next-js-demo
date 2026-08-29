import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { AccordionItemComponentSettings } from "@/contoprix/generated";
import { RichText } from "./richtext";

/** Standalone rendering of a single accordion_item (always expanded). Accordion renders its
 * own items with open/close state -- see Accordion.tsx. */
export default function AccordionItem(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<AccordionItemComponentSettings>(props);
  if (!data?.title) return null;

  return (
    <div className="border border-slate-200 bg-white p-5" {...previewAttributes}>
      <h3 className="text-sm font-semibold text-slate-950">{data.title}</h3>
      {data.content ? (
        <div className="mt-2 text-sm">
          <RichText value={data.content} />
        </div>
      ) : null}
    </div>
  );
}
