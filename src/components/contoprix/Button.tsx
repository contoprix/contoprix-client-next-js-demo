import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { ButtonComponentSettings } from "@/contoprix/generated";

const STYLES: Record<string, string> = {
  primary: "bg-orange-600 text-white hover:bg-orange-700",
  secondary: "bg-slate-950 text-white hover:bg-slate-800",
  outline: "border border-slate-300 text-slate-950 hover:border-orange-300",
};

export default function Button(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<ButtonComponentSettings>(props);
  if (!data?.label || !data?.url) return null;

  const style = STYLES[data.style ?? "primary"] ?? STYLES.primary;

  return (
    <a
      href={data.url}
      target={data.open_in_new_tab ? "_blank" : undefined}
      rel={data.open_in_new_tab ? "noopener noreferrer" : undefined}
      className={`inline-flex items-center px-5 py-2.5 text-sm font-medium transition-colors ${style}`}
      {...previewAttributes}
    >
      {data.label}
    </a>
  );
}
