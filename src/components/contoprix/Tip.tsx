import { Lightbulb } from "lucide-react";

import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { TipComponentSettings } from "@/contoprix/generated";
import { RichText } from "./richtext";

export default function Tip(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<TipComponentSettings>(props);
  if (!data?.content) return null;

  return (
    <div className="flex gap-3 border border-emerald-200 bg-emerald-50 p-4 text-emerald-900" {...previewAttributes}>
      <Lightbulb className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="text-sm leading-6">
        <RichText value={data.content} />
      </div>
    </div>
  );
}
