import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { FeatureGridComponentSettings } from "@/contoprix/generated";
import FeatureCard from "./FeatureCard";

const COLUMN_CLASSES: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export default function FeatureGrid(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<FeatureGridComponentSettings>(props);
  const features = data?.features ?? [];
  if (features.length === 0) return null;

  const columnClass = COLUMN_CLASSES[data?.columns ?? 3] ?? COLUMN_CLASSES[3];

  return (
    <section className="px-5 py-16 sm:px-8 lg:py-20" {...previewAttributes}>
      <div className="mx-auto max-w-6xl">
        {data?.heading || data?.subheading ? (
          <div className="mb-10 max-w-2xl">
            {data.heading ? (
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{data.heading}</h2>
            ) : null}
            {data.subheading ? <p className="mt-3 leading-7 text-slate-600">{data.subheading}</p> : null}
          </div>
        ) : null}
        <div className={`grid gap-6 ${columnClass}`}>
          {features.map((feature, index) => (
            <FeatureCard key={`${feature.title}-${index}`} settings={feature as unknown as Record<string, unknown>} />
          ))}
        </div>
      </div>
    </section>
  );
}
