import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { StepComponentSettings } from "@/contoprix/generated";
import { RichText } from "./richtext";
import { mediaUrl } from "./media";

/** Standalone rendering of a single step. Steps renders its own numbered list of steps --
 * see Steps.tsx. */
export default function Step(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<StepComponentSettings>(props);
  if (!data?.title) return null;

  const image = mediaUrl(data.image);

  return (
    <div className="border border-slate-200 bg-white p-5" {...previewAttributes}>
      <div className="flex items-center gap-3">
        {typeof data.number === "number" ? (
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-600 text-sm font-semibold text-white">
            {data.number}
          </span>
        ) : null}
        <h3 className="text-sm font-semibold text-slate-950">{data.title}</h3>
      </div>
      {data.content ? (
        <div className="mt-2 text-sm">
          <RichText value={data.content} />
        </div>
      ) : null}
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- media host isn't a configured next/image remote pattern in this demo
        <img src={image} alt="" className="mt-3 w-full object-cover" />
      ) : null}
    </div>
  );
}
