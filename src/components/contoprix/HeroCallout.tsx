"use client";

import type { ContoprixComponentProps } from "@contoprix/react";
import type { HeroCalloutComponentSettings } from "../../contoprix/generated";

export default function HeroCallout({ content }: ContoprixComponentProps) {
  // content is unknown at the ContoprixComponentProps boundary -- narrowed here to the
  // shape generate.ts produced for "hero_callout". Absent/never-filled-in optional
  // fields come through as null, not undefined, so every generated field type already
  // accounts for that; this cast doesn't add any additional runtime safety beyond it.
  const data = content as HeroCalloutComponentSettings | undefined;

  return (
    <section>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </section>
  );
}
