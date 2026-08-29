import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { CodeBlockComponentSettings } from "@/contoprix/generated";

export default function CodeBlock(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<CodeBlockComponentSettings>(props);
  if (!data?.code) return null;

  const lines = data.code.split("\n");

  return (
    <div className="overflow-hidden border border-slate-800 bg-slate-950" {...previewAttributes}>
      {data.filename || data.language ? (
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs font-medium text-slate-400">
          <span>{data.filename ?? ""}</span>
          {data.language ? <span className="uppercase tracking-wide">{data.language}</span> : null}
        </div>
      ) : null}
      <pre className="overflow-x-auto px-4 py-4 text-xs leading-6 text-slate-100">
        <code>
          {data.show_line_numbers
            ? lines.map((line, index) => (
                <div key={index} className="flex">
                  <span className="mr-4 w-6 shrink-0 select-none text-right text-slate-600">{index + 1}</span>
                  <span>{line}</span>
                </div>
              ))
            : data.code}
        </code>
      </pre>
    </div>
  );
}
