"use client";

import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { CapabilityItemComponentSettings } from "../../contoprix/generated";

export default function CapabilityItem(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<CapabilityItemComponentSettings>(props);

  return (
    <section {...previewAttributes}>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </section>
  );
}
