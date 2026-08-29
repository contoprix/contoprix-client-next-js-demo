import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { StatsGridComponentSettings } from "@/contoprix/generated";
import Stat from "./Stat";

const COLUMN_CLASSES: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export default function StatsGrid(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<StatsGridComponentSettings>(props);
  const stats = data?.stats ?? [];
  if (stats.length === 0) return null;

  const columnClass = COLUMN_CLASSES[data?.columns ?? 4] ?? COLUMN_CLASSES[4];

  return (
    <section className="border-y border-slate-200 bg-slate-50 px-5 py-16 sm:px-8" {...previewAttributes}>
      <div className="mx-auto max-w-6xl">
        {data?.heading ? (
          <h2 className="mb-10 text-center text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            {data.heading}
          </h2>
        ) : null}
        <div className={`grid gap-8 ${columnClass}`}>
          {stats.map((stat, index) => (
            <Stat key={`${stat.label}-${index}`} settings={stat as unknown as Record<string, unknown>} />
          ))}
        </div>
      </div>
    </section>
  );
}
