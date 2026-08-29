import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { ImageTextComponentSettings } from "@/contoprix/generated";
import Button from "./Button";
import { RichText } from "./richtext";
import { mediaUrl } from "./media";

export default function ImageTextBlock(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<ImageTextComponentSettings>(props);
  const image = mediaUrl(data?.image);
  if (!image && !data?.heading && !data?.body) return null;

  return (
    <section className="px-5 py-16 sm:px-8 lg:py-20" {...previewAttributes}>
      <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- media host isn't a configured next/image remote pattern in this demo
          <img src={image} alt="" className="w-full object-cover" />
        ) : null}
        <div>
          {data?.heading ? (
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{data.heading}</h2>
          ) : null}
          {data?.body ? (
            <div className="mt-4">
              <RichText value={data.body} />
            </div>
          ) : null}
          {data?.cta ? (
            <div className="mt-6">
              <Button settings={data.cta as unknown as Record<string, unknown>} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
