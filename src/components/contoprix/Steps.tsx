import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { StepComponentSettings, StepsComponentSettings } from "@/contoprix/generated";
import { RichText } from "./richtext";
import { mediaUrl } from "./media";

export default function Steps(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<StepsComponentSettings>(props);
  const steps = data?.steps ?? [];
  if (steps.length === 0) return null;

  return (
    <section className="px-5 py-16 sm:px-8 lg:py-20" {...previewAttributes}>
      <div className="mx-auto max-w-3xl">
        {data?.heading ? (
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{data.heading}</h2>
        ) : null}
        <ol className="space-y-6 border-l border-slate-200 pl-8">
          {steps.map((step, index) => (
            <StepRow key={`${step.title}-${index}`} step={step} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function StepRow({ step, index }: { step: StepComponentSettings; index: number }) {
  const image = mediaUrl(step.image);

  return (
    <li className="relative">
      <span className="absolute -left-[calc(2rem+0.5px)] flex size-7 items-center justify-center rounded-full bg-orange-600 text-sm font-semibold text-white">
        {step.number ?? index + 1}
      </span>
      <h3 className="text-base font-semibold text-slate-950">{step.title}</h3>
      {step.content ? (
        <div className="mt-1 text-sm">
          <RichText value={step.content} />
        </div>
      ) : null}
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- media host isn't a configured next/image remote pattern in this demo
        <img src={image} alt="" className="mt-3 w-full max-w-md object-cover" />
      ) : null}
    </li>
  );
}
