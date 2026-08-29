import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { StatComponentSettings } from "@/contoprix/generated";
import { DynamicIcon } from "./icons";

export default function Stat(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<StatComponentSettings>(props);
  if (!data?.value) return null;

  return (
    <div className="flex flex-col items-center text-center" {...previewAttributes}>
      {data.icon ? <DynamicIcon icon={data.icon} className="mb-2 size-6 text-orange-600" aria-hidden /> : null}
      <p className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        {data.value}
        {data.suffix ? <span className="text-orange-600">{data.suffix}</span> : null}
      </p>
      <p className="mt-1 text-sm text-slate-600">{data.label}</p>
    </div>
  );
}
