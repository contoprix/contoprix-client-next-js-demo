import { MapPin } from "lucide-react";

import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { AddressComponentComponentSettings } from "@/contoprix/generated";

export default function AddressComponent(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<AddressComponentComponentSettings>(props);
  if (!data?.street_1) return null;

  const cityLine = [data.city, data.region, data.postal_code].filter(Boolean).join(", ");

  return (
    <address className="flex items-start gap-2 text-sm not-italic text-slate-600" {...previewAttributes}>
      <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden />
      <span>
        {data.street_1}
        {data.street_2 ? <>, {data.street_2}</> : null}
        {cityLine ? (
          <>
            <br />
            {cityLine}
          </>
        ) : null}
        {data.country ? (
          <>
            <br />
            {data.country}
          </>
        ) : null}
      </span>
    </address>
  );
}
