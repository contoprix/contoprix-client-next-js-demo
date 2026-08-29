import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { ParameterTableComponentSettings } from "@/contoprix/generated";

/** `parameters` is a free-form `json` field -- schema-store doesn't constrain its shape.
 * Handles the two shapes an editor would plausibly enter: an array of parameter objects
 * (rendered as a table), or a flat name/value map. Anything else falls back to a raw dump
 * rather than silently dropping the content. */
export default function ParameterTable(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<ParameterTableComponentSettings>(props);
  const parameters = data?.parameters;
  if (!parameters) return null;

  if (Array.isArray(parameters) && parameters.length > 0 && parameters.every(isRecord)) {
    const columns = Array.from(new Set(parameters.flatMap((row) => Object.keys(row))));

    return (
      <div className="overflow-x-auto border border-slate-200" {...previewAttributes}>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-2">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {parameters.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column} className="px-4 py-2 align-top text-slate-700">
                    {formatCell(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (isRecord(parameters)) {
    const entries = Object.entries(parameters);
    if (entries.length === 0) return null;

    return (
      <div className="overflow-hidden border border-slate-200" {...previewAttributes}>
        <table className="w-full text-left text-sm">
          <tbody className="divide-y divide-slate-200">
            {entries.map(([name, value]) => (
              <tr key={name}>
                <td className="w-1/3 bg-slate-50 px-4 py-2 font-mono text-xs font-medium text-slate-700">{name}</td>
                <td className="px-4 py-2 text-slate-700">{formatCell(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatCell(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
