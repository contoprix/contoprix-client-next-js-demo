import { Phone as PhoneIcon } from "lucide-react";

import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { PhoneComponentSettings } from "@/contoprix/generated";

export default function Phone(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<PhoneComponentSettings>(props);
  if (!data?.number) return null;

  return (
    <a
      href={`tel:${data.number.replace(/[^+\d]/g, "")}`}
      className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-orange-600"
      {...previewAttributes}
    >
      <PhoneIcon className="size-4" aria-hidden />
      {data.label ?? data.number}
    </a>
  );
}
