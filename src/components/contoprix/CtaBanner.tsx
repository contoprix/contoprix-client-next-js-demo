import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { CtaBannerComponentSettings } from "@/contoprix/generated";
import Button from "./Button";

export default function CtaBanner(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<CtaBannerComponentSettings>(props);
  if (!data?.heading) return null;

  return (
    <section
      className="px-5 py-16 text-center sm:px-8 lg:py-20"
      style={data.background_color ? { backgroundColor: data.background_color } : undefined}
      {...previewAttributes}
    >
      <div className="mx-auto max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{data.heading}</h2>
        {data.subheading ? <p className="mt-4 leading-7 text-slate-600">{data.subheading}</p> : null}
        {data.button ? (
          <div className="mt-8">
            <Button settings={data.button as unknown as Record<string, unknown>} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
