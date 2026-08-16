"use client";

import type { ContoprixComponentProps } from "@contoprix/react";
import type { CapabilityItemComponentSettings } from "../../contoprix/generated";

export default function CapabilityItem({ content }: ContoprixComponentProps) {
  // content is unknown at the ContoprixComponentProps boundary -- narrowed here to the
  // shape generate.ts produced for "capability_item". Absent/never-filled-in optional
  // fields come through as null, not undefined, so every generated field type already
  // accounts for that; this cast doesn't add any additional runtime safety beyond it.
  const data = content as CapabilityItemComponentSettings | undefined;

  return (
    <section>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </section>
  );
}
