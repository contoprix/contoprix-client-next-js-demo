import { resolveContentEntry } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { BlogPostContent } from "@/contoprix/generated";
import Button from "./Button";
import { RichText } from "./richtext";

const CATEGORY_LABELS: Record<string, string> = {
  engineering: "Engineering",
  product: "Product",
  company_news: "Company News",
  tutorial: "Tutorial",
};

export default function BlogPostDetail(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveContentEntry<Partial<BlogPostContent>>(props);
  if (!data) return null;

  const image = mediaUrl(data.featured_image);
  const publishedLabel = formatDate(data.published_at);

  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8" {...previewAttributes}>
      {data.category ? (
        <span className="w-fit border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
          {CATEGORY_LABELS[data.category] ?? data.category}
        </span>
      ) : null}
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        {data.title ?? "Untitled post"}
      </h1>
      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        {data.author ? <span>{data.author}</span> : null}
        {data.author && publishedLabel ? <span aria-hidden>·</span> : null}
        {publishedLabel ? <span>{publishedLabel}</span> : null}
        {data.reading_minutes ? <span aria-hidden>·</span> : null}
        {data.reading_minutes ? <span>{data.reading_minutes} min read</span> : null}
      </div>

      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- media host isn't a configured next/image remote pattern in this demo
        <img src={image} alt="" className="mt-8 aspect-video w-full object-cover" />
      ) : null}

      <div className="mt-8">
        <RichText value={data.content} />
      </div>

      {data.cta ? (
        <div className="mt-10">
          <Button settings={data.cta as unknown as Record<string, unknown>} />
        </div>
      ) : null}
    </article>
  );
}

function mediaUrl(value: unknown): string | null {
  if (value && typeof value === "object" && "Url" in value && typeof (value as { Url: unknown }).Url === "string") {
    return (value as { Url: string }).Url;
  }
  return null;
}

function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
