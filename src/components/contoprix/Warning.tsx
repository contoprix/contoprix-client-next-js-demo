import { AlertTriangle } from "lucide-react";

import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { WarningComponentSettings } from "@/contoprix/generated";
import { RichText } from "./richtext";

export default function Warning(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<WarningComponentSettings>(props);
  if (!data?.content) return null;

  return (
    <div className="flex gap-3 border border-amber-200 bg-amber-50 p-4 text-amber-900" {...previewAttributes}>
      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="text-sm leading-6">
        <RichText value={data.content} />
      </div>
    </div>
  );
}
