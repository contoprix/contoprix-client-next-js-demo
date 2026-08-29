import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { CardGridComponentSettings } from "@/contoprix/generated";
import Card from "./Card";

const COLUMN_CLASSES: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export default function CardGrid(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<CardGridComponentSettings>(props);
  const cards = data?.cards ?? [];
  if (cards.length === 0) return null;

  const columnClass = COLUMN_CLASSES[data?.columns ?? 3] ?? COLUMN_CLASSES[3];

  return (
    <section className="px-5 py-16 sm:px-8 lg:py-20" {...previewAttributes}>
      <div className="mx-auto max-w-6xl">
        {data?.heading ? (
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{data.heading}</h2>
        ) : null}
        <div className={`grid gap-6 ${columnClass}`}>
          {cards.map((card, index) => (
            <Card key={`${card.title}-${index}`} settings={card as unknown as Record<string, unknown>} />
          ))}
        </div>
      </div>
    </section>
  );
}
