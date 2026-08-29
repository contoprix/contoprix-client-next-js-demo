import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { ApiEndpointComponentSettings } from "@/contoprix/generated";

const METHOD_STYLES: Record<string, string> = {
  GET: "bg-sky-600",
  POST: "bg-emerald-600",
  PUT: "bg-amber-600",
  PATCH: "bg-amber-600",
  DELETE: "bg-rose-600",
};

export default function ApiEndpoint(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<ApiEndpointComponentSettings>(props);
  if (!data?.path) return null;

  return (
    <div className="border border-slate-200 bg-white p-4" {...previewAttributes}>
      <div className="flex items-center gap-3">
        <span className={`px-2 py-0.5 text-xs font-semibold text-white ${METHOD_STYLES[data.method] ?? "bg-slate-600"}`}>
          {data.method}
        </span>
        <code className="text-sm text-slate-950">{data.path}</code>
      </div>
      {data.description ? <p className="mt-2 text-sm leading-6 text-slate-600">{data.description}</p> : null}
    </div>
  );
}
