"use client";

import type {
  ContoprixComponentProps
} from "@contoprix/react";

export default function HeaderActionButtons({
  content
}: ContoprixComponentProps) {
  return (
    <section>

      <pre>
        {JSON.stringify(content, null, 2)}
      </pre>

    </section>
  );
}
