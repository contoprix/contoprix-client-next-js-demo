import { Mail } from "lucide-react";

import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { EmailComponentSettings } from "@/contoprix/generated";

export default function Email(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<EmailComponentSettings>(props);
  if (!data?.address) return null;

  return (
    <a
      href={`mailto:${data.address}`}
      className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-orange-600"
      {...previewAttributes}
    >
      <Mail className="size-4" aria-hidden />
      {data.label ?? data.address}
    </a>
  );
}
