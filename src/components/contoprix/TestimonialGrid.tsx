import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { TestimonialGridComponentSettings } from "@/contoprix/generated";
import TestimonialCard from "./TestimonialCard";

const COLUMN_CLASSES: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
};

export default function TestimonialGrid(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<TestimonialGridComponentSettings>(props);
  const testimonials = data?.testimonials ?? [];
  if (testimonials.length === 0) return null;

  const columnClass = COLUMN_CLASSES[data?.columns ?? 3] ?? COLUMN_CLASSES[3];

  return (
    <section className="px-5 py-16 sm:px-8 lg:py-20" {...previewAttributes}>
      <div className="mx-auto max-w-6xl">
        {data?.heading ? (
          <h2 className="mb-10 text-center text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            {data.heading}
          </h2>
        ) : null}
        <div className={`grid gap-6 ${columnClass}`}>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={`${testimonial.author_name}-${index}`} settings={testimonial as unknown as Record<string, unknown>} />
          ))}
        </div>
      </div>
    </section>
  );
}
