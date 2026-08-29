import { AlertTriangle, CheckCircle2, Info, OctagonAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { CalloutComponentSettings } from "@/contoprix/generated";
import { RichText } from "./richtext";

const STYLES: Record<string, { icon: LucideIcon; className: string }> = {
  info: { icon: Info, className: "border-sky-200 bg-sky-50 text-sky-900" },
  success: { icon: CheckCircle2, className: "border-emerald-200 bg-emerald-50 text-emerald-900" },
  warning: { icon: AlertTriangle, className: "border-amber-200 bg-amber-50 text-amber-900" },
  danger: { icon: OctagonAlert, className: "border-rose-200 bg-rose-50 text-rose-900" },
};

export default function Callout(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<CalloutComponentSettings>(props);
  if (!data?.content) return null;

  const { icon: Icon, className } = STYLES[data.type ?? "info"] ?? STYLES.info;

  return (
    <div className={`flex gap-3 border p-4 ${className}`} {...previewAttributes}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="text-sm leading-6">
        {data.title ? <p className="font-semibold">{data.title}</p> : null}
        <RichText value={data.content} />
      </div>
    </div>
  );
}
