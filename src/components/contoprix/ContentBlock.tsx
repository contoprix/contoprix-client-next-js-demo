import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { ContentBlockComponentSettings } from "@/contoprix/generated";
import { RichText } from "./richtext";
import { mediaUrl } from "./media";

export default function ContentBlock(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<ContentBlockComponentSettings>(props);
  if (!data?.heading && !data?.body && !data?.image) return null;

  const image = mediaUrl(data.image);
  const sideBySide = data.layout === "side-by-side" && image;

  return (
    <section className="px-5 py-16 sm:px-8 lg:py-20" {...previewAttributes}>
      <div className={`mx-auto max-w-5xl ${sideBySide ? "grid items-center gap-10 lg:grid-cols-2" : "max-w-3xl"}`}>
        {image ? (
          <div className={sideBySide ? "" : "mb-8"}>
            {/* eslint-disable-next-line @next/next/no-img-element -- media host isn't a configured next/image remote pattern in this demo */}
            <img src={image} alt="" className="w-full object-cover" />
          </div>
        ) : null}
        <div>
          {data.heading ? (
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{data.heading}</h2>
          ) : null}
          {data.body ? (
            <div className="mt-4">
              <RichText value={data.body} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
